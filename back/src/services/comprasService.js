import { supabase, supabaseAdmin } from '../config/supabase.js';

/**
 * Cria uma nova compra com status pendente
 */
export const criarCompra = async (usuarioId, quantidade, valorTotal) => {
  try {
    // Calcula o bônus (1 palha de brinde a cada 5 compradas)
    const bonus = Math.floor(quantidade / 5);

    const { data, error } = await supabase
      .from('compras')
      .insert({
        usuario_id: usuarioId,
        quantidade,
        valor_total: valorTotal,
        bonus,
        status: 'pendente'
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao criar compra:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Confirma uma compra (apenas vendedor)
 */
export const confirmarCompra = async (compraId, vendedorId) => {
  try {
    // Verifica se a compra existe e está pendente
    const { data: compra, error: checkError } = await supabase
      .from('compras')
      .select('*')
      .eq('id', compraId)
      .single();

    if (checkError) throw checkError;

    if (!compra) {
      return { success: false, error: 'Compra não encontrada' };
    }

    if (compra.status !== 'pendente') {
      return { success: false, error: 'Esta compra já foi processada' };
    }

    // Atualiza a compra
    const { data, error } = await supabase
      .from('compras')
      .update({
        status: 'confirmado',
        confirmado_por: vendedorId,
        confirmado_em: new Date().toISOString(),
        vendedor_id: vendedorId
      })
      .eq('id', compraId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao confirmar compra:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Rejeita uma compra (apenas vendedor)
 */
export const rejeitarCompra = async (compraId, vendedorId) => {
  try {
    const { data, error } = await supabase
      .from('compras')
      .update({
        status: 'rejeitado',
        confirmado_por: vendedorId,
        confirmado_em: new Date().toISOString()
      })
      .eq('id', compraId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao rejeitar compra:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Lista compras do usuário ou vendedor
 */
export const listarCompras = async (usuarioId, isVendedor = false, status = null) => {
  try {
    let query = supabase.from('compras').select('*');

    // Se não for vendedor, filtra por usuário
    if (!isVendedor) {
      query = query.eq('usuario_id', usuarioId);
    }

    // Filtra por status se fornecido
    if (status) {
      query = query.eq('status', status);
    }

    // Ordena por data de criação (mais recente primeiro)
    query = query.order('criado_em', { ascending: false });

    const { data: compras, error } = await query;

    if (error) throw error;

    // Se for vendedor, busca os nomes dos clientes
    if (isVendedor && compras && compras.length > 0) {
      const usuariosIds = [...new Set(compras.map(c => c.usuario_id))];
      
      const usuariosPromises = usuariosIds.map(async (id) => {
        const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);
        if (error) {
          return { id, nome: 'Cliente', email: '' };
        }
        return {
          id: data.user.id,
          nome: data.user.user_metadata?.nome || data.user.email?.split('@')[0] || 'Cliente',
          email: data.user.email
        };
      });

      const usuariosInfo = await Promise.all(usuariosPromises);

      // Adiciona o nome do cliente em cada compra
      const comprasComNome = compras.map(compra => ({
        ...compra,
        cliente_nome: usuariosInfo.find(u => u.id === compra.usuario_id)?.nome || 'Cliente',
        cliente_email: usuariosInfo.find(u => u.id === compra.usuario_id)?.email || ''
      }));

      return { success: true, data: comprasComNome };
    }

    return { success: true, data: compras };
  } catch (error) {
    console.error('Erro ao listar compras:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Busca uma compra por ID
 */
export const buscarCompraPorId = async (compraId) => {
  try {
    const { data, error } = await supabase
      .from('compras')
      .select('*')
      .eq('id', compraId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar compra:', error);
    return { success: false, error: error.message };
  }
};


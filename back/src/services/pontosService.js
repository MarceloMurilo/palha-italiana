import { supabase, supabaseAdmin } from '../config/supabase.js';

/**
 * Busca pontos de fidelidade do usuário
 */
export const buscarPontos = async (usuarioId) => {
  try {
    const { data, error } = await supabase
      .from('pontos_fidelidade')
      .select('*')
      .eq('usuario_id', usuarioId)
      .single();

    if (error) {
      // Se não existir registro, retorna 0 pontos
      if (error.code === 'PGRST116') {
        return {
          success: true,
          data: {
            usuario_id: usuarioId,
            total_pontos: 0,
            atualizado_em: null
          }
        };
      }
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar pontos:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Busca resumo de vendas (para vendedores)
 */
export const buscarResumoVendas = async () => {
  try {
    const { data, error } = await supabase
      .from('resumo_vendas')
      .select('*');

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar resumo de vendas:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Calcula estatísticas do usuário
 */
export const buscarEstatisticasUsuario = async (usuarioId) => {
  try {
    // Busca total de compras confirmadas
    const { data: compras, error: comprasError } = await supabase
      .from('compras')
      .select('quantidade, bonus, valor_total')
      .eq('usuario_id', usuarioId)
      .eq('status', 'confirmado');

    if (comprasError) throw comprasError;

    // Calcula estatísticas
    const totalCompras = compras?.length || 0;
    const totalPalhas = compras?.reduce((sum, c) => sum + c.quantidade, 0) || 0;
    const totalBrindes = compras?.reduce((sum, c) => sum + c.bonus, 0) || 0;
    const valorTotalGasto = compras?.reduce((sum, c) => sum + parseFloat(c.valor_total), 0) || 0;

    // Calcula brindes disponíveis (baseado em palhas)
    const brindesDisponiveis = Math.floor(totalPalhas / 5);

    return {
      success: true,
      data: {
        total_compras: totalCompras,
        total_palhas: totalPalhas,
        total_brindes: totalBrindes,
        brindes_disponiveis: brindesDisponiveis,
        valor_total_gasto: valorTotalGasto.toFixed(2)
      }
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Lista clientes com brindes disponíveis (para vendedor)
 */
export const listarClientesComBrindes = async () => {
  try {
    // Busca todas as compras confirmadas agrupadas por usuário
    const { data: compras, error } = await supabase
      .from('compras')
      .select('usuario_id, quantidade')
      .eq('status', 'confirmado');

    if (error) throw error;

    // Agrupa por usuário e calcula brindes disponíveis
    const clientesMap = {};
    
    compras?.forEach(compra => {
      if (!clientesMap[compra.usuario_id]) {
        clientesMap[compra.usuario_id] = {
          usuario_id: compra.usuario_id,
          total_palhas: 0
        };
      }
      clientesMap[compra.usuario_id].total_palhas += compra.quantidade;
    });

    // Converte para array e calcula brindes
    const clientes = Object.values(clientesMap).map(cliente => ({
      ...cliente,
      brindes_disponiveis: Math.floor(cliente.total_palhas / 5)
    })).filter(cliente => cliente.brindes_disponiveis > 0); // Apenas com brindes

    // Busca informações dos usuários (nome e email)
    const usuariosIds = clientes.map(c => c.usuario_id);
    
    if (usuariosIds.length === 0) {
      return { success: true, data: [] };
    }

    // Busca dados dos usuários usando Admin API
    const usuariosPromises = usuariosIds.map(async (id) => {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);
      if (error) {
        console.error(`Erro ao buscar usuário ${id}:`, error);
        return { id, nome: 'Usuário', email: id };
      }
      return {
        id: data.user.id,
        nome: data.user.user_metadata?.nome || data.user.email?.split('@')[0] || 'Usuário',
        email: data.user.email
      };
    });

    const usuariosInfo = await Promise.all(usuariosPromises);

    // Combina dados
    const clientesComInfo = clientes.map(cliente => {
      const usuario = usuariosInfo.find(u => u.id === cliente.usuario_id);
      return {
        ...cliente,
        nome: usuario?.nome || 'Usuário',
        email: usuario?.email || cliente.usuario_id
      };
    });

    return { success: true, data: clientesComInfo };
  } catch (error) {
    console.error('Erro ao listar clientes com brindes:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Dá baixa no brinde do cliente (mantém palhas restantes)
 */
export const darBaixaNoBrinde = async (usuarioId, vendedorId) => {
  try {
    // Busca total de palhas do cliente
    const { data: compras, error: comprasError } = await supabase
      .from('compras')
      .select('quantidade, bonus')
      .eq('usuario_id', usuarioId)
      .eq('status', 'confirmado');

    if (comprasError) throw comprasError;

    const totalPalhas = compras?.reduce((sum, c) => sum + c.quantidade, 0) || 0;
    const totalBrindes = Math.floor(totalPalhas / 5);
    const palhasRestantes = totalPalhas % 5; // Palhas que não viraram brinde
    const palhasUsadas = totalBrindes * 5; // Palhas que viraram brinde

    // Deleta todas as compras confirmadas
    const { error: deleteError } = await supabase
      .from('compras')
      .delete()
      .eq('usuario_id', usuarioId)
      .eq('status', 'confirmado');

    if (deleteError) throw deleteError;

    // Se tem palhas restantes, cria uma nova compra "manual" para manter o progresso
    if (palhasRestantes > 0) {
      const { error: insertError } = await supabase
        .from('compras')
        .insert({
          usuario_id: usuarioId,
          vendedor_id: vendedorId,
          quantidade: palhasRestantes,
          valor_total: palhasRestantes * 5, // R$ 5 por palha
          bonus: 0,
          status: 'confirmado',
          confirmado_por: vendedorId, // ID do vendedor que deu baixa
          confirmado_em: new Date().toISOString()
        });

      if (insertError) throw insertError;
    }

    // Atualiza os pontos (apenas as palhas restantes)
    const { error: pontosError } = await supabase
      .from('pontos_fidelidade')
      .update({ 
        total_pontos: palhasRestantes, 
        atualizado_em: new Date().toISOString() 
      })
      .eq('usuario_id', usuarioId);

    if (pontosError) throw pontosError;

    return { 
      success: true, 
      message: `Brinde entregue! ${palhasUsadas} palhas foram zeradas. ${palhasRestantes > 0 ? `Cliente mantém ${palhasRestantes} palha(s) acumulada(s).` : ''}`,
      palhas_restantes: palhasRestantes
    };
  } catch (error) {
    console.error('Erro ao dar baixa no brinde:', error);
    return { success: false, error: error.message };
  }
};


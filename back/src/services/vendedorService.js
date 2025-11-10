import { supabase } from '../config/supabase.js';

/**
 * Verifica se um usuário é vendedor
 */
export const verificarVendedor = async (usuarioId) => {
  try {
    const { data, error } = await supabase
      .from('vendedores')
      .select('*')
      .eq('id', usuarioId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: true, isVendedor: false };
      }
      throw error;
    }

    return { success: true, isVendedor: true, data };
  } catch (error) {
    console.error('Erro ao verificar vendedor:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Busca informações do vendedor
 */
export const buscarVendedor = async (usuarioId) => {
  try {
    const { data, error } = await supabase
      .from('vendedores')
      .select('*')
      .eq('id', usuarioId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar vendedor:', error);
    return { success: false, error: error.message };
  }
};


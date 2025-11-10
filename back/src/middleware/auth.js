import { supabase } from '../config/supabase.js';

/**
 * Middleware para verificar autenticação do usuário
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de autenticação não fornecido'
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    // Verifica o token com o Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Token inválido ou expirado'
      });
    }

    // Adiciona o usuário ao request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      error: 'Erro ao validar autenticação'
    });
  }
};

/**
 * Middleware para verificar se o usuário é vendedor
 */
export const isVendedor = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Verifica se o usuário existe na tabela de vendedores
    const { data: vendedor, error } = await supabase
      .from('vendedores')
      .select('id')
      .eq('id', userId)
      .single();

    if (error || !vendedor) {
      return res.status(403).json({
        error: 'Acesso negado. Apenas vendedores podem executar esta ação.'
      });
    }

    req.vendedor = vendedor;
    next();
  } catch (error) {
    console.error('Erro ao verificar vendedor:', error);
    return res.status(500).json({
      error: 'Erro ao verificar permissões'
    });
  }
};


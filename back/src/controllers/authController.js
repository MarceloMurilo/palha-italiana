import { supabase, supabaseAdmin } from '../config/supabase.js';

/**
 * POST /api/auth/register
 * Registra um novo usuário
 */
export const registrar = async (req, res) => {
  try {
    const { email, password, nome, is_vendedor } = req.body;

    console.log('📝 Tentando registrar:', { email, nome, senhaLength: password?.length, isVendedor: is_vendedor });

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'A senha deve ter no mínimo 6 caracteres'
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: nome || '',
          is_vendedor: is_vendedor || false
        }
      }
    });

    if (error) {
      console.error('❌ Erro do Supabase:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('✅ Usuário registrado com sucesso:', data.user?.email);

    // Se for vendedor, adicionar na tabela de vendedores (usando admin client)
    if (is_vendedor && data.user) {
      console.log('🛒 Registrando como vendedor...');
      
      const { error: vendedorError } = await supabaseAdmin
        .from('vendedores')
        .insert({
          id: data.user.id,
          nome: nome || email,
          email: email
        });

      if (vendedorError) {
        console.error('⚠️ Erro ao adicionar vendedor:', vendedorError);
        // Não falha o registro, apenas loga o erro
      } else {
        console.log('✅ Vendedor registrado na tabela!');
      }
    }

    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      data: {
        user: data.user,
        session: data.session
      }
    });
  } catch (error) {
    console.error('Erro no controller de registro:', error);
    return res.status(500).json({
      error: 'Erro ao registrar usuário'
    });
  }
};

/**
 * POST /api/auth/login
 * Faz login de um usuário
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Tentando fazer login:', { email, senhaLength: password?.length });

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios'
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('❌ Erro no login:', error.message, error.status);
      return res.status(401).json({ error: error.message || 'Credenciais inválidas' });
    }

    console.log('✅ Login realizado com sucesso:', data.user?.email);

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      data: {
        user: data.user,
        session: data.session
      }
    });
  } catch (error) {
    console.error('Erro no controller de login:', error);
    return res.status(500).json({
      error: 'Erro ao fazer login'
    });
  }
};

/**
 * POST /api/auth/logout
 * Faz logout do usuário
 */
export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no controller de logout:', error);
    return res.status(500).json({
      error: 'Erro ao fazer logout'
    });
  }
};

/**
 * GET /api/auth/me
 * Retorna informações do usuário autenticado
 */
export const me = async (req, res) => {
  try {
    return res.status(200).json({
      data: req.user
    });
  } catch (error) {
    console.error('Erro no controller me:', error);
    return res.status(500).json({
      error: 'Erro ao buscar informações do usuário'
    });
  }
};


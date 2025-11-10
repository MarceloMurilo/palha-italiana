import * as pontosService from '../services/pontosService.js';

/**
 * GET /api/pontos
 * Retorna os pontos de fidelidade do usuário
 */
export const buscarPontos = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const result = await pontosService.buscarPontos(usuarioId);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({
      data: result.data
    });
  } catch (error) {
    console.error('Erro no controller de buscar pontos:', error);
    return res.status(500).json({
      error: 'Erro ao buscar pontos'
    });
  }
};

/**
 * GET /api/pontos/estatisticas
 * Retorna estatísticas do usuário
 */
export const buscarEstatisticas = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const result = await pontosService.buscarEstatisticasUsuario(usuarioId);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({
      data: result.data
    });
  } catch (error) {
    console.error('Erro no controller de buscar estatísticas:', error);
    return res.status(500).json({
      error: 'Erro ao buscar estatísticas'
    });
  }
};

/**
 * GET /api/resumo-vendas
 * Retorna resumo de vendas (apenas vendedores)
 */
export const buscarResumoVendas = async (req, res) => {
  try {
    const result = await pontosService.buscarResumoVendas();

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({
      data: result.data
    });
  } catch (error) {
    console.error('Erro no controller de buscar resumo de vendas:', error);
    return res.status(500).json({
      error: 'Erro ao buscar resumo de vendas'
    });
  }
};

/**
 * GET /api/pontos/clientes-com-brindes
 * Lista clientes com brindes disponíveis (apenas vendedores)
 */
export const listarClientesComBrindes = async (req, res) => {
  try {
    const result = await pontosService.listarClientesComBrindes();

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({
      data: result.data
    });
  } catch (error) {
    console.error('Erro no controller de listar clientes com brindes:', error);
    return res.status(500).json({
      error: 'Erro ao listar clientes com brindes'
    });
  }
};

/**
 * POST /api/pontos/dar-baixa-brinde/:usuarioId
 * Dá baixa no brinde do cliente (zera palhas e brindes)
 */
export const darBaixaNoBrinde = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const vendedorId = req.user.id; // ID do vendedor logado

    if (!usuarioId) {
      return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }

    const result = await pontosService.darBaixaNoBrinde(usuarioId, vendedorId);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({
      message: result.message
    });
  } catch (error) {
    console.error('Erro no controller de dar baixa no brinde:', error);
    return res.status(500).json({
      error: 'Erro ao dar baixa no brinde'
    });
  }
};


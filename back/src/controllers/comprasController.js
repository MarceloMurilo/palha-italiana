import { validationResult } from 'express-validator';
import * as comprasService from '../services/comprasService.js';
import * as vendedorService from '../services/vendedorService.js';

/**
 * POST /api/compras
 * Cria uma nova compra pendente
 */
export const criarCompra = async (req, res) => {
  try {
    // Valida os dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quantidade, valor_total } = req.body;
    const usuarioId = req.user.id;

    // Validações de negócio
    if (quantidade < 1) {
      return res.status(400).json({
        error: 'Quantidade deve ser maior que zero'
      });
    }

    if (valor_total <= 0) {
      return res.status(400).json({
        error: 'Valor total deve ser maior que zero'
      });
    }

    const result = await comprasService.criarCompra(usuarioId, quantidade, valor_total);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(201).json({
      message: 'Compra criada com sucesso',
      data: result.data
    });
  } catch (error) {
    console.error('Erro no controller de criar compra:', error);
    return res.status(500).json({
      error: 'Erro ao criar compra'
    });
  }
};

/**
 * PATCH /api/compras/:id/confirmar
 * Confirma uma compra (apenas vendedor)
 */
export const confirmarCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const vendedorId = req.user.id;

    const result = await comprasService.confirmarCompra(id, vendedorId);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      message: 'Compra confirmada com sucesso',
      data: result.data
    });
  } catch (error) {
    console.error('Erro no controller de confirmar compra:', error);
    return res.status(500).json({
      error: 'Erro ao confirmar compra'
    });
  }
};

/**
 * PATCH /api/compras/:id/rejeitar
 * Rejeita uma compra (apenas vendedor)
 */
export const rejeitarCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const vendedorId = req.user.id;

    const result = await comprasService.rejeitarCompra(id, vendedorId);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      message: 'Compra rejeitada com sucesso',
      data: result.data
    });
  } catch (error) {
    console.error('Erro no controller de rejeitar compra:', error);
    return res.status(500).json({
      error: 'Erro ao rejeitar compra'
    });
  }
};

/**
 * GET /api/compras
 * Lista compras do usuário ou vendedor
 */
export const listarCompras = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { status } = req.query;

    // Verifica se é vendedor
    const vendedorCheck = await vendedorService.verificarVendedor(usuarioId);
    const isVendedor = vendedorCheck.isVendedor || false;

    const result = await comprasService.listarCompras(usuarioId, isVendedor, status);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({
      data: result.data,
      is_vendedor: isVendedor
    });
  } catch (error) {
    console.error('Erro no controller de listar compras:', error);
    return res.status(500).json({
      error: 'Erro ao listar compras'
    });
  }
};

/**
 * GET /api/compras/:id
 * Busca uma compra específica
 */
export const buscarCompra = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await comprasService.buscarCompraPorId(id);

    if (!result.success) {
      return res.status(404).json({ error: 'Compra não encontrada' });
    }

    return res.status(200).json({
      data: result.data
    });
  } catch (error) {
    console.error('Erro no controller de buscar compra:', error);
    return res.status(500).json({
      error: 'Erro ao buscar compra'
    });
  }
};


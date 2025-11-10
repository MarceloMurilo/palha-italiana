import express from 'express';
import * as pontosController from '../controllers/pontosController.js';
import { authenticateUser, isVendedor } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/pontos:
 *   get:
 *     summary: Retorna os pontos de fidelidade do usuário
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pontos de fidelidade
 *       401:
 *         description: Não autenticado
 */
router.get('/', authenticateUser, pontosController.buscarPontos);

/**
 * @swagger
 * /api/pontos/estatisticas:
 *   get:
 *     summary: Retorna estatísticas do usuário
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do usuário
 *       401:
 *         description: Não autenticado
 */
router.get('/estatisticas', authenticateUser, pontosController.buscarEstatisticas);

/**
 * @swagger
 * /api/resumo-vendas:
 *   get:
 *     summary: Retorna resumo de vendas (apenas vendedores)
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo de vendas
 *       403:
 *         description: Apenas vendedores podem acessar
 */
router.get('/resumo-vendas', authenticateUser, isVendedor, pontosController.buscarResumoVendas);

/**
 * @swagger
 * /api/pontos/clientes-com-brindes:
 *   get:
 *     summary: Lista clientes com brindes disponíveis (apenas vendedores)
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes com brindes
 *       403:
 *         description: Apenas vendedores podem acessar
 */
router.get('/clientes-com-brindes', authenticateUser, isVendedor, pontosController.listarClientesComBrindes);

/**
 * @swagger
 * /api/pontos/dar-baixa-brinde/{usuarioId}:
 *   post:
 *     summary: Dá baixa no brinde do cliente (zera palhas e brindes)
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brinde entregue com sucesso
 *       403:
 *         description: Apenas vendedores podem acessar
 */
router.post('/dar-baixa-brinde/:usuarioId', authenticateUser, isVendedor, pontosController.darBaixaNoBrinde);

export default router;


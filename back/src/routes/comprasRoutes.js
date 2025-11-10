import express from 'express';
import * as comprasController from '../controllers/comprasController.js';
import { authenticateUser, isVendedor } from '../middleware/auth.js';
import { criarCompraValidator } from '../validators/comprasValidator.js';

const router = express.Router();

/**
 * @swagger
 * /api/compras:
 *   post:
 *     summary: Cria uma nova compra pendente
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantidade
 *               - valor_total
 *             properties:
 *               quantidade:
 *                 type: integer
 *                 minimum: 1
 *               valor_total:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Compra criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.post('/', authenticateUser, criarCompraValidator, comprasController.criarCompra);

/**
 * @swagger
 * /api/compras:
 *   get:
 *     summary: Lista compras do usuário
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendente, confirmado, rejeitado]
 *     responses:
 *       200:
 *         description: Lista de compras
 *       401:
 *         description: Não autenticado
 */
router.get('/', authenticateUser, comprasController.listarCompras);

/**
 * @swagger
 * /api/compras/{id}:
 *   get:
 *     summary: Busca uma compra específica
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes da compra
 *       404:
 *         description: Compra não encontrada
 */
router.get('/:id', authenticateUser, comprasController.buscarCompra);

/**
 * @swagger
 * /api/compras/{id}/confirmar:
 *   patch:
 *     summary: Confirma uma compra (apenas vendedor)
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compra confirmada
 *       403:
 *         description: Apenas vendedores podem confirmar
 */
router.patch('/:id/confirmar', authenticateUser, isVendedor, comprasController.confirmarCompra);

/**
 * @swagger
 * /api/compras/{id}/rejeitar:
 *   patch:
 *     summary: Rejeita uma compra (apenas vendedor)
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compra rejeitada
 *       403:
 *         description: Apenas vendedores podem rejeitar
 */
router.patch('/:id/rejeitar', authenticateUser, isVendedor, comprasController.rejeitarCompra);

export default router;


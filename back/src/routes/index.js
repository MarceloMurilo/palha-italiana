import express from 'express';
import authRoutes from './authRoutes.js';
import comprasRoutes from './comprasRoutes.js';
import pontosRoutes from './pontosRoutes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API Palha Italiana funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rotas
router.use('/auth', authRoutes);
router.use('/compras', comprasRoutes);
router.use('/pontos', pontosRoutes);

export default router;


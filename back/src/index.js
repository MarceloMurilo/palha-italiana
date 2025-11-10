import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import routes from './routes/index.js';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de CORS simplificada
const corsOptions = {
  origin: true, // Aceita todas as origens em desenvolvimento
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares globais
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de requisições em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: '🍫 API Palha Italiana - Sistema de Fidelidade',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/api/health'
  });
});

// Rotas da API
app.use('/api', routes);

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.url
  });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro global:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`
  🍫 ====================================
     API Palha Italiana
  ====================================
  
  🚀 Servidor rodando na porta ${PORT}
  📚 Documentação: http://localhost:${PORT}/api-docs
  ❤️  Health check: http://localhost:${PORT}/api/health
  🌍 Ambiente: ${process.env.NODE_ENV || 'development'}
  
  ====================================
  `);
});

export default app;


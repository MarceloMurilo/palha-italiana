import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Palha Italiana - Sistema de Fidelidade',
      version: '1.0.0',
      description: 'API REST para gerenciamento do sistema de fidelidade da Palha Italiana',
      contact: {
        name: 'Palha Italiana',
        email: 'contato@palhaitaliana.com.br'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido no login (Supabase Auth)'
        }
      },
      schemas: {
        Compra: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            usuario_id: {
              type: 'string',
              format: 'uuid'
            },
            vendedor_id: {
              type: 'string',
              format: 'uuid',
              nullable: true
            },
            quantidade: {
              type: 'integer'
            },
            valor_total: {
              type: 'number',
              format: 'float'
            },
            bonus: {
              type: 'integer'
            },
            status: {
              type: 'string',
              enum: ['pendente', 'confirmado', 'rejeitado']
            },
            confirmado_por: {
              type: 'string',
              format: 'uuid',
              nullable: true
            },
            criado_em: {
              type: 'string',
              format: 'date-time'
            },
            confirmado_em: {
              type: 'string',
              format: 'date-time',
              nullable: true
            }
          }
        },
        Pontos: {
          type: 'object',
          properties: {
            usuario_id: {
              type: 'string',
              format: 'uuid'
            },
            total_pontos: {
              type: 'integer'
            },
            atualizado_em: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticação'
      },
      {
        name: 'Compras',
        description: 'Endpoints de gerenciamento de compras'
      },
      {
        name: 'Pontos',
        description: 'Endpoints de pontos de fidelidade'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);


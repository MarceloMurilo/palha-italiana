import { body } from 'express-validator';

export const criarCompraValidator = [
  body('quantidade')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número inteiro maior que zero'),
  body('valor_total')
    .isFloat({ min: 0.01 })
    .withMessage('Valor total deve ser um número maior que zero')
];


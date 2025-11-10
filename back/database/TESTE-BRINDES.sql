-- ========================================
-- 🧪 SCRIPT DE TESTE - SISTEMA DE BRINDES
-- ========================================

-- 📝 INSTRUÇÕES:
-- 1. Substitua UUID_DO_CLIENTE e UUID_DO_VENDEDOR pelos IDs reais
-- 2. Execute este script no Supabase SQL Editor
-- 3. Veja o resultado no painel de pontos

-- ========================================
-- 1️⃣ LIMPAR DADOS DE TESTE (OPCIONAL)
-- ========================================

-- Deletar compras de teste
-- DELETE FROM compras WHERE usuario_id = 'UUID_DO_CLIENTE';

-- Deletar pontos de teste
-- DELETE FROM pontos_fidelidade WHERE usuario_id = 'UUID_DO_CLIENTE';

-- ========================================
-- 2️⃣ CRIAR COMPRAS DE TESTE
-- ========================================

-- Cliente compra 11 palhas (2 compras)
-- Resultado esperado: 2 brindes disponíveis

INSERT INTO compras (usuario_id, vendedor_id, quantidade, valor_total, bonus, status, confirmado_por, criado_em, confirmado_em)
VALUES 
  (
    'UUID_DO_CLIENTE',  -- 👈 SUBSTITUIR
    'UUID_DO_VENDEDOR', -- 👈 SUBSTITUIR
    5,                  -- Quantidade
    25.00,              -- Valor total (5 x R$5)
    1,                  -- Bônus (1 brinde a cada 5)
    'confirmado',       -- Status
    'UUID_DO_VENDEDOR', -- Quem confirmou
    NOW() - INTERVAL '2 days', -- Criado há 2 dias
    NOW() - INTERVAL '1 day'   -- Confirmado há 1 dia
  ),
  (
    'UUID_DO_CLIENTE',  -- 👈 SUBSTITUIR
    'UUID_DO_VENDEDOR', -- 👈 SUBSTITUIR
    6,                  -- Quantidade
    30.00,              -- Valor total (6 x R$5)
    1,                  -- Bônus (1 brinde a cada 5)
    'confirmado',       -- Status
    'UUID_DO_VENDEDOR', -- Quem confirmou
    NOW() - INTERVAL '1 day',  -- Criado há 1 dia
    NOW()                      -- Confirmado agora
  );

-- ========================================
-- 3️⃣ ATUALIZAR PONTOS (CASO TRIGGER NÃO RODE)
-- ========================================

-- Total: 5 + 6 = 11 palhas + 2 bônus = 13 pontos
INSERT INTO pontos_fidelidade (usuario_id, total_pontos, atualizado_em)
VALUES ('UUID_DO_CLIENTE', 13, NOW())
ON CONFLICT (usuario_id) 
DO UPDATE SET 
  total_pontos = 13,
  atualizado_em = NOW();

-- ========================================
-- 4️⃣ VERIFICAR RESULTADO
-- ========================================

-- Ver compras do cliente
SELECT 
  quantidade, 
  bonus, 
  valor_total, 
  status, 
  criado_em
FROM compras
WHERE usuario_id = 'UUID_DO_CLIENTE'
ORDER BY criado_em DESC;

-- Ver pontos do cliente
SELECT 
  total_pontos, 
  atualizado_em
FROM pontos_fidelidade
WHERE usuario_id = 'UUID_DO_CLIENTE';

-- Calcular brindes disponíveis
SELECT 
  SUM(quantidade) as total_palhas,
  SUM(bonus) as total_bonus,
  FLOOR(SUM(quantidade) / 5) as brindes_disponiveis
FROM compras
WHERE usuario_id = 'UUID_DO_CLIENTE'
  AND status = 'confirmado';

-- ========================================
-- 5️⃣ RESULTADO ESPERADO
-- ========================================

-- ✅ Total de palhas: 11
-- ✅ Total de bônus: 2
-- ✅ Brindes disponíveis: 2 (11 ÷ 5 = 2)
-- ✅ Pontos totais: 13 (11 + 2)
-- ✅ Próximo brinde em: 4 palhas (5 - (11 % 5) = 4)

-- ========================================
-- 6️⃣ COMO PEGAR OS UUIDs
-- ========================================

-- Ver seu UUID (usuário logado)
-- SELECT auth.uid();

-- Ver todos os usuários (para pegar UUIDs)
-- SELECT id, email FROM auth.users;

-- Ver vendedores
-- SELECT id, nome, email FROM vendedores;

-- ========================================
-- 7️⃣ SIMULAR DAR BAIXA NO BRINDE
-- ========================================

-- ATENÇÃO: Isso vai DELETAR as compras e ZERAR os pontos!
-- Descomente apenas se quiser testar o zeramento:

-- DELETE FROM compras 
-- WHERE usuario_id = 'UUID_DO_CLIENTE' 
--   AND status = 'confirmado';

-- UPDATE pontos_fidelidade 
-- SET total_pontos = 0, atualizado_em = NOW()
-- WHERE usuario_id = 'UUID_DO_CLIENTE';

-- ========================================
-- 📊 CONSULTAS ÚTEIS
-- ========================================

-- Ver clientes com brindes disponíveis (query do backend)
SELECT 
  usuario_id,
  SUM(quantidade) as total_palhas,
  FLOOR(SUM(quantidade) / 5) as brindes_disponiveis
FROM compras
WHERE status = 'confirmado'
GROUP BY usuario_id
HAVING FLOOR(SUM(quantidade) / 5) > 0
ORDER BY brindes_disponiveis DESC;

-- Ver histórico completo de um cliente
SELECT 
  c.criado_em,
  c.quantidade,
  c.bonus,
  c.valor_total,
  c.status,
  c.confirmado_em,
  v.nome as vendedor
FROM compras c
LEFT JOIN vendedores v ON v.id = c.vendedor_id
WHERE c.usuario_id = 'UUID_DO_CLIENTE'
ORDER BY c.criado_em DESC;


-- ============================================
-- RECALCULAR PONTOS E BRINDES CORRETAMENTE
-- ============================================

-- Este script corrige pontos calculados incorretamente

-- 1. Limpar pontos_fidelidade
TRUNCATE TABLE pontos_fidelidade;

-- 2. Recalcular pontos baseado nas compras confirmadas
INSERT INTO pontos_fidelidade (usuario_id, total_pontos, atualizado_em)
SELECT 
    usuario_id,
    SUM(quantidade + bonus) as total_pontos,
    NOW()
FROM compras
WHERE status = 'confirmado'
GROUP BY usuario_id;

-- 3. Verificar se os brindes estão calculados corretamente nas compras
-- O bonus deve ser: floor(quantidade / 5)
UPDATE compras
SET bonus = FLOOR(quantidade / 5::numeric)
WHERE status = 'confirmado';

-- 4. Recalcular pontos novamente após atualizar brindes
TRUNCATE TABLE pontos_fidelidade;

INSERT INTO pontos_fidelidade (usuario_id, total_pontos, atualizado_em)
SELECT 
    usuario_id,
    SUM(quantidade + bonus) as total_pontos,
    NOW()
FROM compras
WHERE status = 'confirmado'
GROUP BY usuario_id;

-- 5. Mostrar resultado
SELECT 
    u.email,
    COALESCE(pf.total_pontos, 0) as pontos,
    COALESCE(SUM(c.quantidade), 0) as palhas_compradas,
    COALESCE(SUM(c.bonus), 0) as brindes
FROM auth.users u
LEFT JOIN pontos_fidelidade pf ON pf.usuario_id = u.id
LEFT JOIN compras c ON c.usuario_id = u.id AND c.status = 'confirmado'
GROUP BY u.email, pf.total_pontos
ORDER BY pontos DESC;

-- Pronto! ✅


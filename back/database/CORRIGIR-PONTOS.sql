-- ============================================
-- CORRIGIR TABELA PONTOS_FIDELIDADE
-- ============================================

-- 1. Remover a tabela atual
DROP TABLE IF EXISTS pontos_fidelidade CASCADE;

-- 2. Recriar corretamente
CREATE TABLE pontos_fidelidade (
    usuario_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_pontos INTEGER DEFAULT 0,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE pontos_fidelidade IS 'Pontos acumulados de cada cliente';

-- 3. Recriar a função da trigger
CREATE OR REPLACE FUNCTION atualizar_pontos_fidelidade()
RETURNS TRIGGER AS $$
BEGIN
    -- Apenas quando a compra for confirmada
    IF NEW.status = 'confirmado' AND (OLD.status IS NULL OR OLD.status != 'confirmado') THEN
        -- Insere ou atualiza os pontos
        -- Pontos = quantidade + bonus
        INSERT INTO pontos_fidelidade (usuario_id, total_pontos, atualizado_em)
        VALUES (NEW.usuario_id, NEW.quantidade + NEW.bonus, NOW())
        ON CONFLICT (usuario_id)
        DO UPDATE SET
            total_pontos = pontos_fidelidade.total_pontos + NEW.quantidade + NEW.bonus,
            atualizado_em = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Recriar a trigger
DROP TRIGGER IF EXISTS trigger_atualizar_pontos ON compras;

CREATE TRIGGER trigger_atualizar_pontos
AFTER UPDATE ON compras
FOR EACH ROW
EXECUTE FUNCTION atualizar_pontos_fidelidade();

-- 5. Habilitar RLS
ALTER TABLE pontos_fidelidade ENABLE ROW LEVEL SECURITY;

-- 6. Recriar políticas
DROP POLICY IF EXISTS "Usuários podem ver seus próprios pontos" ON pontos_fidelidade;
CREATE POLICY "Usuários podem ver seus próprios pontos"
ON pontos_fidelidade FOR SELECT
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Sistema pode atualizar pontos" ON pontos_fidelidade;
CREATE POLICY "Sistema pode atualizar pontos"
ON pontos_fidelidade FOR ALL
USING (true)
WITH CHECK (true);

-- Pronto! Agora deve funcionar ✅


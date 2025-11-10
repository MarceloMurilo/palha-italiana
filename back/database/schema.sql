-- ========================================
-- SCHEMA DO BANCO DE DADOS
-- Sistema de Fidelidade Palha Italiana
-- ========================================

-- NOTA: A tabela auth.users já existe (Supabase Auth)
-- Ela armazena todos os usuários autenticados

-- ========================================
-- TABELA: vendedores
-- ========================================
CREATE TABLE IF NOT EXISTS vendedores (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE vendedores IS 'Usuários que podem confirmar compras';

-- ========================================
-- TABELA: compras
-- ========================================
CREATE TABLE IF NOT EXISTS compras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vendedor_id UUID REFERENCES vendedores(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    valor_total NUMERIC(10,2) NOT NULL CHECK (valor_total > 0),
    bonus INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'rejeitado')),
    confirmado_por UUID REFERENCES vendedores(id),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmado_em TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE compras IS 'Registro de todas as compras realizadas';
COMMENT ON COLUMN compras.bonus IS 'Bônus: 1 palha grátis a cada 5 compradas';
COMMENT ON COLUMN compras.status IS 'Status: pendente, confirmado, rejeitado';

-- ========================================
-- TABELA: pontos_fidelidade
-- ========================================
CREATE TABLE IF NOT EXISTS pontos_fidelidade (
    usuario_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_pontos INTEGER DEFAULT 0,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE pontos_fidelidade IS 'Pontos acumulados de cada cliente';

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_compras_usuario ON compras(usuario_id);
CREATE INDEX IF NOT EXISTS idx_compras_status ON compras(status);
CREATE INDEX IF NOT EXISTS idx_compras_vendedor ON compras(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_compras_criado_em ON compras(criado_em DESC);

-- ========================================
-- FUNÇÃO: Atualizar pontos automaticamente
-- ========================================
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

COMMENT ON FUNCTION atualizar_pontos_fidelidade() IS 'Atualiza pontos quando compra é confirmada';

-- ========================================
-- TRIGGER: Acionar atualização de pontos
-- ========================================
DROP TRIGGER IF EXISTS trigger_atualizar_pontos ON compras;

CREATE TRIGGER trigger_atualizar_pontos
AFTER UPDATE ON compras
FOR EACH ROW
EXECUTE FUNCTION atualizar_pontos_fidelidade();

-- ========================================
-- VIEW: Resumo de vendas por vendedor
-- ========================================
CREATE OR REPLACE VIEW resumo_vendas AS
SELECT
    v.id AS vendedor_id,
    v.nome AS vendedor_nome,
    v.email AS vendedor_email,
    COUNT(c.id) AS total_vendas,
    COALESCE(SUM(c.quantidade), 0) AS total_palhas_vendidas,
    COALESCE(SUM(c.bonus), 0) AS total_brindes_dados,
    COALESCE(SUM(c.valor_total), 0) AS valor_total_vendas
FROM vendedores v
LEFT JOIN compras c ON c.vendedor_id = v.id AND c.status = 'confirmado'
GROUP BY v.id, v.nome, v.email
ORDER BY valor_total_vendas DESC;

COMMENT ON VIEW resumo_vendas IS 'Estatísticas de vendas por vendedor';

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilitar RLS nas tabelas
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE pontos_fidelidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendedores ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------
-- Políticas para COMPRAS
-- ----------------------------------------

-- Usuários podem ver suas próprias compras
DROP POLICY IF EXISTS "Usuários podem ver suas próprias compras" ON compras;
CREATE POLICY "Usuários podem ver suas próprias compras"
ON compras FOR SELECT
USING (auth.uid() = usuario_id);

-- Usuários podem criar suas próprias compras
DROP POLICY IF EXISTS "Usuários podem criar suas próprias compras" ON compras;
CREATE POLICY "Usuários podem criar suas próprias compras"
ON compras FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

-- Vendedores podem ver todas as compras
DROP POLICY IF EXISTS "Vendedores podem ver todas as compras" ON compras;
CREATE POLICY "Vendedores podem ver todas as compras"
ON compras FOR SELECT
USING (EXISTS (SELECT 1 FROM vendedores WHERE id = auth.uid()));

-- Vendedores podem atualizar compras
DROP POLICY IF EXISTS "Vendedores podem atualizar compras" ON compras;
CREATE POLICY "Vendedores podem atualizar compras"
ON compras FOR UPDATE
USING (EXISTS (SELECT 1 FROM vendedores WHERE id = auth.uid()));

-- ----------------------------------------
-- Políticas para PONTOS_FIDELIDADE
-- ----------------------------------------

-- Usuários podem ver seus próprios pontos
DROP POLICY IF EXISTS "Usuários podem ver seus próprios pontos" ON pontos_fidelidade;
CREATE POLICY "Usuários podem ver seus próprios pontos"
ON pontos_fidelidade FOR SELECT
USING (auth.uid() = usuario_id);

-- Triggers podem inserir/atualizar (bypass RLS via security definer)
DROP POLICY IF EXISTS "Sistema pode atualizar pontos" ON pontos_fidelidade;
CREATE POLICY "Sistema pode atualizar pontos"
ON pontos_fidelidade FOR ALL
USING (true)
WITH CHECK (true);

-- ----------------------------------------
-- Políticas para VENDEDORES
-- ----------------------------------------

-- Vendedores podem ver seus próprios dados
DROP POLICY IF EXISTS "Vendedores podem ver seus dados" ON vendedores;
CREATE POLICY "Vendedores podem ver seus dados"
ON vendedores FOR SELECT
USING (auth.uid() = id);

-- ========================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ========================================

-- Para testar, você pode criar um vendedor de exemplo:
-- 1. Primeiro, registre um usuário via Supabase Auth
-- 2. Depois, adicione-o à tabela vendedores:
-- 
-- INSERT INTO vendedores (id, nome, email)
-- VALUES ('UUID_DO_USUARIO', 'Vendedor Teste', 'vendedor@example.com');

-- ========================================
-- FIM DO SCHEMA
-- ========================================


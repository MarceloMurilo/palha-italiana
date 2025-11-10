# 🔧 Correção de Erros

## 1️⃣ Erro ao Confirmar Compra ✅

### **Problema:**
```
insert or update on table "pontos_fidelidade" violates 
foreign key constraint "pontos_fidelidade_usuario_id_fkey"
```

### **Causa:**
A tabela `pontos_fidelidade` estava referenciando uma tabela "usuarios" que não existe. Ela deve referenciar `auth.users`.

### **Solução:**

Execute este SQL no **Supabase SQL Editor**:

```sql
-- 1. Remover a tabela atual
DROP TABLE IF EXISTS pontos_fidelidade CASCADE;

-- 2. Recriar corretamente
CREATE TABLE pontos_fidelidade (
    usuario_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_pontos INTEGER DEFAULT 0,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Recriar a função da trigger
CREATE OR REPLACE FUNCTION atualizar_pontos_fidelidade()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmado' AND (OLD.status IS NULL OR OLD.status != 'confirmado') THEN
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

-- 5. Políticas RLS
ALTER TABLE pontos_fidelidade ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver seus próprios pontos" ON pontos_fidelidade;
CREATE POLICY "Usuários podem ver seus próprios pontos"
ON pontos_fidelidade FOR SELECT
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Sistema pode atualizar pontos" ON pontos_fidelidade;
CREATE POLICY "Sistema pode atualizar pontos"
ON pontos_fidelidade FOR ALL
USING (true) WITH CHECK (true);
```

**OU** copie todo o conteúdo de: `back/database/CORRIGIR-PONTOS.sql`

---

## 2️⃣ Integração Pix Melhorada ✅

### **O que foi adicionado:**

#### ✅ **Chave Pix em Destaque**
- Mostra seu número: **98982832657**
- Design bonito com destaque verde

#### ✅ **Botão Copiar**
- Copia a chave automaticamente
- Feedback visual (muda para "Chave Copiada!")

#### ✅ **Instruções Passo a Passo**
- Explica como usar a chave
- Mostra o valor exato a pagar

#### ✅ **Design Melhorado**
- Cores mais chamativas
- Informações organizadas
- Botões maiores e mais claros

---

## 🧪 Testar Agora:

### **1. Corrigir Banco:**
1. Vá em: https://supabase.com/dashboard
2. Clique em **SQL Editor**
3. Cole o SQL acima (ou copie de `back/database/CORRIGIR-PONTOS.sql`)
4. Clique em **RUN** (▶️)

### **2. Testar Pix:**
1. Acesse: http://localhost:5173
2. Faça login
3. Selecione palhas
4. Clique em "Confirmar compra"
5. Veja a **nova tela de Pix** com:
   - Chave em destaque
   - Botão para copiar
   - Instruções claras

### **3. Testar Confirmação:**
1. Clique em "Eu paguei"
2. Como vendedor, confirme a compra
3. **Não deve dar mais erro!** ✅
4. Pontos devem ser adicionados automaticamente

---

## 📱 Nova Tela de Pix:

```
╔════════════════════════════════════╗
║      Pague com PIX                 ║
╠════════════════════════════════════╣
║                                    ║
║  📱 Chave Pix (Telefone)           ║
║                                    ║
║      98982832657                   ║
║                                    ║
║    [📋 Copiar Chave Pix]           ║
║                                    ║
║  💡 Como pagar:                    ║
║  1. Copie a chave acima            ║
║  2. Abra seu app de banco          ║
║  3. Vá em Pix → Pagar              ║
║  4. Cole a chave                   ║
║  5. Pague R$ 25,00                 ║
║                                    ║
║  Valor: R$ 25,00                   ║
║  5 palhas + 1 brinde               ║
║                                    ║
║    [✅ Eu paguei]                  ║
║    [Voltar]                        ║
╚════════════════════════════════════╝
```

---

## ✅ Checklist de Verificação:

- [ ] Execute o SQL de correção no Supabase
- [ ] Recarregue a página do frontend
- [ ] Faça uma compra de teste
- [ ] Clique em "Copiar Chave Pix"
- [ ] Veja a chave sendo copiada
- [ ] Clique em "Eu paguei"
- [ ] Como vendedor, confirme a compra
- [ ] Verifique se os pontos foram adicionados
- [ ] Sem erros no terminal! ✅

---

## 🎯 Melhorias Futuras (Opcional):

### **Pix Dinâmico (Avançado):**
Se quiser gerar QR Code real com valor específico, seria necessário:
- Integrar com API do seu banco
- Gerar QR Code dinâmico com valor
- Verificar pagamento automaticamente

Mas para o MVP, copiar a chave manualmente funciona perfeitamente! ✅

---

**Execute o SQL e teste! Deve funcionar agora! 🚀**


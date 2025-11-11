# 🔧 Corrigir Status de Vendedor

## 🎯 Problema
Após o deploy no Netlify, o email `marcelomurilotrabalho@gmail.com` não é mais reconhecido como vendedor.

---

## 📝 PASSO A PASSO

### **1️⃣ Abrir SQL Editor no Supabase**

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto **Palha Italiana**
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New query**

---

### **2️⃣ Executar Queries de Verificação**

Cole e execute **uma por vez**:

#### **🔍 Verificar usuário no Auth:**
```sql
SELECT 
  id,
  email,
  raw_user_meta_data->>'is_vendedor' as is_vendedor,
  raw_user_meta_data->>'nome' as nome,
  created_at
FROM auth.users
WHERE email = 'marcelomurilotrabalho@gmail.com';
```

**O que deve aparecer:**
- Se `is_vendedor` for `null` ou `false` → **precisa corrigir**
- Se `is_vendedor` for `true` → **ok**, vá para próxima query

---

#### **🔍 Verificar tabela vendedores:**
```sql
SELECT *
FROM vendedores
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'marcelomurilotrabalho@gmail.com'
);
```

**O que deve aparecer:**
- Se retornar **0 rows** → **precisa corrigir**
- Se retornar **1 row** com seu nome e email → **ok**

---

### **3️⃣ Corrigir (se necessário)**

Se alguma das verificações acima falhou, execute estas queries:

#### **✅ Inserir na tabela vendedores:**
```sql
INSERT INTO vendedores (id, nome, email)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'nome', email),
  email
FROM auth.users
WHERE email = 'marcelomurilotrabalho@gmail.com'
ON CONFLICT (id) DO NOTHING;
```

#### **✅ Atualizar metadados:**
```sql
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"is_vendedor": true}'::jsonb
    ELSE raw_user_meta_data || '{"is_vendedor": true}'::jsonb
  END
WHERE email = 'marcelomurilotrabalho@gmail.com';
```

---

### **4️⃣ Confirmar Correção**

Execute esta query final para confirmar:

```sql
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'is_vendedor' as is_vendedor,
  v.nome as vendedor_nome,
  v.criado_em
FROM auth.users u
LEFT JOIN vendedores v ON v.id = u.id
WHERE u.email = 'marcelomurilotrabalho@gmail.com';
```

**✅ Resultado esperado:**
```
| id                 | email                          | is_vendedor | vendedor_nome | criado_em  |
|--------------------|--------------------------------|-------------|---------------|------------|
| uuid-aqui          | marcelomurilotrabalho@gmail.com| true        | Marcelo       | 2025-...   |
```

---

### **5️⃣ Testar no Site**

1. Deslogue do site: https://palhaitalianaa.netlify.app
2. Faça login novamente com `marcelomurilotrabalho@gmail.com`
3. Você deve ser redirecionado para `/vendedor`
4. O painel de vendedor deve aparecer normalmente

---

## 🆘 Se ainda não funcionar

### **Verificar todos os vendedores:**
```sql
SELECT 
  v.id,
  v.nome,
  v.email,
  u.raw_user_meta_data->>'is_vendedor' as is_vendedor,
  v.criado_em
FROM vendedores v
JOIN auth.users u ON u.id = v.id
ORDER BY v.criado_em DESC;
```

---

## 🎯 Causas Comuns

1. **Usuário foi deletado e recriado** → Novo `id` no banco, precisa inserir novamente na tabela `vendedores`
2. **Metadados foram perdidos** → Precisa atualizar `raw_user_meta_data`
3. **RLS (Row Level Security)** → Verificar políticas de segurança no Supabase

---

## 📸 Me manda print!

Depois de executar as queries de verificação (passo 2), me manda o resultado que eu te ajudo! 🚀


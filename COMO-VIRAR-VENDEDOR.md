# 🔐 Como se Tornar Vendedor (Apenas para Administradores)

## ⚠️ ATENÇÃO: Sistema Restrito!

O painel de vendedor é **exclusivo para administradores**. Não há opção pública de cadastro como vendedor.

---

## 🚀 Como Você (Dono) Vira Vendedor:

### **Método 1: Via Supabase Dashboard (Recomendado)**

#### 1️⃣ **Cadastre-se Normalmente**
1. Acesse: http://localhost:5173
2. Clique em "**Cadastre-se**"
3. Preencha nome, email e senha
4. Confirme seu email

#### 2️⃣ **Pegue seu User ID**
1. Faça login no sistema
2. Abra o Console do navegador (F12)
3. Digite:
```javascript
JSON.parse(localStorage.getItem('user')).id
```
4. **Copie o UUID** que aparecer (ex: `a1b2c3d4-...`)

**OU** vá no Supabase:
1. Acesse: https://supabase.com/dashboard
2. Vá em **Authentication** → **Users**
3. Encontre seu usuário
4. Copie o **UUID**

#### 3️⃣ **Adicionar como Vendedor no Banco**
1. No Supabase, vá em **SQL Editor**
2. Execute este comando:

```sql
INSERT INTO vendedores (id, nome, email)
VALUES (
  'SEU-UUID-AQUI',  -- Cole o UUID que você copiou
  'Seu Nome',
  'seu@email.com'
);
```

**Exemplo real:**
```sql
INSERT INTO vendedores (id, nome, email)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Marcelo Murilo',
  'marcelomurilotrabalho@gmail.com'
);
```

#### 4️⃣ **Testar**
1. Faça **logout** do sistema
2. Faça **login** novamente
3. Você será redirecionado para: `/vendedor` 🎉

---

## 🎯 **Como Funciona:**

### **Cliente Normal:**
```
Login → Sistema verifica → Não é vendedor → Redireciona para /comprar
```

### **Você (Vendedor):**
```
Login → Sistema verifica → É vendedor! → Redireciona para /vendedor
```

---

## ✅ **Verificar se Deu Certo:**

### No SQL Editor do Supabase:
```sql
SELECT * FROM vendedores;
```

Deve mostrar:
```
id                          | nome           | email
----------------------------+----------------+----------------------
seu-uuid-aqui               | Seu Nome       | seu@email.com
```

### No Sistema:
- Faça login
- Se for redirecionado para a tela de **compras pendentes**, funcionou! ✅

---

## 🔒 **Segurança:**

✅ **Nenhum cliente pode virar vendedor sozinho**
✅ **Apenas quem tem acesso ao banco pode adicionar vendedores**
✅ **Sistema detecta automaticamente no login**
✅ **Rota `/vendedor` protegida por autenticação**

---

## 👥 **Adicionar Outros Vendedores (Futuro):**

Se precisar adicionar mais vendedores:

```sql
-- Primeiro, a pessoa cadastra normalmente como cliente
-- Depois você pega o UUID dela e executa:

INSERT INTO vendedores (id, nome, email)
VALUES ('uuid-da-pessoa', 'Nome Vendedor', 'email@vendedor.com');
```

---

## 🧪 **Teste Rápido:**

### **1. Pegue seu UUID:**
Console do navegador (F12):
```javascript
console.log(JSON.parse(localStorage.getItem('user')).id);
```

### **2. Adicione no Supabase:**
```sql
INSERT INTO vendedores (id, nome, email)
VALUES ('cole-uuid-aqui', 'Seu Nome', 'seu@email.com');
```

### **3. Logout e Login:**
```
Logout → Login → Boom! Painel de Vendedor! 🎉
```

---

## ❓ **Perguntas Frequentes:**

### **Posso remover um vendedor?**
```sql
DELETE FROM vendedores WHERE id = 'uuid-do-vendedor';
```

### **Como ver todos os vendedores?**
```sql
SELECT 
  v.nome,
  v.email,
  u.created_at as cadastrado_em
FROM vendedores v
JOIN auth.users u ON u.id = v.id;
```

### **Um vendedor pode comprar também?**
SIM! Vendedores têm acesso a:
- `/vendedor` - Painel de confirmações
- `/comprar` - Comprar palhas
- `/pontos` - Ver pontos

### **O que acontece se eu não estiver na tabela vendedores?**
Você é tratado como cliente normal e vai para `/comprar`.

---

## 🎁 **Bonus: Script Rápido**

Cole tudo de uma vez no SQL Editor:

```sql
-- Substitua os valores abaixo
DO $$
DECLARE
  meu_email TEXT := 'seu@email.com';  -- ← MUDE AQUI
  meu_nome TEXT := 'Seu Nome';         -- ← MUDE AQUI
  meu_uuid UUID;
BEGIN
  -- Busca o UUID do seu email
  SELECT id INTO meu_uuid 
  FROM auth.users 
  WHERE email = meu_email;
  
  -- Adiciona como vendedor
  IF meu_uuid IS NOT NULL THEN
    INSERT INTO vendedores (id, nome, email)
    VALUES (meu_uuid, meu_nome, meu_email)
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Vendedor adicionado com sucesso!';
  ELSE
    RAISE NOTICE 'Email não encontrado! Cadastre-se primeiro.';
  END IF;
END $$;
```

---

**Pronto! Agora só você tem acesso ao painel de vendedor! 🔒✨**


# 🧪 Teste do Sistema de Vendedor

## ✅ Sistema Completo Implementado!

Agora você tem:
- ✅ Checkbox "Sou vendedor" no cadastro
- ✅ Registro automático na tabela vendedores
- ✅ Redirecionamento automático após login
- ✅ Mensagens específicas para vendedor

---

## 🚀 TESTE AGORA:

### **Passo a Passo Completo:**

#### 1️⃣ **Reiniciar Backend**
No terminal do backend:
```powershell
Ctrl + C
npm run dev
```

#### 2️⃣ **Cadastrar como Vendedor**
1. Acesse: http://localhost:5173
2. Clique em "**Cadastre-se**"
3. Preencha:
   - **Nome:** Seu nome
   - **Email:** Seu email real
   - **Senha:** 123456 (ou outra com 6+ caracteres)
4. **✅ MARQUE:** "🛒 Sou vendedor"
5. Clique em "**Cadastrar**"

#### 3️⃣ **Verificar Terminal do Backend**
Deve aparecer:
```
📝 Tentando registrar: { 
  email: 'seu@email.com', 
  nome: 'Seu Nome', 
  senhaLength: 6, 
  isVendedor: true 
}
✅ Usuário registrado com sucesso: seu@email.com
🛒 Registrando como vendedor...
✅ Vendedor registrado na tabela!
```

#### 4️⃣ **Ver Mensagem de Sucesso**
No frontend, deve aparecer:
```
✅ Cadastro de vendedor realizado! 
   Verifique seu email para confirmar. 
   Após confirmar, faça login para acessar o painel.
```

#### 5️⃣ **Confirmar Email**
1. Vá na sua caixa de entrada
2. Procure email do **Supabase**
3. Clique no link de confirmação

#### 6️⃣ **Fazer Login**
1. Volte para http://localhost:5173
2. Digite seu email e senha
3. Clique em "**Entrar**"

#### 7️⃣ **Verificar Redirecionamento** 🎉
Você deve ser redirecionado automaticamente para:
```
http://localhost:5173/vendedor
```

E ver a tela:
```
╔═════════════════════════════════════╗
║   🛒 Painel do Vendedor             ║
║                                     ║
║   [⏳ Pendentes] [✅ Confirmadas]   ║
║                                     ║
║   Nenhuma compra encontrada         ║
║   (até alguém fazer uma compra)     ║
╚═════════════════════════════════════╝
```

---

## 🔍 **Verificar no Banco de Dados:**

### Opção 1: Via Supabase Dashboard
1. Acesse: https://supabase.com/dashboard
2. Vá em **Table Editor**
3. Selecione a tabela **`vendedores`**
4. Você deve ver seu registro! ✅

### Opção 2: Via SQL Editor
Execute:
```sql
SELECT * FROM vendedores;
```

Deve mostrar:
```
id                  | nome       | email
--------------------+------------+------------------
seu-uuid            | Seu Nome   | seu@email.com
```

---

## 🎯 **Fluxo Completo:**

```
1. Cadastro com checkbox marcado
   ↓
2. Sistema cria usuário no Supabase Auth
   ↓
3. Sistema adiciona na tabela vendedores
   ↓
4. Usuário confirma email
   ↓
5. Usuário faz login
   ↓
6. Sistema detecta que é vendedor
   ↓
7. Redireciona para /vendedor
   ↓
8. Mostra painel de confirmação! 🎉
```

---

## 🧪 **Teste Cliente vs Vendedor:**

### **Como Cliente:**
1. Cadastre SEM marcar "Sou vendedor"
2. Faça login
3. → Vai para `/comprar` (comprar palhas)

### **Como Vendedor:**
1. Cadastre MARCANDO "Sou vendedor"
2. Faça login
3. → Vai para `/vendedor` (painel)

---

## ⚠️ **Se Algo Der Errado:**

### **Erro: "Email not confirmed"**
✅ Confirme seu email antes de fazer login!

### **Vendedor não foi adicionado na tabela**
Verifique o terminal do backend, deve ter logs específicos.

Se mostrar erro, pode ser problema de permissões. Execute no SQL Editor:
```sql
-- Garantir que a tabela permite inserção
ALTER TABLE vendedores DISABLE ROW LEVEL SECURITY;
```

### **Não redireciona para /vendedor**
1. Verifique se está na tabela vendedores
2. Limpe o localStorage:
   - F12 → Application → Local Storage → Clear
3. Faça login novamente

---

## 🎁 **Recursos Extras:**

### **Vendedor Pode Comprar Também?**
SIM! Um vendedor pode:
- Acessar `/vendedor` - Confirmar compras
- Acessar `/comprar` - Comprar palhas
- Acessar `/pontos` - Ver seus pontos

### **Como Trocar Entre Telas?**
Use os botões de navegação ou digite a URL diretamente.

---

## 📊 **Dashboard do Vendedor:**

Depois de logar como vendedor, você verá:

```
╔════════════════════════════════════════╗
║  🛒 Painel do Vendedor                 ║
║  🔄                            🚪       ║
║                                        ║
║  [⏳ Pendentes] [✅ Confirmadas]       ║
║  [❌ Rejeitadas] [Todas]               ║
║                                        ║
║  ┌──────────────────────────────────┐ ║
║  │ 📅 10/11/2025 15:30              │ ║
║  │ 5 palhas + 1 brinde              │ ║
║  │ R$ 25,00                         │ ║
║  │                                  │ ║
║  │ [✅ Confirmar] [❌ Rejeitar]     │ ║
║  └──────────────────────────────────┘ ║
╚════════════════════════════════════════╝
```

---

**Teste e me avise se funcionou! 🚀**


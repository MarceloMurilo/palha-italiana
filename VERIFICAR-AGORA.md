# 🔍 Verificar Erro - Passo a Passo

## 1️⃣ **VER O TERMINAL DO BACKEND**

Olhe no terminal onde está rodando `npm run dev` do **backend**.

Quando você clicar em "Cadastrar", deve aparecer:

```
📝 Tentando registrar: { email: 'marcelomurilotrabalho@gmail.com', nome: 'Marcelo Murilo', senhaLength: 6 }
❌ Erro do Supabase: [MENSAGEM AQUI]
```

**👉 Me envie essa linha completa do erro!**

---

## 2️⃣ **Possíveis Erros e Soluções:**

### Se aparecer: **"Invalid API key"**
✅ **Solução:** Seguir o guia `PEGAR-CHAVES-SUPABASE.md`

### Se aparecer: **"Email rate limit exceeded"**
✅ **Solução:** Aguardar 1 minuto ou usar outro email

### Se aparecer: **"User already registered"**
✅ **Solução:** Use outro email ou faça login

### Se aparecer: **"Signup is disabled"**
✅ **Solução:** Habilitar signup no Supabase:
1. Vá em **Authentication** → **Providers**
2. Clique em **Email**
3. Marque **"Enable Email provider"**
4. Desmarque **"Confirm email"** (para testes)
5. Salve

---

## 3️⃣ **Verificar Configuração do Supabase**

### 📧 Desabilitar Confirmação de Email (Para Testes):

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Authentication** → **Providers**
4. Clique em **Email**
5. **Desmarque** a opção:
   ```
   ☐ Confirm email
   ```
6. Clique em **Save**

Isso permite cadastrar sem precisar confirmar o email!

---

## 4️⃣ **Teste Rápido das Chaves:**

Execute no PowerShell:

```powershell
cd back
node -e "require('dotenv').config(); console.log('URL:', process.env.SUPABASE_URL); console.log('ANON_KEY length:', process.env.SUPABASE_ANON_KEY?.length); console.log('SERVICE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);"
```

**Deve mostrar:**
```
URL: https://gowrpdxoispzuzbhwjel.supabase.co
ANON_KEY length: 200+ (número grande)
SERVICE_KEY length: 200+ (número grande)
```

Se algum estiver `undefined` ou `0`, as chaves não estão no `.env`!

---

## 5️⃣ **Checklist Completo:**

- [ ] Backend rodando sem erros de inicialização
- [ ] Arquivo `back/.env` existe e tem as 3 chaves
- [ ] Chaves ANON e SERVICE_ROLE são DIFERENTES
- [ ] No Supabase, "Email provider" está habilitado
- [ ] "Confirm email" está DESABILITADO (para testes)
- [ ] Terminal do backend mostra os logs

---

## 🚀 **Depois de Verificar:**

1. **Reinicie o backend:** Ctrl+C e `npm run dev`
2. **Tente cadastrar novamente** no frontend
3. **Me envie a mensagem de erro** que aparece no terminal do backend

---

**Aguardo o retorno! 🍫**


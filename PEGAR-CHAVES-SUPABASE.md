# 🔑 Como Pegar as Chaves Corretas do Supabase

## 1️⃣ Acesse o Supabase

1. Vá para: https://supabase.com/dashboard
2. Faça login
3. Selecione seu projeto **Palha Italiana**

---

## 2️⃣ Pegar as Chaves

1. No menu lateral, clique em **⚙️ Settings** (Configurações)
2. Clique em **API**
3. Você verá esta tela:

```
Project URL:
https://gowrpdxoispzuzbhwjel.supabase.co

API Keys:
┌─────────────────────────────────────────┐
│ anon public                             │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │  ← COPIE ESTA!
├─────────────────────────────────────────┤
│ service_role (secret)                   │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │  ← COPIE ESTA!
└─────────────────────────────────────────┘
```

---

## 3️⃣ Atualizar o .env do Backend

Abra o arquivo: `back/.env`

Cole as chaves corretas:

```env
SUPABASE_URL=https://gowrpdxoispzuzbhwjel.supabase.co
SUPABASE_ANON_KEY=eyJhbG... [COLE A CHAVE anon public COMPLETA]
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... [COLE A CHAVE service_role COMPLETA]

PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**⚠️ IMPORTANTE:**
- A chave `anon public` geralmente começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...`
- A chave `service_role` é DIFERENTE da `anon`!
- **NÃO coloque a mesma chave nas duas variáveis!**

---

## 4️⃣ Reiniciar o Backend

Depois de salvar o `.env`:

```powershell
# No terminal do backend, pressione Ctrl+C para parar
# Depois execute novamente:
npm run dev
```

---

## 5️⃣ Testar Novamente

1. Volte para http://localhost:5173
2. Tente cadastrar novamente
3. Deve funcionar! ✅

---

## ❓ Como saber se as chaves estão corretas?

### Chave ANON (anon public):
- Geralmente tem `"role":"anon"` quando decodificada
- É segura para usar no frontend

### Chave SERVICE_ROLE (service_role):
- Geralmente tem `"role":"service_role"` quando decodificada  
- É SECRETA, nunca exponha no frontend!
- Só deve estar no backend

---

## 🔍 Decodificar JWT (Opcional)

Para ver o conteúdo da chave, cole em: https://jwt.io

**anon public** deve mostrar:
```json
{
  "role": "anon",
  ...
}
```

**service_role** deve mostrar:
```json
{
  "role": "service_role",
  ...
}
```

Se ambas mostrarem `"role": "anon"`, você colocou a mesma chave duas vezes! ❌

---

**Depois de atualizar, me avise!** 🚀


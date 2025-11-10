# 🚀 Quick Start - Palha Italiana Backend

Guia rápido para colocar o backend no ar em 5 minutos!

## ⚡ Setup Rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Aguarde a inicialização (leva ~2 minutos)

### 3. Configurar Banco de Dados

1. No Supabase, vá em **SQL Editor**
2. Copie todo o conteúdo do arquivo `database/schema.sql`
3. Cole no editor e clique em **RUN**

✅ Pronto! Tabelas, triggers e views criadas!

### 4. Configurar Variáveis de Ambiente

1. Copie o arquivo ENV_TEMPLATE.txt para .env:

```bash
# Windows PowerShell
Copy-Item ENV_TEMPLATE.txt .env

# Windows CMD
copy ENV_TEMPLATE.txt .env

# Linux/Mac
cp ENV_TEMPLATE.txt .env
```

2. No Supabase, vá em **Settings** → **API**
3. Copie as seguintes informações:
   - **Project URL** → SUPABASE_URL
   - **anon public** → SUPABASE_ANON_KEY
   - **service_role** → SUPABASE_SERVICE_ROLE_KEY

4. Cole no arquivo `.env`:

```env
SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 5. Iniciar o servidor

```bash
npm run dev
```

🎉 **Pronto!** O servidor está rodando em `http://localhost:3000`

## 📝 Testando

### Opção 1: Swagger UI (Recomendado)

Acesse: http://localhost:3000/api-docs

Interface visual para testar todos os endpoints!

### Opção 2: Postman

1. Abra o Postman
2. Import → File → Selecione `postman/collection.json`
3. Teste os endpoints!

### Opção 3: cURL (Terminal)

```bash
# Health Check
curl http://localhost:3000/api/health

# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"teste@example.com\",\"password\":\"senha123\",\"nome\":\"Teste\"}"
```

## 🧪 Criar um Vendedor de Teste

Para testar as funcionalidades de vendedor:

1. **Registre um usuário** via `/api/auth/register`
2. **Copie o UUID** do usuário (vem na resposta do registro ou login)
3. No **SQL Editor do Supabase**, execute:

```sql
INSERT INTO vendedores (id, nome, email)
VALUES ('UUID_DO_USUARIO_AQUI', 'Vendedor Teste', 'vendedor@example.com');
```

Agora esse usuário pode confirmar/rejeitar compras!

## 📊 Endpoints Principais

| Ação | Endpoint | Método |
|------|----------|--------|
| Registrar | `/api/auth/register` | POST |
| Login | `/api/auth/login` | POST |
| Criar compra | `/api/compras` | POST |
| Listar compras | `/api/compras` | GET |
| Ver pontos | `/api/pontos` | GET |
| Confirmar compra | `/api/compras/:id/confirmar` | PATCH |

## 🔐 Autenticação

Todas as rotas (exceto register e login) precisam do header:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

O token é retornado no login:

```json
{
  "data": {
    "session": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

## ❓ Problemas Comuns

### "Missing Supabase environment variables"

→ Verifique se o arquivo `.env` existe e está preenchido corretamente

### "Token inválido ou expirado"

→ Faça login novamente. Tokens expiram após 1 hora

### Porta 3000 já em uso

→ Altere no `.env`:

```env
PORT=3001
```

### CORS Error

→ Adicione sua origem no `.env`:

```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://seu-dominio.com
```

## 📚 Próximos Passos

- ✅ Leia o `README.md` completo para detalhes
- ✅ Explore a documentação Swagger
- ✅ Teste os endpoints com Postman
- ✅ Integre com o frontend

## 🆘 Suporte

- Documentação completa: `README.md`
- Scripts SQL: `database/schema.sql`
- Coleção Postman: `postman/collection.json`

---

**Dica**: Use `npm run dev` para desenvolvimento (hot reload automático)!


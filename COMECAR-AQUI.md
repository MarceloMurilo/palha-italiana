# 🚀 Como Começar - Palha Italiana

Guia completo para iniciar o projeto!

## 📁 Estrutura

```
palha-italiana/
├── back/    🔧 Backend (Node.js + Express + Supabase)
└── front/   🎨 Frontend (React + Vite + Tailwind)
```

---

## 🔧 1. Iniciar o BACKEND

```powershell
# Entrar na pasta
cd back

# Instalar dependências (se ainda não instalou)
npm install

# Iniciar servidor
npm run dev
```

✅ Backend rodando em: **http://localhost:3000**
📚 Documentação Swagger: **http://localhost:3000/api-docs**

### ⚙️ Configuração do Backend

O arquivo `.env` já está configurado em `back/.env` com suas credenciais do Supabase.

Se precisar alterar:
```env
SUPABASE_URL=https://gowrpdxoispzuzbhwjel.supabase.co
SUPABASE_ANON_KEY=sua-chave
PORT=3000
```

---

## 🎨 2. Iniciar o FRONTEND

**Abra OUTRO terminal PowerShell** e execute:

```powershell
# Entrar na pasta (a partir da raiz do projeto)
cd front

# Iniciar servidor
npm run dev
```

✅ Frontend rodando em: **http://localhost:5173**

### ⚙️ Configuração do Frontend

O arquivo `.env` já foi criado automaticamente em `front/.env` com:
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://gowrpdxoispzuzbhwjel.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave
```

---

## 🗄️ 3. Configurar Banco de Dados (se ainda não fez)

1. Acesse o **Supabase**: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Copie todo o conteúdo de `back/database/schema.sql`
4. Cole e execute (RUN)

✅ Tabelas, triggers e views criadas!

---

## 🧪 4. Testar o Sistema

### Como CLIENTE:

1. Abra http://localhost:5173
2. Clique em "Não tem conta? Cadastre-se"
3. Crie uma conta
4. Selecione quantas palhas comprou (1-5)
5. Clique em "Confirmar compra"
6. Na tela do PIX, clique em "Eu paguei"
7. Veja seus pontos em "Pontos"

### Como VENDEDOR:

1. Primeiro, crie um vendedor no banco:
   - Vá no Supabase SQL Editor
   - Execute:
   ```sql
   INSERT INTO vendedores (id, nome, email)
   VALUES ('UUID_DO_USUARIO', 'Vendedor Teste', 'vendedor@example.com');
   ```
   (Pegue o UUID do usuário após fazer registro)

2. Faça login com essa conta
3. Acesse: http://localhost:5173/vendedor
4. Veja compras pendentes
5. Confirme ou rejeite compras

---

## 📱 Funcionalidades Principais

### Cliente:
✅ Cadastro e Login
✅ Seleção visual de palhas (1-5)
✅ QR Code Pix (simulado)
✅ Ver pontos acumulados
✅ Estatísticas de compras
✅ Ganhar 1 brinde a cada 5 palhas

### Vendedor:
✅ Ver compras pendentes em tempo real
✅ Confirmar/Rejeitar pagamentos
✅ Filtrar por status
✅ Auto-atualização a cada 10 segundos

---

## 🎨 Design

O frontend foi criado com base nas imagens que você forneceu:
- Cores: Laranja (#f97316) e Amarelo claro (#fef3c7)
- Layout minimalista e moderno
- Totalmente responsivo (mobile e desktop)
- PWA (pode ser instalado como app)

---

## 🛠️ Comandos Úteis

### Backend:
```powershell
cd back
npm run dev     # Modo desenvolvimento (hot reload)
npm start       # Modo produção
```

### Frontend:
```powershell
cd front
npm run dev     # Modo desenvolvimento
npm run build   # Build para produção
npm run preview # Preview do build
```

---

## 📚 Documentação Completa

- **Backend**: `back/README.md`
- **Frontend**: `front/README.md`
- **Rotas API**: `back/ROTAS.md`
- **Postman**: `back/postman/collection.json`

---

## ❓ Problemas Comuns

### Backend não inicia:
- Verifique se o arquivo `back/.env` existe
- Confirme se as credenciais do Supabase estão corretas

### Frontend não conecta:
- Certifique-se que o backend está rodando na porta 3000
- Verifique o arquivo `front/.env`

### Erro de CORS:
- O backend já está configurado para aceitar requisições do localhost:5173

---

## 🎯 Próximos Passos

1. ✅ Teste o fluxo completo (cadastro → compra → confirmação)
2. ✅ Crie um vendedor e teste o painel
3. ✅ Customize as cores/design se quiser
4. ✅ Deploy em produção (Vercel/Netlify para front, Railway/Render para back)

---

**Desenvolvido para Palha Italiana** 🍫

Qualquer dúvida, consulte os READMEs específicos de cada pasta!


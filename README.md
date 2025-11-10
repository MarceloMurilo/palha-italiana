# 🍫 Palha Italiana - Sistema de Fidelidade

Sistema completo de fidelidade para vendas de Palha Italiana, com PWA responsiva e painel administrativo.

## 🎯 **Funcionalidades**

### **Para o Cliente:**
- 🔐 Login/Cadastro com Supabase Auth
- 🍫 Seleção individual de palhas compradas
- 💳 Pagamento via Pix (com chave copiável)
- 🎁 Sistema de brindes (1 brinde a cada 5 palhas)
- 📊 Visualização de pontos e estatísticas
- 📱 PWA instalável (funciona offline)

### **Para o Vendedor:**
- 🛒 Confirmação de pagamentos
- 👥 Lista de clientes com brindes disponíveis
- 🎁 Sistema de entrega de brindes (mantém palhas restantes)
- 📈 Histórico de vendas
- 🔄 Atualização automática a cada 10s

---

## 🏗️ **Tecnologias**

### **Backend:**
- Node.js + Express.js
- Supabase (PostgreSQL + Auth)
- JWT Authentication
- Swagger (Documentação da API)

### **Frontend:**
- React + Vite
- TailwindCSS
- React Router
- Lucide Icons
- PWA (Progressive Web App)

---

## 📁 **Estrutura do Projeto**

```
palha-italiana/
├── back/                    # Backend (API REST)
│   ├── src/
│   │   ├── config/          # Configurações (Supabase, Swagger)
│   │   ├── controllers/     # Controladores das rotas
│   │   ├── services/        # Lógica de negócio
│   │   ├── middleware/      # Autenticação JWT
│   │   ├── routes/          # Rotas da API
│   │   └── index.js         # Servidor Express
│   ├── database/            # Scripts SQL
│   └── package.json
│
├── front/                   # Frontend (React PWA)
│   ├── src/
│   │   ├── config/          # API client, Supabase
│   │   ├── context/         # Context API (Auth)
│   │   ├── pages/           # Páginas (Login, Comprar, Pontos, Vendedor)
│   │   └── main.jsx
│   ├── public/              # Assets estáticos
│   └── package.json
│
└── README.md
```

---

## 🚀 **Como Rodar o Projeto**

### **1. Pré-requisitos:**
- Node.js 18+
- Conta no Supabase
- Git

### **2. Clonar o repositório:**
```bash
git clone https://github.com/SEU_USUARIO/palha-italiana.git
cd palha-italiana
```

### **3. Configurar Backend:**

```bash
cd back
npm install

# Criar arquivo .env (copie o exemplo abaixo)
```

**`back/.env`:**
```env
PORT=3000
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_ANON_KEY=SUA_CHAVE_ANON
SUPABASE_SERVICE_ROLE_KEY=SUA_CHAVE_SERVICE
```

**Rodar backend:**
```bash
npm run dev
```

### **4. Configurar Frontend:**

```bash
cd ../front
npm install

# Criar arquivo .env
```

**`front/.env`:**
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

**Rodar frontend:**
```bash
npm run dev
```

### **5. Acessar:**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api-docs

---

## 🗄️ **Banco de Dados (Supabase)**

### **1. Criar Projeto no Supabase:**
- Acesse: https://supabase.com
- Crie um novo projeto
- Copie as chaves (Settings → API)

### **2. Executar SQL:**

Copie e execute no **SQL Editor** do Supabase:

```sql
-- Arquivo: back/database/schema.sql
```

Ver arquivo completo: [`back/database/schema.sql`](back/database/schema.sql)

### **3. Configurar Autenticação:**
- Authentication → Settings
- ✅ Enable Email Confirmations (opcional)
- Configure Email Templates

---

## 📊 **API Endpoints**

### **Autenticação:**
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário

### **Compras:**
- `GET /api/compras` - Lista compras
- `POST /api/compras` - Criar compra
- `PATCH /api/compras/:id/confirmar` - Confirmar (vendedor)
- `PATCH /api/compras/:id/rejeitar` - Rejeitar (vendedor)

### **Pontos:**
- `GET /api/pontos` - Ver pontos
- `GET /api/pontos/estatisticas` - Estatísticas
- `GET /api/pontos/clientes-com-brindes` - Clientes com brindes (vendedor)
- `POST /api/pontos/dar-baixa-brinde/:id` - Entregar brinde (vendedor)

**Documentação completa:** http://localhost:3000/api-docs

---

## 🎁 **Sistema de Brindes**

### **Como funciona:**
```
Cliente compra 11 palhas
↓
11 ÷ 5 = 2 brindes disponíveis
11 % 5 = 1 palha restante (acumulada)
↓
Vendedor entrega os 2 brindes
↓
Cliente fica com 1 palha (faltam 4 pro próximo)
```

### **Regras:**
- ✅ 1 brinde a cada 5 palhas compradas
- ✅ Palhas restantes são mantidas ao resgatar brindes
- ✅ Vendedor confirma manualmente as entregas

---

## 🔒 **Segurança**

### **❌ NUNCA COMMITAR:**
- ❌ Arquivos `.env`
- ❌ Chaves do Supabase
- ❌ `node_modules/`
- ❌ Logs ou caches

### **✅ Incluído no `.gitignore`:**
- `.env`, `.env.local`
- `node_modules/`
- `dist/`, `build/`
- Arquivos de IDE
- Logs

---

## 👤 **Como se tornar Vendedor**

Por segurança, o cadastro de vendedor não é público. Para se tornar vendedor:

1. **Cadastre-se normalmente** no sistema
2. **Pegue seu UUID** (após login):
   ```sql
   SELECT id FROM auth.users WHERE email = 'seu@email.com';
   ```
3. **Adicione na tabela de vendedores:**
   ```sql
   INSERT INTO vendedores (id, nome, email)
   VALUES ('SEU_UUID', 'Seu Nome', 'seu@email.com');
   ```

Ver guia completo: [`COMO-VIRAR-VENDEDOR.md`](COMO-VIRAR-VENDEDOR.md)

---

## 📚 **Documentação Adicional**

- [`SISTEMA-DE-BRINDES-V2.md`](SISTEMA-DE-BRINDES-V2.md) - Sistema de brindes detalhado
- [`PEGAR-CHAVES-SUPABASE.md`](PEGAR-CHAVES-SUPABASE.md) - Como pegar chaves do Supabase
- [`bd.md`](bd.md) - Estrutura do banco de dados
- [`back/database/schema.sql`](back/database/schema.sql) - Schema completo
- [`back/database/TESTE-BRINDES.sql`](back/database/TESTE-BRINDES.sql) - Script de teste

---

## 🐛 **Problemas Comuns**

### **1. Erro de CORS:**
```javascript
// back/src/index.js
const corsOptions = {
  origin: true, // Permite todas as origens em dev
  credentials: true
};
```

### **2. Erro de autenticação:**
- Verifique se o email foi confirmado (Supabase)
- Verifique as chaves no `.env`

### **3. Erro ao dar baixa no brinde:**
- Certifique-se de estar logado como vendedor
- Verifique se seu UUID está na tabela `vendedores`

---

## 🤝 **Contribuindo**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📝 **Licença**

Este projeto é de uso privado.

---

## 👨‍💻 **Autor**

Desenvolvido por **Marcelo Murilo** - [marcelomurilotrabalho@gmail.com](mailto:marcelomurilotrabalho@gmail.com)

---

## 🎉 **Agradecimentos**

- [Supabase](https://supabase.com) - Backend as a Service
- [Vite](https://vitejs.dev) - Build tool
- [TailwindCSS](https://tailwindcss.com) - CSS framework
- [Lucide](https://lucide.dev) - Icons

---

**Made with ❤️ and 🍫**

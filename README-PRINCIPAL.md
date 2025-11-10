# 🍫 Palha Italiana - Sistema de Fidelidade

Sistema completo de fidelidade com QR Code para a Palha Italiana.

## 📁 Estrutura do Projeto

```
palha-italiana/
├── back/          # 🔧 Backend (Node.js + Express + Supabase)
│   ├── src/
│   ├── database/
│   ├── postman/
│   └── package.json
│
└── front/         # 🎨 Frontend (React + Vite + Tailwind)
    ├── src/
    ├── public/
    └── package.json
```

## 🚀 Como Iniciar

### Backend (Porta 3000)

```powershell
cd back
npm install
npm run dev
```

**Documentação:** http://localhost:3000/api-docs

### Frontend (Porta 5173)

```powershell
cd front
npm install
npm run dev
```

**Aplicação:** http://localhost:5173

## 📚 Documentação

- **Backend:** Veja `back/README.md`
- **Frontend:** Veja `front/README.md`

## 🎯 Funcionalidades

### 👤 Cliente
- ✅ Login/Registro
- ✅ Selecionar quantidade de palhas
- ✅ Gerar QR Code Pix simulado
- ✅ Confirmar pagamento
- ✅ Ver pontos acumulados
- 🎁 Ganhar 1 palha a cada 5 compradas

### 🛒 Vendedor
- ✅ Ver compras pendentes
- ✅ Confirmar/Rejeitar pagamentos
- ✅ Ver resumo de vendas

## 🔐 Variáveis de Ambiente

### Backend (`back/.env`)
```env
SUPABASE_URL=sua-url
SUPABASE_ANON_KEY=sua-chave
SUPABASE_SERVICE_ROLE_KEY=sua-service-key
PORT=3000
```

### Frontend (`front/.env`)
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=sua-url
VITE_SUPABASE_ANON_KEY=sua-chave
```

## 🛠️ Tecnologias

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL + Auth)
- Swagger (Documentação)

**Frontend:**
- React + Vite
- Tailwind CSS
- PWA (Progressive Web App)

## 📱 Acesso via QR Code

O sistema é acessado via QR Code fixo nas embalagens que direciona para o site principal.

---

**Desenvolvido para Palha Italiana** 🍫


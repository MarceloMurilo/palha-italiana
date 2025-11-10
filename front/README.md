# 🍫 Palha Italiana - Frontend

PWA responsiva para sistema de fidelidade da Palha Italiana.

## 🚀 Iniciar

```bash
# Instalar dependências
npm install

# Renomear env.local para .env
mv env.local .env

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:5173

## 📱 Páginas

### Cliente
- **`/`** - Login/Registro
- **`/comprar`** - Seleção de palhas e pagamento
- **`/pontos`** - Visualizar pontos e estatísticas

### Vendedor
- **`/vendedor`** - Painel de confirmação de compras

## 🎨 Design

- Design inspirado nas imagens fornecidas
- Cores: Orange-500 (#f97316) e Amber-50 (#fef3c7)
- Totalmente responsivo (mobile e desktop)
- Ícones: Lucide React

## 🔧 Tecnologias

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Supabase JS Client
- Lucide React (ícones)

## 🌐 Variáveis de Ambiente

Crie o arquivo `.env` (já configurado em `env.local`):

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=sua-url-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-supabase
```

## 📦 Build para Produção

```bash
npm run build
```

## 🎯 Funcionalidades

✅ Login e Registro
✅ Seleção visual de palhas (1-5)
✅ Cálculo automático de bônus
✅ QR Code Pix simulado
✅ Sistema de pontos
✅ Estatísticas do cliente
✅ Painel do vendedor
✅ Confirmação/Rejeição de compras
✅ Auto-atualização a cada 10s (vendedor)
✅ PWA (instalável)

## 🎁 Regra de Fidelidade

A cada 5 palhas compradas = 1 de brinde!

---

**Desenvolvido para Palha Italiana** 🍫

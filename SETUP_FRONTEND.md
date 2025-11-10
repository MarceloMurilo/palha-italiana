# 🚀 Setup do Frontend - Palha Italiana

Execute estes comandos no PowerShell:

## 1️⃣ Criar o projeto React com Vite

```powershell
# Criar o projeto (escolha React + JavaScript)
npm create vite@latest frontend -- --template react

# Entrar na pasta
cd frontend

# Instalar dependências
npm install

# Instalar dependências extras que vamos usar
npm install react-router-dom @supabase/supabase-js lucide-react

# Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Instalar PWA
npm install -D vite-plugin-pwa
```

## 2️⃣ Iniciar o servidor de desenvolvimento

```powershell
npm run dev
```

---

**Depois de executar esses comandos, me avise que vou customizar os arquivos para criar a interface! 🎨**


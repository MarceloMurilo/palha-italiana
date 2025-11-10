# 🧪 Teste Rápido - Palha Italiana

Os erros foram corrigidos! Execute os comandos abaixo:

## ✅ Correções Aplicadas:

### Backend:
- ✅ CORS configurado para aceitar todas as origens em desenvolvimento
- ✅ Helmet ajustado para permitir recursos cross-origin

### Frontend:
- ✅ Tailwind CSS v3 instalado (versão compatível)
- ✅ PostCSS configurado corretamente

---

## 🚀 Iniciar Agora:

### 1️⃣ Backend (Terminal 1):

```powershell
cd back
npm run dev
```

**Aguarde ver:**
```
🍫 ====================================
   API Palha Italiana
====================================

🚀 Servidor rodando na porta 3000
📚 Documentação: http://localhost:3000/api-docs
❤️  Health check: http://localhost:3000/api/health
🌍 Ambiente: development

====================================
```

### 2️⃣ Frontend (Terminal 2):

Abra um NOVO terminal e execute:

```powershell
cd front
npm run dev
```

**Aguarde ver:**
```
VITE v7.x.x  ready in XXXms

➜  Local:   http://localhost:5173/
```

---

## 🧪 Testar no Navegador:

1. Abra: **http://localhost:5173**
2. Você deve ver uma tela bonita com 🍫 e formulário de login
3. Clique em "**Não tem conta? Cadastre-se**"
4. Preencha:
   - Nome: Teste
   - Email: teste@teste.com
   - Senha: 123456
5. Clique em "**Cadastrar**"
6. Você será redirecionado para a tela de compra!

---

## ✅ Checklist:

- [ ] Backend rodando sem erros na porta 3000
- [ ] Frontend rodando sem erros na porta 5173
- [ ] Página de login aparece bonita com Tailwind
- [ ] Consegue fazer cadastro/login
- [ ] Consegue selecionar palhas

---

## ❌ Se ainda houver erros:

### Backend não inicia:
```powershell
cd back
cat .env  # Ver se o arquivo existe
```

### Frontend com erro de Tailwind:
```powershell
cd front
rm -rf node_modules
npm install
npm run dev
```

### CORS ainda dando erro:
O backend precisa estar rodando ANTES do frontend!

---

## 📱 Próximos Passos:

Após conseguir acessar o sistema:

1. ✅ Teste fazer uma compra
2. ✅ Veja seus pontos
3. ✅ Crie um vendedor no Supabase
4. ✅ Teste o painel do vendedor

**Instruções completas:** `COMECAR-AQUI.md`

---

Funcionou? Me avise! 🎉


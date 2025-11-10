# 🚀 Como Subir o Projeto para o GitHub

## 📋 **Passo a Passo Completo**

---

## ✅ **1. VERIFICAR ARQUIVOS SENSÍVEIS**

### **Antes de commitar, CONFIRA:**

```powershell
# Ver arquivos que serão commitados
git status
```

### **❌ NUNCA DEVE APARECER:**
- ❌ `back/.env`
- ❌ `front/.env`
- ❌ `config.env`
- ❌ `node_modules/`
- ❌ Arquivos com chaves do Supabase

### **✅ Se aparecer algo sensível:**
```powershell
# Adicionar ao .gitignore
echo "back/.env" >> .gitignore
echo "front/.env" >> .gitignore

# Remover do stage (se já adicionou)
git rm --cached back/.env
git rm --cached front/.env
```

---

## 🔧 **2. INICIALIZAR GIT (se ainda não fez)**

```powershell
cd C:\palha-italiana

# Inicializar repositório
git init

# Adicionar tudo (respeitando .gitignore)
git add .

# Ver o que será commitado
git status

# Fazer o primeiro commit
git commit -m "🎉 Inicial: Sistema de Fidelidade Palha Italiana"
```

---

## 🌐 **3. CRIAR REPOSITÓRIO NO GITHUB**

### **Opção A: Via Site (Recomendado)**

1. **Acesse:** https://github.com
2. Clique em **"New repository"** (botão verde)
3. Configure:
   - **Nome:** `palha-italiana`
   - **Descrição:** `Sistema de fidelidade para vendas de Palha Italiana`
   - **Visibilidade:** 
     - ✅ **Private** (recomendado - só você vê)
     - ⚠️ **Public** (qualquer um pode ver)
   - **NÃO marque:** "Add README" (já temos)
   - **NÃO marque:** "Add .gitignore" (já temos)
4. Clique em **"Create repository"**

### **Opção B: Via CLI (GitHub CLI)**

```powershell
# Instalar GitHub CLI: https://cli.github.com
gh repo create palha-italiana --private --source=. --remote=origin
```

---

## 📤 **4. CONECTAR AO GITHUB E FAZER PUSH**

### **Se criou via site (Opção A):**

```powershell
# Adicionar remote (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/palha-italiana.git

# Verificar se foi adicionado
git remote -v

# Renomear branch para main (se necessário)
git branch -M main

# Fazer o primeiro push
git push -u origin main
```

### **Se criou via CLI (Opção B):**

```powershell
# Já está conectado, só fazer push
git push -u origin main
```

---

## 🔐 **5. AUTENTICAÇÃO (se pedir)**

### **Erro: "Authentication failed"?**

#### **Solução 1: Personal Access Token (Recomendado)**

1. **Criar Token:**
   - GitHub → Settings → Developer settings
   - Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Marque: `repo` (full control)
   - Copie o token (só aparece uma vez!)

2. **Usar no push:**
   ```powershell
   # Quando pedir senha, cole o TOKEN (não a senha do GitHub)
   git push -u origin main
   ```

3. **Salvar credenciais:**
   ```powershell
   git config --global credential.helper store
   # Na próxima vez, não pede mais
   ```

#### **Solução 2: SSH (Avançado)**

```powershell
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu@email.com"

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar no GitHub:
# Settings → SSH and GPG keys → New SSH key

# Mudar remote para SSH
git remote set-url origin git@github.com:SEU_USUARIO/palha-italiana.git

# Push
git push -u origin main
```

---

## 📊 **6. VERIFICAR SE SUBIU**

1. Acesse: `https://github.com/SEU_USUARIO/palha-italiana`
2. Verifique:
   - ✅ Todos os arquivos estão lá
   - ✅ README.md está aparecendo
   - ❌ **NÃO tem** `.env` ou `node_modules/`

---

## 🔄 **7. COMANDOS PARA O DIA A DIA**

### **Fazer mudanças e subir:**

```powershell
# Ver o que mudou
git status

# Adicionar mudanças
git add .

# Ou adicionar arquivo específico
git add back/src/services/pontosService.js

# Commit com mensagem descritiva
git commit -m "✨ feat: Adiciona sistema de brindes mantendo palhas restantes"

# Subir para GitHub
git push
```

### **Mensagens de commit sugeridas:**

```powershell
git commit -m "✨ feat: Nova funcionalidade"
git commit -m "🐛 fix: Corrige erro X"
git commit -m "📝 docs: Atualiza documentação"
git commit -m "♻️ refactor: Refatora código Y"
git commit -m "🎨 style: Melhora visual"
git commit -m "⚡ perf: Melhora performance"
git commit -m "🔒 security: Corrige vulnerabilidade"
```

---

## 🆘 **PROBLEMAS COMUNS**

### **1. "fatal: not a git repository"**
```powershell
git init
```

### **2. "error: src refspec main does not exist"**
```powershell
git branch -M main
```

### **3. "error: failed to push some refs"**
```powershell
# Baixar mudanças do GitHub antes
git pull origin main --rebase

# Depois fazer push
git push
```

### **4. "Permission denied (publickey)"**
```powershell
# Usar HTTPS em vez de SSH
git remote set-url origin https://github.com/SEU_USUARIO/palha-italiana.git
```

### **5. Commitou arquivo sensível (.env) por engano?**

```powershell
# Remover do histórico
git rm --cached back/.env
git rm --cached front/.env

# Adicionar ao .gitignore
echo "back/.env" >> .gitignore
echo "front/.env" >> .gitignore

# Commit da correção
git commit -m "🔒 Remove arquivos sensíveis"

# Push forçado (CUIDADO!)
git push --force
```

---

## 📝 **COMANDOS RESUMIDOS (COPIAR E COLAR)**

```powershell
# ==================================
# SUBIR PROJETO PELA PRIMEIRA VEZ
# ==================================

cd C:\palha-italiana

# 1. Inicializar Git
git init
git add .
git commit -m "🎉 Inicial: Sistema de Fidelidade Palha Italiana"

# 2. Conectar ao GitHub (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/palha-italiana.git
git branch -M main

# 3. Fazer push
git push -u origin main

# ==================================
# ATUALIZAR DEPOIS (DIA A DIA)
# ==================================

git status
git add .
git commit -m "✨ Sua mensagem aqui"
git push
```

---

## ✅ **CHECKLIST FINAL**

Antes de fazer push, confira:

- [ ] `.gitignore` está configurado
- [ ] Não há arquivos `.env` no stage
- [ ] `node_modules/` não está incluído
- [ ] README.md está atualizado
- [ ] Testou localmente (backend e frontend funcionando)
- [ ] Commit tem mensagem descritiva
- [ ] Verificou no GitHub após o push

---

## 🎉 **PRONTO!**

Seu projeto agora está no GitHub! 🚀

**URL do repositório:**
```
https://github.com/SEU_USUARIO/palha-italiana
```

---

## 🔗 **Links Úteis**

- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Como criar Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

**Qualquer dúvida, consulte este guia! 📖**


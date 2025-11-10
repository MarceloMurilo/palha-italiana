# ========================================
# 🚀 Script para conectar e fazer push para GitHub
# ========================================

Write-Host "🍫 Palha Italiana - GitHub Push" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host ""

# Verificar se o usuário forneceu o username
$username = Read-Host "Digite seu username do GitHub (ex: MarceloMurilo)"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "❌ Username não pode ser vazio!" -ForegroundColor Red
    exit 1
}

# URL do repositório
$repoUrl = "https://github.com/$username/palha-italiana.git"

Write-Host ""
Write-Host "📡 Conectando ao repositório..." -ForegroundColor Cyan
Write-Host "   URL: $repoUrl" -ForegroundColor Gray
Write-Host ""

# Adicionar remote (ignora erro se já existir)
git remote add origin $repoUrl 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Remote 'origin' já existe, atualizando URL..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

# Verificar remote
Write-Host "✅ Remote configurado:" -ForegroundColor Green
git remote -v
Write-Host ""

# Fazer push
Write-Host "📤 Fazendo push para o GitHub..." -ForegroundColor Cyan
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ SUCESSO! Projeto no GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 URL do repositório:" -ForegroundColor Cyan
    Write-Host "   https://github.com/$username/palha-italiana" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 Ver código:" -ForegroundColor Cyan
    Write-Host "   https://github.com/$username/palha-italiana" -ForegroundColor White
    Write-Host ""
    Write-Host "⚙️  Configurações:" -ForegroundColor Cyan
    Write-Host "   https://github.com/$username/palha-italiana/settings" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "❌ ERRO ao fazer push!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possíveis soluções:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1️⃣  Criar o repositório no GitHub:" -ForegroundColor Cyan
    Write-Host "   https://github.com/new" -ForegroundColor White
    Write-Host "   Nome: palha-italiana" -ForegroundColor Gray
    Write-Host "   Visibilidade: Private (recomendado)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2️⃣  Configurar autenticação:" -ForegroundColor Cyan
    Write-Host "   - Criar Personal Access Token:" -ForegroundColor White
    Write-Host "     GitHub → Settings → Developer settings → Personal access tokens" -ForegroundColor Gray
    Write-Host "   - Marcar: 'repo' (full control)" -ForegroundColor Gray
    Write-Host "   - Usar o TOKEN como senha ao fazer push" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3️⃣  Salvar credenciais:" -ForegroundColor Cyan
    Write-Host "   git config --global credential.helper store" -ForegroundColor White
    Write-Host ""
    Write-Host "4️⃣  Tentar novamente:" -ForegroundColor Cyan
    Write-Host "   .\git-push.ps1" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "📚 Guia completo: SUBIR-PARA-GITHUB.md" -ForegroundColor Magenta
Write-Host ""


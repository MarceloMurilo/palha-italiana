# Script para iniciar Backend e Frontend juntos
Write-Host "🍫 Iniciando Palha Italiana..." -ForegroundColor Cyan
Write-Host ""

# Verificar se as pastas existem
if (-not (Test-Path "back")) {
    Write-Host "❌ Pasta 'back' nao encontrada!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "front")) {
    Write-Host "❌ Pasta 'front' nao encontrada!" -ForegroundColor Red
    exit 1
}

# Iniciar Backend em nova janela
Write-Host "🔧 Iniciando Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\back'; npm run dev"

# Aguardar 3 segundos
Start-Sleep -Seconds 3

# Iniciar Frontend em nova janela
Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\front'; npm run dev"

Write-Host ""
Write-Host "✅ Servidores iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Aguarde alguns segundos para os servidores iniciarem..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Pressione qualquer tecla para fechar este script (os servidores continuarao rodando)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


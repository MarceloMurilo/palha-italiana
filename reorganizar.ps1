# Script para reorganizar o projeto
Write-Host "Reorganizando projeto Palha Italiana..." -ForegroundColor Cyan

# 1. Criar pasta back
Write-Host "Criando pasta back..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "back" | Out-Null

# 2. Mover arquivos do backend para back
Write-Host "Movendo arquivos do backend..." -ForegroundColor Yellow
Move-Item -Path "src" -Destination "back/src" -Force
Move-Item -Path "database" -Destination "back/database" -Force
Move-Item -Path "postman" -Destination "back/postman" -Force
Move-Item -Path "package.json" -Destination "back/package.json" -Force
Move-Item -Path "package-lock.json" -Destination "back/package-lock.json" -Force
Move-Item -Path "node_modules" -Destination "back/node_modules" -Force
Move-Item -Path ".env" -Destination "back/.env" -Force -ErrorAction SilentlyContinue

# 3. Copiar arquivos de documentacao do backend
Write-Host "Copiando documentacao do backend..." -ForegroundColor Yellow
Copy-Item -Path "README.md" -Destination "back/README.md" -Force
Copy-Item -Path "QUICKSTART.md" -Destination "back/QUICKSTART.md" -Force
Copy-Item -Path "ROTAS.md" -Destination "back/ROTAS.md" -Force
Copy-Item -Path "ENV_TEMPLATE.txt" -Destination "back/ENV_TEMPLATE.txt" -Force
Copy-Item -Path ".gitignore" -Destination "back/.gitignore" -Force -ErrorAction SilentlyContinue

# 4. Remover pasta frontend vazia
Write-Host "Removendo pasta frontend vazia..." -ForegroundColor Yellow
Remove-Item -Path "frontend" -Force -Recurse -ErrorAction SilentlyContinue

# 5. Finalizar
Write-Host "Reorganizacao concluida!" -ForegroundColor Green
Write-Host "Estrutura criada:" -ForegroundColor Cyan
Write-Host "  back/  - Backend" -ForegroundColor White
Write-Host "  front/ - Frontend (criar depois)" -ForegroundColor White

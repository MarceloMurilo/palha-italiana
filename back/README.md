# 🍫 Backend Palha Italiana - Sistema de Fidelidade

Backend em Node.js + Express.js com integração ao Supabase para o sistema de fidelidade da Palha Italiana.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Execução](#execução)
- [Documentação da API](#documentação-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints](#endpoints)

## 🎯 Sobre o Projeto

Sistema de fidelidade via PWA acessado por QR code. Permite aos clientes:

- Fazer login e registrar compras
- Visualizar pontos acumulados
- Receber brindes (1 palha grátis a cada 5 compradas)

E aos vendedores:

- Confirmar pagamentos manualmente
- Visualizar resumo de vendas

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Supabase** - Backend as a Service (PostgreSQL + Auth)
- **Swagger** - Documentação da API
- **Helmet.js** - Segurança
- **CORS** - Cross-Origin Resource Sharing

## 📦 Pré-requisitos

- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com)
- Git

## ⚙️ Instalação

1. **Clone o repositório** (ou extraia os arquivos)

```bash
cd palha-italiana
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `ENV_TEMPLATE.txt` para `.env`:

```bash
cp ENV_TEMPLATE.txt .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui

PORT=3000
NODE_ENV=development

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🗄️ Configuração do Banco de Dados

### 1. Criar as tabelas no Supabase

Execute os scripts SQL no SQL Editor do Supabase (arquivo `database/schema.sql`):

```sql
-- A tabela auth.users já existe (Supabase Auth)

-- Tabela de vendedores
CREATE TABLE vendedores (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de compras
CREATE TABLE compras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vendedor_id UUID REFERENCES vendedores(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    valor_total NUMERIC(10,2) NOT NULL CHECK (valor_total > 0),
    bonus INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'rejeitado')),
    confirmado_por UUID REFERENCES vendedores(id),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmado_em TIMESTAMP WITH TIME ZONE
);

-- Tabela de pontos de fidelidade
CREATE TABLE pontos_fidelidade (
    usuario_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_pontos INTEGER DEFAULT 0,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_compras_usuario ON compras(usuario_id);
CREATE INDEX idx_compras_status ON compras(status);
CREATE INDEX idx_compras_vendedor ON compras(vendedor_id);
```

### 2. Criar a Trigger para atualizar pontos automaticamente

Execute no SQL Editor:

```sql
-- Função que atualiza os pontos
CREATE OR REPLACE FUNCTION atualizar_pontos_fidelidade()
RETURNS TRIGGER AS $$
BEGIN
    -- Apenas quando a compra for confirmada
    IF NEW.status = 'confirmado' AND OLD.status != 'confirmado' THEN
        -- Insere ou atualiza os pontos
        INSERT INTO pontos_fidelidade (usuario_id, total_pontos, atualizado_em)
        VALUES (NEW.usuario_id, NEW.quantidade + NEW.bonus, NOW())
        ON CONFLICT (usuario_id)
        DO UPDATE SET
            total_pontos = pontos_fidelidade.total_pontos + NEW.quantidade + NEW.bonus,
            atualizado_em = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que executa após UPDATE
CREATE TRIGGER trigger_atualizar_pontos
AFTER UPDATE ON compras
FOR EACH ROW
EXECUTE FUNCTION atualizar_pontos_fidelidade();
```

### 3. Criar a View de resumo de vendas

```sql
CREATE OR REPLACE VIEW resumo_vendas AS
SELECT
    v.id AS vendedor_id,
    v.nome AS vendedor_nome,
    COUNT(c.id) AS total_vendas,
    SUM(c.quantidade) AS total_palhas_vendidas,
    SUM(c.bonus) AS total_brindes_dados,
    SUM(c.valor_total) AS valor_total_vendas
FROM vendedores v
LEFT JOIN compras c ON c.vendedor_id = v.id AND c.status = 'confirmado'
GROUP BY v.id, v.nome;
```

### 4. Configurar políticas de segurança (RLS)

```sql
-- Habilitar RLS
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE pontos_fidelidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendedores ENABLE ROW LEVEL SECURITY;

-- Políticas para compras
CREATE POLICY "Usuários podem ver suas próprias compras"
ON compras FOR SELECT
USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem criar suas próprias compras"
ON compras FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Vendedores podem ver todas as compras"
ON compras FOR SELECT
USING (EXISTS (SELECT 1 FROM vendedores WHERE id = auth.uid()));

CREATE POLICY "Vendedores podem atualizar compras"
ON compras FOR UPDATE
USING (EXISTS (SELECT 1 FROM vendedores WHERE id = auth.uid()));

-- Políticas para pontos
CREATE POLICY "Usuários podem ver seus próprios pontos"
ON pontos_fidelidade FOR SELECT
USING (auth.uid() = usuario_id);
```

## 🏃 Execução

### Modo Desenvolvimento (com hot reload)

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

O servidor irá iniciar em `http://localhost:3000` (ou a porta definida no `.env`).

## 📚 Documentação da API

Após iniciar o servidor, acesse:

- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/health

## 📁 Estrutura do Projeto

```
palha-italiana/
├── src/
│   ├── config/
│   │   ├── supabase.js        # Configuração do Supabase
│   │   └── swagger.js          # Configuração do Swagger
│   ├── controllers/
│   │   ├── authController.js   # Controller de autenticação
│   │   ├── comprasController.js # Controller de compras
│   │   └── pontosController.js  # Controller de pontos
│   ├── middleware/
│   │   └── auth.js             # Middleware de autenticação
│   ├── routes/
│   │   ├── authRoutes.js       # Rotas de autenticação
│   │   ├── comprasRoutes.js    # Rotas de compras
│   │   ├── pontosRoutes.js     # Rotas de pontos
│   │   └── index.js            # Agregador de rotas
│   ├── services/
│   │   ├── comprasService.js   # Lógica de negócio de compras
│   │   ├── pontosService.js    # Lógica de negócio de pontos
│   │   └── vendedorService.js  # Lógica de negócio de vendedores
│   ├── validators/
│   │   └── comprasValidator.js # Validação de dados
│   └── index.js                # Servidor principal
├── database/
│   └── schema.sql              # Scripts SQL
├── .gitignore
├── ENV_TEMPLATE.txt            # Template de variáveis de ambiente
├── package.json
└── README.md
```

## 🔌 Endpoints

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registra novo usuário | ❌ |
| POST | `/api/auth/login` | Faz login | ❌ |
| POST | `/api/auth/logout` | Faz logout | ✅ |
| GET | `/api/auth/me` | Info do usuário logado | ✅ |

### Compras

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/compras` | Cria compra pendente | ✅ |
| GET | `/api/compras` | Lista compras | ✅ |
| GET | `/api/compras/:id` | Busca compra específica | ✅ |
| PATCH | `/api/compras/:id/confirmar` | Confirma compra | ✅ Vendedor |
| PATCH | `/api/compras/:id/rejeitar` | Rejeita compra | ✅ Vendedor |

### Pontos e Estatísticas

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/pontos` | Pontos do usuário | ✅ |
| GET | `/api/pontos/estatisticas` | Estatísticas do usuário | ✅ |
| GET | `/api/pontos/resumo-vendas` | Resumo de vendas | ✅ Vendedor |

## 🔐 Autenticação

Todas as rotas protegidas requerem um token JWT no header:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

O token é obtido no login e retornado na resposta:

```json
{
  "message": "Login realizado com sucesso",
  "data": {
    "user": { ... },
    "session": {
      "access_token": "seu-token-jwt",
      "refresh_token": "..."
    }
  }
}
```

## 📝 Exemplos de Requisições

### Registrar usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@example.com",
    "password": "senha123",
    "nome": "João Silva"
  }'
```

### Fazer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@example.com",
    "password": "senha123"
  }'
```

### Criar compra

```bash
curl -X POST http://localhost:3000/api/compras \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "quantidade": 5,
    "valor_total": 50.00
  }'
```

### Confirmar compra (vendedor)

```bash
curl -X PATCH http://localhost:3000/api/compras/UUID_DA_COMPRA/confirmar \
  -H "Authorization: Bearer TOKEN_DO_VENDEDOR"
```

### Buscar pontos

```bash
curl -X GET http://localhost:3000/api/pontos \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 🧪 Testando com Postman

1. Importe a coleção do Postman (disponível em `postman/collection.json`)
2. Configure a variável `{{baseUrl}}` para `http://localhost:3000`
3. Após o login, o token será automaticamente salvo na variável `{{token}}`

## 🛠️ Troubleshooting

### Erro: "Missing Supabase environment variables"

Verifique se o arquivo `.env` foi criado e contém as variáveis `SUPABASE_URL` e `SUPABASE_ANON_KEY`.

### Erro: "Token inválido ou expirado"

O token JWT expira após 1 hora. Faça login novamente para obter um novo token.

### Erro de CORS

Adicione a origem do seu frontend no `.env`:

```env
ALLOWED_ORIGINS=http://localhost:5173,https://seu-dominio.com
```

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Desenvolvedor

Desenvolvido para a Palha Italiana 🍫


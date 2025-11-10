# 🛣️ Documentação de Rotas

Referência completa de todos os endpoints da API.

---

## 🔐 Autenticação

### POST /api/auth/register

Registra um novo usuário no sistema.

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123",
  "nome": "Nome do Usuário" // opcional
}
```

**Response 201:**
```json
{
  "message": "Usuário registrado com sucesso",
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@example.com",
      "user_metadata": {
        "nome": "Nome do Usuário"
      }
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token"
    }
  }
}
```

---

### POST /api/auth/login

Faz login de um usuário existente.

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Response 200:**
```json
{
  "message": "Login realizado com sucesso",
  "data": {
    "user": { /* dados do usuário */ },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token"
    }
  }
}
```

---

### GET /api/auth/me

Retorna informações do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "email": "usuario@example.com",
    "user_metadata": { /* ... */ }
  }
}
```

---

### POST /api/auth/logout

Faz logout do usuário.

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 🛒 Compras

### POST /api/compras

Cria uma nova compra com status pendente.

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "quantidade": 5,
  "valor_total": 50.00
}
```

**Regras:**
- `quantidade` deve ser >= 1
- `valor_total` deve ser > 0
- Bônus calculado automaticamente: 1 palha a cada 5 compradas

**Response 201:**
```json
{
  "message": "Compra criada com sucesso",
  "data": {
    "id": "uuid",
    "usuario_id": "uuid",
    "quantidade": 5,
    "valor_total": "50.00",
    "bonus": 1,
    "status": "pendente",
    "criado_em": "2024-01-15T10:30:00Z"
  }
}
```

---

### GET /api/compras

Lista compras do usuário (ou todas, se for vendedor).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `status` (opcional): `pendente`, `confirmado`, `rejeitado`

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "usuario_id": "uuid",
      "quantidade": 5,
      "valor_total": "50.00",
      "bonus": 1,
      "status": "pendente",
      "criado_em": "2024-01-15T10:30:00Z"
    }
  ],
  "is_vendedor": false
}
```

---

### GET /api/compras/:id

Busca uma compra específica por ID.

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "usuario_id": "uuid",
    "quantidade": 5,
    "valor_total": "50.00",
    "bonus": 1,
    "status": "pendente",
    "criado_em": "2024-01-15T10:30:00Z"
  }
}
```

---

### PATCH /api/compras/:id/confirmar

Confirma uma compra (apenas vendedores).

**Headers:**
```
Authorization: Bearer {token-do-vendedor}
```

**Regras:**
- Apenas usuários da tabela `vendedores` podem confirmar
- Compra deve estar com status `pendente`
- Após confirmação, os pontos são adicionados automaticamente (trigger)

**Response 200:**
```json
{
  "message": "Compra confirmada com sucesso",
  "data": {
    "id": "uuid",
    "status": "confirmado",
    "confirmado_por": "uuid-do-vendedor",
    "confirmado_em": "2024-01-15T11:00:00Z"
  }
}
```

---

### PATCH /api/compras/:id/rejeitar

Rejeita uma compra (apenas vendedores).

**Headers:**
```
Authorization: Bearer {token-do-vendedor}
```

**Response 200:**
```json
{
  "message": "Compra rejeitada com sucesso",
  "data": {
    "id": "uuid",
    "status": "rejeitado",
    "confirmado_por": "uuid-do-vendedor",
    "confirmado_em": "2024-01-15T11:00:00Z"
  }
}
```

---

## 🏆 Pontos e Estatísticas

### GET /api/pontos

Retorna os pontos de fidelidade do usuário.

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "data": {
    "usuario_id": "uuid",
    "total_pontos": 25,
    "atualizado_em": "2024-01-15T11:00:00Z"
  }
}
```

**Nota:** Se o usuário ainda não tiver pontos, retorna `total_pontos: 0`.

---

### GET /api/pontos/estatisticas

Retorna estatísticas detalhadas do usuário.

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "data": {
    "total_compras": 3,
    "total_palhas": 15,
    "total_brindes": 3,
    "valor_total_gasto": "150.00"
  }
}
```

---

### GET /api/pontos/resumo-vendas

Retorna resumo de vendas por vendedor (apenas vendedores).

**Headers:**
```
Authorization: Bearer {token-do-vendedor}
```

**Response 200:**
```json
{
  "data": [
    {
      "vendedor_id": "uuid",
      "vendedor_nome": "João Silva",
      "vendedor_email": "joao@example.com",
      "total_vendas": 10,
      "total_palhas_vendidas": 50,
      "total_brindes_dados": 10,
      "valor_total_vendas": "500.00"
    }
  ]
}
```

---

## 🏥 Health Check

### GET /api/health

Verifica se a API está funcionando.

**Response 200:**
```json
{
  "status": "OK",
  "message": "API Palha Italiana funcionando",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

## ❌ Códigos de Erro

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Dados inválidos |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 500 | Erro do servidor |

### Formato de Erro

```json
{
  "error": "Mensagem de erro aqui"
}
```

### Erros de Validação

```json
{
  "errors": [
    {
      "field": "quantidade",
      "message": "Quantidade deve ser maior que zero"
    }
  ]
}
```

---

## 🔑 Autenticação

Todas as rotas protegidas requerem o header:

```
Authorization: Bearer {access_token}
```

O token é obtido no login/registro e expira após **1 hora**.

### Refresh Token

Para obter um novo access_token sem fazer login novamente, use o refresh_token com o Supabase Auth.

---

## 📝 Notas Importantes

1. **Bônus**: Calculado automaticamente como `Math.floor(quantidade / 5)`
2. **Pontos**: Atualizados automaticamente por trigger quando compra é confirmada
3. **Status de Compra**: Só pode ir de `pendente` → `confirmado` ou `pendente` → `rejeitado`
4. **Vendedores**: Devem estar cadastrados na tabela `vendedores` para confirmar compras

---

## 🧪 Exemplo de Fluxo Completo

```bash
# 1. Registrar cliente
POST /api/auth/register
Body: { "email": "cliente@example.com", "password": "senha123" }

# 2. Login
POST /api/auth/login
Body: { "email": "cliente@example.com", "password": "senha123" }
# Salvar o access_token

# 3. Criar compra
POST /api/compras
Header: Authorization: Bearer {token}
Body: { "quantidade": 5, "valor_total": 50.00 }
# Salvar o ID da compra

# 4. Login como vendedor
POST /api/auth/login
Body: { "email": "vendedor@example.com", "password": "senha123" }

# 5. Listar compras pendentes
GET /api/compras?status=pendente
Header: Authorization: Bearer {token-vendedor}

# 6. Confirmar compra
PATCH /api/compras/{id}/confirmar
Header: Authorization: Bearer {token-vendedor}

# 7. Cliente verifica pontos
GET /api/pontos
Header: Authorization: Bearer {token-cliente}
# Deve retornar 6 pontos (5 palhas + 1 bônus)
```

---

**Dica**: Use o Swagger em `/api-docs` para testar visualmente todos os endpoints! 🚀


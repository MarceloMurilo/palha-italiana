# 🎁 Sistema de Brindes - Palha Italiana

## 📋 **Como Funciona**

### **Para o Cliente:**

1. **Comprar Palhas:**
   - Cada 5 palhas compradas = 1 brinde disponível
   - Exemplo: 11 palhas = 2 brindes disponíveis

2. **Ver Brindes:**
   - Acesse "Meus Pontos"
   - Veja quantos brindes você tem disponíveis
   - Se tiver brindes, aparece um aviso verde no topo

3. **Resgatar Brinde:**
   - Procure o vendedor
   - Mostre seu painel de pontos
   - Vendedor dá baixa no brinde

4. **Após o Resgate:**
   - Suas palhas e pontos são zerados
   - Você recomeça do zero

---

## 🛒 **Para o Vendedor:**

### **Ver Clientes com Brindes:**

1. Acesse o **Painel do Vendedor**
2. Clique no botão **"🎁 Brindes"** (no topo)
3. Veja a lista de clientes com brindes disponíveis

### **Dar Baixa no Brinde:**

1. Na lista de clientes com brindes
2. Clique em **"Dar Baixa no Brinde (Zerar)"**
3. Confirme a entrega
4. ✅ **Palhas e pontos do cliente são zerados**

---

## 🔄 **Fluxo Completo**

```
Cliente compra 5 palhas
       ↓
Sistema calcula: 5 ÷ 5 = 1 brinde disponível
       ↓
Cliente vê "🎉 Você tem 1 brinde disponível"
       ↓
Cliente procura vendedor
       ↓
Vendedor acessa "Brindes" → Dá baixa
       ↓
✅ Palhas e pontos zerados → Cliente recomeça
```

---

## 🆕 **Mudanças Implementadas**

### **Backend:**

1. ✅ **Rota:** `GET /api/pontos/clientes-com-brindes`
   - Lista clientes com brindes disponíveis
   - Apenas vendedores podem acessar

2. ✅ **Rota:** `POST /api/pontos/dar-baixa-brinde/:usuarioId`
   - Dá baixa no brinde (zera palhas e pontos)
   - Apenas vendedores podem acessar

3. ✅ **Cálculo de Brindes Disponíveis:**
   - `brindesDisponiveis = Math.floor(totalPalhas / 5)`
   - Baseado em palhas compradas, não pontos

### **Frontend:**

1. ✅ **Pontos.jsx:**
   - Mostra "Brindes Disponíveis" (não "Total de Brindes")
   - Aviso verde quando tem brindes disponíveis
   - Cálculo correto do próximo brinde

2. ✅ **Vendedor.jsx:**
   - Botão para alternar entre "Compras" e "Brindes"
   - Lista de clientes com brindes disponíveis
   - Botão "Dar Baixa no Brinde"
   - Confirma antes de zerar

---

## 🧪 **Como Testar**

### **1. Criar Compras de Teste:**

```sql
-- No Supabase SQL Editor
-- (Substitua UUID_DO_CLIENTE pelo ID real do seu usuário)

-- Cliente compra 11 palhas
INSERT INTO compras (usuario_id, vendedor_id, quantidade, valor_total, bonus, status, confirmado_por)
VALUES 
  ('UUID_DO_CLIENTE', 'UUID_DO_VENDEDOR', 5, 25.00, 1, 'confirmado', 'UUID_DO_VENDEDOR'),
  ('UUID_DO_CLIENTE', 'UUID_DO_VENDEDOR', 6, 30.00, 1, 'confirmado', 'UUID_DO_VENDEDOR');

-- Atualiza pontos (caso a trigger não rode)
INSERT INTO pontos_fidelidade (usuario_id, total_pontos)
VALUES ('UUID_DO_CLIENTE', 12)
ON CONFLICT (usuario_id) DO UPDATE SET total_pontos = 12;
```

### **2. Verificar Brindes (Cliente):**

1. Faça login como cliente
2. Vá em "Meus Pontos"
3. Deve mostrar:
   - **11 palhas compradas**
   - **2 brindes disponíveis** ✅
   - Aviso verde: "🎉 Você tem 2 brindes disponíveis!"

### **3. Dar Baixa (Vendedor):**

1. Faça login como vendedor
2. Clique em **"🎁 Brindes"**
3. Veja o cliente com 2 brindes
4. Clique em **"Dar Baixa no Brinde"**
5. Confirme

### **4. Verificar Zeramento:**

1. Volte como cliente
2. Vá em "Meus Pontos"
3. Deve mostrar:
   - **0 palhas**
   - **0 brindes**
   - **0 pontos**

---

## 📝 **Notas Importantes**

### **Por que zerar?**
- Evita confusão: cliente não pensa que ainda tem brindes antigos
- Recomeça do zero a cada resgate
- Sistema fica mais claro

### **Cálculo de Brindes:**
- `total_palhas = 11`
- `brindes_disponiveis = Math.floor(11 / 5) = 2`
- `palhas_para_proximo = 5 - (11 % 5) = 4`

### **O que é deletado ao dar baixa:**
1. ✅ Todas as compras confirmadas do cliente
2. ✅ Pontos zerados na tabela `pontos_fidelidade`
3. ❌ Compras pendentes/rejeitadas NÃO são deletadas

---

## 🚀 **Próximos Passos**

Se quiser adicionar mais funcionalidades:

1. **Histórico de Brindes Resgatados:**
   - Criar tabela `brindes_resgatados`
   - Guardar data e quantidade

2. **Notificação para Cliente:**
   - Quando tiver brinde disponível
   - Push notification ou email

3. **Painel de Estatísticas:**
   - Total de brindes entregues
   - Clientes mais fiéis

---

## ✅ **Resumo**

| **Antes** | **Depois** |
|-----------|------------|
| Brindes acumulavam sem controle | Brindes disponíveis calculados dinamicamente |
| Cliente não sabia quando tinha brinde | Aviso verde destacado |
| Vendedor não tinha controle | Painel específico de brindes |
| Palhas não zeravam | Zera após resgate (recomeça do zero) |

**Agora está pronto para usar! 🎉🍫**


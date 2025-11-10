# 🎁 Sistema de Brindes V2 - Mantém Palhas Restantes

## 📋 **Como Funciona Agora**

### **Cálculo de Brindes e Palhas Restantes:**

```
11 palhas compradas
↓
11 ÷ 5 = 2 brindes (usa 10 palhas)
11 % 5 = 1 palha restante (fica acumulada)
```

### **Quando Vendedor Dá Baixa:**

1. ✅ **Zera os brindes:** 2 brindes entregues
2. ✅ **Zera as palhas usadas:** 10 palhas zeradas
3. ✅ **Mantém palhas restantes:** 1 palha acumulada
4. ✅ **Cliente recomeça com:** 1 palha (falta 4 pro próximo brinde)

---

## 🔄 **Fluxo Completo**

### **Exemplo Prático:**

```
Cliente compra 11 palhas
       ↓
Sistema calcula:
  - 11 ÷ 5 = 2 brindes disponíveis
  - 11 % 5 = 1 palha restante
       ↓
Cliente vê: "🎉 Você tem 2 brindes disponíveis!"
       ↓
Vendedor entrega os brindes
       ↓
Sistema:
  - Deleta todas as compras antigas
  - Cria nova compra com 1 palha (restante)
  - Atualiza pontos: 1 ponto
       ↓
Cliente agora tem:
  - 1 palha acumulada ✅
  - 0 brindes disponíveis
  - Próximo brinde em: 4 palhas
```

---

## 🆕 **Mudanças na V2**

### **Antes (V1):**
- ❌ Zerava TUDO (palhas, pontos, brindes)
- ❌ Cliente perdia progresso

### **Agora (V2):**
- ✅ Zera apenas brindes e palhas usadas
- ✅ **Mantém palhas restantes**
- ✅ Cliente continua com progresso acumulado

---

## 🧮 **Exemplos de Cálculo**

### **Exemplo 1: 11 palhas**
```
Total: 11 palhas
Brindes: 11 ÷ 5 = 2 brindes
Palhas usadas: 2 × 5 = 10 palhas
Palhas restantes: 11 % 5 = 1 palha ✅

Após dar baixa:
- Cliente fica com: 1 palha
- Faltam: 4 palhas pro próximo brinde
```

### **Exemplo 2: 8 palhas**
```
Total: 8 palhas
Brindes: 8 ÷ 5 = 1 brinde
Palhas usadas: 1 × 5 = 5 palhas
Palhas restantes: 8 % 5 = 3 palhas ✅

Após dar baixa:
- Cliente fica com: 3 palhas
- Faltam: 2 palhas pro próximo brinde
```

### **Exemplo 3: 10 palhas (múltiplo de 5)**
```
Total: 10 palhas
Brindes: 10 ÷ 5 = 2 brindes
Palhas usadas: 2 × 5 = 10 palhas
Palhas restantes: 10 % 5 = 0 palhas

Após dar baixa:
- Cliente fica com: 0 palhas
- Recomeça do zero
```

---

## 🛠️ **Implementação Técnica**

### **Backend (`pontosService.js`):**

```javascript
// Calcula palhas restantes
const totalPalhas = 11;
const totalBrindes = Math.floor(totalPalhas / 5); // 2
const palhasRestantes = totalPalhas % 5; // 1
const palhasUsadas = totalBrindes * 5; // 10

// 1. Deleta todas as compras confirmadas
DELETE FROM compras WHERE usuario_id = X AND status = 'confirmado';

// 2. Se tem palhas restantes, cria nova compra
if (palhasRestantes > 0) {
  INSERT INTO compras (usuario_id, quantidade, bonus, status)
  VALUES (X, 1, 0, 'confirmado');
}

// 3. Atualiza pontos
UPDATE pontos_fidelidade 
SET total_pontos = 1 
WHERE usuario_id = X;
```

### **Frontend (`Vendedor.jsx`):**

```javascript
const handleDarBaixaBrinde = async (usuarioId, clienteNome) => {
  // Confirma entrega
  if (!confirm(`Confirmar entrega do brinde para ${clienteNome}?\n\nAs palhas que geraram brindes serão zeradas, mas as restantes serão mantidas.`)) return;
  
  // Chama API
  const response = await api.darBaixaNoBrinde(usuarioId);
  
  // Mostra mensagem personalizada
  alert(response.message);
  // Ex: "Brinde entregue! 10 palhas foram zeradas. Cliente mantém 1 palha(s) acumulada(s)."
};
```

---

## 🧪 **Como Testar**

### **Teste 1: Cliente com 11 palhas**

1. **Criar compras de teste (SQL):**
```sql
-- Substitua UUID_DO_CLIENTE e UUID_DO_VENDEDOR

INSERT INTO compras (usuario_id, vendedor_id, quantidade, valor_total, bonus, status, confirmado_por, confirmado_em)
VALUES 
  ('UUID_DO_CLIENTE', 'UUID_DO_VENDEDOR', 5, 25.00, 1, 'confirmado', 'UUID_DO_VENDEDOR', NOW()),
  ('UUID_DO_CLIENTE', 'UUID_DO_VENDEDOR', 6, 30.00, 1, 'confirmado', 'UUID_DO_VENDEDOR', NOW());

UPDATE pontos_fidelidade SET total_pontos = 12 WHERE usuario_id = 'UUID_DO_CLIENTE';
```

2. **Verificar no frontend (Cliente):**
   - Total: 11 palhas
   - Brindes disponíveis: 2
   - Próximo brinde em: 4 palhas

3. **Dar baixa (Vendedor):**
   - Clique em "🎁 Brindes"
   - Veja o cliente com 2 brindes
   - Clique em "Entregar Brinde"
   - Confirme

4. **Verificar resultado (Cliente):**
   - Total: **1 palha** ✅
   - Brindes disponíveis: 0
   - Próximo brinde em: 4 palhas
   - Pontos: 1

---

## 📊 **Tabela de Exemplos**

| Palhas Compradas | Brindes | Palhas Usadas | Palhas Restantes | Após Baixa |
|-----------------|---------|---------------|------------------|------------|
| 5               | 1       | 5             | 0                | 0 palhas   |
| 6               | 1       | 5             | 1                | 1 palha ✅ |
| 10              | 2       | 10            | 0                | 0 palhas   |
| 11              | 2       | 10            | 1                | 1 palha ✅ |
| 14              | 2       | 10            | 4                | 4 palhas ✅|
| 19              | 3       | 15            | 4                | 4 palhas ✅|
| 20              | 4       | 20            | 0                | 0 palhas   |

---

## 📝 **Arquivos Modificados**

### **Backend:**
- ✅ `back/src/services/pontosService.js` - Função `darBaixaNoBrinde`
  - Calcula palhas restantes
  - Cria compra com palhas restantes
  - Atualiza pontos corretamente

### **Frontend:**
- ✅ `front/src/pages/Vendedor.jsx` - Função `handleDarBaixaBrinde`
  - Mostra nome do cliente na confirmação
  - Mostra mensagem personalizada
  - Texto atualizado: "As palhas restantes serão mantidas"

---

## ✅ **Resumo**

### **Antes (V1):**
```
11 palhas → Dar baixa → 0 palhas
Cliente perde o progresso ❌
```

### **Agora (V2):**
```
11 palhas → Dar baixa → 1 palha
Cliente mantém progresso ✅
```

**Muito mais justo e intuitivo!** 🎉

---

## 🚀 **Teste Agora!**

Execute os comandos:

```bash
# Backend
cd C:\palha-italiana\back
npm run dev

# Frontend (outro terminal)
cd C:\palha-italiana\front
npm run dev
```

**Tudo pronto! Sistema atualizado com sucesso! 🍫🎁**


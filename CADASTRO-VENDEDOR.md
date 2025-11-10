# 🛒 Como se Cadastrar como Vendedor

## ✅ Sistema de Cadastro de Vendedor Implementado!

Agora você pode se cadastrar como vendedor diretamente pela tela de login!

---

## 🚀 Como Fazer:

### 1️⃣ **Acessar Tela de Cadastro**
1. Vá em: http://localhost:5173
2. Clique em "**Não tem conta? Cadastre-se**"

### 2️⃣ **Preencher Formulário**
1. **Nome:** Seu nome completo
2. **Email:** Seu email (que você tem acesso)
3. **Senha:** Mínimo 6 caracteres
4. **✅ Marcar:** "🛒 Sou vendedor"

### 3️⃣ **Cadastrar**
1. Clique em "**Cadastrar**"
2. Você verá a mensagem:
   ```
   ✅ Cadastro de vendedor realizado! Verifique seu email 
      para confirmar. Após confirmar, faça login para 
      acessar o painel.
   ```

### 4️⃣ **Confirmar Email**
1. Vá na sua caixa de entrada
2. Procure por email do **Supabase**
3. Clique no link de confirmação

### 5️⃣ **Fazer Login**
1. Volte para: http://localhost:5173
2. Faça login com seu email e senha
3. **Você será redirecionado automaticamente para o painel do vendedor!** 🎉

---

## 🎯 O que Acontece por Trás:

1. ✅ Usuário é criado no Supabase Auth
2. ✅ Sistema detecta que marcou "Sou vendedor"
3. ✅ Automaticamente adiciona na tabela `vendedores`
4. ✅ No login, detecta que é vendedor
5. ✅ Redireciona para `/vendedor` ao invés de `/comprar`

---

## 📱 Tela de Cadastro - O que Você Verá:

```
╔═══════════════════════════════════════╗
║           🍫 Palha Italiana           ║
║       Sistema de Fidelidade           ║
╠═══════════════════════════════════════╣
║                                       ║
║  Nome:     [                    ]     ║
║                                       ║
║  ☑ 🛒 Sou vendedor                    ║
║     Marque esta opção se você é       ║
║     vendedor e precisa acessar o      ║
║     painel de confirmação de compras  ║
║                                       ║
║  Email:    [                    ]     ║
║                                       ║
║  Senha:    [                    ]     ║
║                                       ║
║  [ 📧 Após o cadastro, você           ║
║    receberá um email de confirmação ] ║
║                                       ║
║         [    Cadastrar    ]           ║
║                                       ║
║   Já tem conta? Fazer login           ║
╚═══════════════════════════════════════╝
```

---

## 🔍 Como Verificar se Está Funcionando:

### No Terminal do Backend:
Quando você cadastrar como vendedor, deve aparecer:
```
📝 Tentando registrar: { 
  email: 'seu@email.com', 
  nome: 'Seu Nome', 
  senhaLength: 6, 
  isVendedor: true 
}
✅ Usuário registrado com sucesso: seu@email.com
🛒 Registrando como vendedor...
✅ Vendedor registrado na tabela!
```

### Após Login:
- ✅ Vendedor → Redireciona para `/vendedor` (painel)
- ✅ Cliente → Redireciona para `/comprar`

---

## 🛠️ Para Admin/Desenvolvedor:

### Verificar Vendedores no Banco:

No Supabase SQL Editor:
```sql
SELECT * FROM vendedores;
```

Deve mostrar:
```
id                | nome          | email
------------------+---------------+------------------
uuid-do-usuario   | Seu Nome      | seu@email.com
```

---

## ❓ Perguntas Frequentes:

### **Posso mudar de cliente para vendedor depois?**
Não diretamente pela interface, mas você pode executar no SQL Editor:
```sql
INSERT INTO vendedores (id, nome, email)
VALUES ('seu-user-id', 'Seu Nome', 'seu@email.com');
```

### **Um vendedor pode comprar palhas também?**
Sim! O vendedor tem acesso tanto ao painel `/vendedor` quanto à tela `/comprar`.

### **Como ver se sou vendedor?**
Após fazer login, se for redirecionado para a tela com compras pendentes, você é vendedor!

---

## ✅ Checklist de Teste:

- [ ] Acesse a tela de cadastro
- [ ] Marque "Sou vendedor"
- [ ] Preencha os dados
- [ ] Cadastre
- [ ] Veja mensagem de sucesso específica para vendedor
- [ ] Confirme o email
- [ ] Faça login
- [ ] Seja redirecionado para `/vendedor`
- [ ] Veja a tela de compras pendentes! 🎉

---

**Agora você pode se cadastrar como vendedor facilmente! 🛒✨**


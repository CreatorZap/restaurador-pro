# 🔧 CORRIGIR ERRO - Mercado Pago

## ❌ Erro Atual

"Erro ao criar pagamento" aparece no modal quando clica em "Pagar R$49".

---

## 🔍 Diagnóstico

O servidor estava procurando por `MP_ACCESS_TOKEN`, mas você configurou `MERCADOPAGO_ACCESS_TOKEN`.

### ✅ Correção Aplicada

O servidor agora aceita **ambos os nomes**:
```javascript
const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN || 'TEST-...';
```

---

## 🚀 Como Corrigir

### Passo 1: Parar o Servidor

```bash
# Pressione Ctrl+C no terminal onde o servidor está rodando
```

### Passo 2: Reiniciar o Servidor

```bash
npm run api
```

### Passo 3: Verificar Logs

Você deve ver:
```
🚀 ================================
   API Server + Mercado Pago
🚀 ================================

📍 URL: http://localhost:3001

🔑 Mercado Pago:
   Token configurado: ✅ SIM
   Token: APP_USR-12345678...

📝 Endpoints de Códigos:
   ...
```

**IMPORTANTE**: Se aparecer "❌ NÃO" no token, o `.env.local` não está sendo lido!

---

## 🔑 Verificar .env.local

### Seu .env.local deve ter:

```bash
# Mercado Pago
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxx
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxx

# Gemini
VITE_GEMINI_API_KEY=sua-chave-aqui
```

### ⚠️ IMPORTANTE

1. **Não use credenciais de TESTE** (`TEST-...`)
2. **Use credenciais de PRODUÇÃO** (`APP_USR-...`)
3. **Reinicie o servidor** após alterar o `.env.local`

---

## 🧪 Testar Novamente

### Passo 1: Acessar Aplicação

http://localhost:3002

### Passo 2: Tentar Pagamento

1. Role até "Escolha seu Pacote"
2. Clique em "Comprar Agora"
3. Digite email: `teste@teste.com`
4. Clique em **"Pagar R$49"**

### Passo 3: Verificar Logs do Servidor

Você deve ver:
```
💳 POST /api/payment/create
   Package: family, Email: teste@teste.com
   🔑 Token: APP_USR-12345678...
   📦 Criando preferência...
   ✅ Preferência criada: 123456789-abc
   🔗 Link: https://www.mercadopago.com.br/...
```

### Se Der Erro

Você verá logs detalhados:
```
❌ Erro ao criar preferência:
   Mensagem: Invalid access token
   Status: 401
   Causa: ...
```

---

## 🔍 Possíveis Erros

### Erro 1: "Invalid access token"

**Causa**: Token inválido ou expirado

**Solução**:
1. Acesse: https://www.mercadopago.com.br/developers
2. Vá em "Suas integrações"
3. Copie o **Access Token** correto
4. Cole no `.env.local`
5. Reinicie o servidor

### Erro 2: Token não é carregado

**Causa**: `.env.local` não está sendo lido

**Solução**:
1. Verifique se o arquivo está na raiz do projeto
2. Verifique se não tem espaços extras
3. Reinicie o servidor
4. Tente usar `MP_ACCESS_TOKEN` ao invés de `MERCADOPAGO_ACCESS_TOKEN`

### Erro 3: "payer.email is required"

**Causa**: Email não está sendo enviado

**Solução**: Já está corrigido no código

---

## 📝 Checklist de Verificação

- [ ] `.env.local` existe na raiz do projeto
- [ ] `MERCADOPAGO_ACCESS_TOKEN` está configurado
- [ ] Token começa com `APP_USR-` (produção) ou `TEST-` (teste)
- [ ] Servidor foi reiniciado após alterar `.env.local`
- [ ] Logs mostram "Token configurado: ✅ SIM"
- [ ] Teste de pagamento foi feito
- [ ] Logs mostram "Preferência criada"

---

## 🎯 Teste Alternativo: Simulação

Se o pagamento real ainda não funcionar, use a **simulação**:

1. Clique em "Comprar Agora"
2. Digite email
3. Clique em **"🧪 Simular Pagamento (teste)"**
4. ✅ Código gerado instantaneamente!

A simulação **não precisa** de credenciais do Mercado Pago.

---

## 🔧 Logs Adicionados

O servidor agora mostra logs detalhados:

### Ao Iniciar
```
🔑 Mercado Pago:
   Token configurado: ✅ SIM
   Token: APP_USR-12345678...
```

### Ao Criar Pagamento
```
💳 POST /api/payment/create
   Package: family, Email: teste@teste.com
   🔑 Token: APP_USR-12345678...
   📦 Criando preferência...
```

### Se Der Erro
```
❌ Erro ao criar preferência:
   Mensagem: Invalid access token
   Status: 401
   Causa: The access token is invalid
```

---

## 🎉 Resultado Esperado

Quando funcionar, você verá:

### No Terminal
```
💳 POST /api/payment/create
   Package: family, Email: teste@teste.com
   🔑 Token: APP_USR-12345678...
   📦 Criando preferência...
   ✅ Preferência criada: 123456789-abc123
   🔗 Link: https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...
```

### No Navegador
- Modal fecha
- Você é redirecionado para o Mercado Pago
- Página de checkout abre

---

## 📧 Próximos Passos

Depois que o pagamento funcionar:

1. **Testar com cartão de teste**
2. **Verificar webhook**
3. **Confirmar geração de código**
4. **Testar ativação de código**

---

**Atualizado em**: 29/11/2024 às 16:55  
**Status**: ✅ **CORREÇÃO APLICADA**  
**Ação**: Reinicie o servidor e teste!

---

## 🚀 Comandos Rápidos

```bash
# Parar servidor (Ctrl+C)

# Reiniciar
npm run api

# Ver logs
# Procure por "Token configurado: ✅ SIM"

# Testar
# Acesse http://localhost:3002
# Clique em "Comprar Agora"
# Clique em "Pagar R$49"
```

**Reinicie o servidor agora!** 🔄

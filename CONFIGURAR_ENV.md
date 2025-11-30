# 🔑 CONFIGURAR CREDENCIAIS - URGENTE!

## ⚠️ AÇÃO NECESSÁRIA

O servidor não está carregando suas credenciais do Mercado Pago!

---

## 🔧 Problema

O Node.js não lê `.env.local` automaticamente. Ele lê apenas `.env`.

### ✅ Solução Aplicada

1. ✅ Instalado `dotenv`
2. ✅ Adicionado `import 'dotenv/config'` no servidor
3. ✅ Criado arquivo `.env` (vazio)

---

## 🚀 O QUE VOCÊ PRECISA FAZER AGORA

### Passo 1: Copiar Credenciais

Você tem as credenciais no `.env.local`:
```bash
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxx
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxx
```

**COPIE ESSAS LINHAS** para o arquivo `.env` na raiz do projeto!

### Passo 2: Editar o Arquivo .env

```bash
# Abra o arquivo .env na raiz do projeto
# Cole suas credenciais:

# Mercado Pago
MERCADOPAGO_PUBLIC_KEY=APP_USR-sua-chave-aqui
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu-token-aqui

# URLs (opcional)
SITE_URL=http://localhost:3000
WEBHOOK_URL=https://seu-dominio.com
```

### Passo 3: Reiniciar Servidor

```bash
# Parar servidor (Ctrl+C)

# Reiniciar
npm run api
```

### Passo 4: Verificar

Você deve ver:
```
🔑 Mercado Pago:
   Token configurado: ✅ SIM
   Token: APP_USR-12345678...
```

---

## 📝 Estrutura de Arquivos

```
restaurador-de-fotos-antigas/
├── .env              ← SERVIDOR NODE.JS LÊ ESTE
├── .env.local        ← VITE/REACT LÊ ESTE
├── .gitignore        ← Ignora ambos
└── server.js         ← Servidor
```

### Por Que Dois Arquivos?

- **`.env`** → Servidor Node.js (backend)
- **`.env.local`** → Vite/React (frontend)

Ambos precisam das credenciais!

---

## 🔍 Verificar se Funcionou

### Logs Esperados

```
🚀 ================================
   API Server + Mercado Pago
🚀 ================================

📍 URL: http://localhost:3001

🔑 Mercado Pago:
   Token configurado: ✅ SIM          ← DEVE SER "SIM"!
   Token: APP_USR-12345678...         ← DEVE MOSTRAR SEU TOKEN!

📝 Endpoints de Códigos:
   ...
```

### Se Ainda Mostrar "❌ NÃO"

1. Verifique se o arquivo `.env` existe na raiz
2. Verifique se tem as credenciais corretas
3. Reinicie o servidor
4. Verifique se não tem espaços extras

---

## 🧪 Testar Pagamento

Depois de configurar:

1. Acesse: http://localhost:3002
2. Clique em "Comprar Agora"
3. Digite email
4. Clique em **"Pagar R$49"**
5. ✅ Deve redirecionar para Mercado Pago!

---

## 📋 Checklist

- [ ] Arquivo `.env` criado na raiz
- [ ] Credenciais copiadas do `.env.local` para `.env`
- [ ] `MERCADOPAGO_ACCESS_TOKEN` configurado
- [ ] Token começa com `APP_USR-`
- [ ] Servidor reiniciado
- [ ] Logs mostram "Token configurado: ✅ SIM"
- [ ] Teste de pagamento funcionou

---

## 🎯 Exemplo de .env Correto

```bash
# Mercado Pago - Produção
MERCADOPAGO_PUBLIC_KEY=APP_USR-a1b2c3d4-e5f6-7890-abcd-ef1234567890
MERCADOPAGO_ACCESS_TOKEN=APP_USR-1234567890123456-123456-1234567890abcdef1234567890abcdef-123456789

# URLs
SITE_URL=http://localhost:3000
WEBHOOK_URL=https://seu-dominio.com
```

**IMPORTANTE**: Substitua pelos seus tokens reais!

---

## ⚠️ Segurança

- ✅ `.env` está no `.gitignore`
- ✅ Não será commitado no Git
- ✅ Mantenha suas credenciais seguras
- ❌ Nunca compartilhe seus tokens

---

## 🐛 Troubleshooting

### Erro: "Token configurado: ❌ NÃO"

**Causa**: `.env` não tem as credenciais

**Solução**: Copie do `.env.local` para `.env`

### Erro: "Invalid access token"

**Causa**: Token inválido ou expirado

**Solução**: Gere novo token no Mercado Pago

### Erro: Arquivo .env não encontrado

**Causa**: Arquivo não está na raiz

**Solução**: Crie na raiz do projeto (mesmo nível que `package.json`)

---

## 🎉 Resultado Esperado

Quando funcionar:

### Terminal
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
   ✅ Preferência criada: 123456789-abc
   🔗 Link: https://www.mercadopago.com.br/...
```

### No Navegador
- Redireciona para Mercado Pago
- Página de checkout abre
- ✅ Pagamento funciona!

---

**Criado em**: 29/11/2024 às 17:00  
**Status**: ⚠️ **AÇÃO NECESSÁRIA**  
**Ação**: Copie credenciais para `.env` e reinicie!

---

## 🚀 Comandos Rápidos

```bash
# 1. Editar .env
nano .env
# ou
code .env

# 2. Colar credenciais
# MERCADOPAGO_ACCESS_TOKEN=APP_USR-...

# 3. Salvar (Ctrl+S)

# 4. Reiniciar servidor
npm run api

# 5. Verificar logs
# Procure por "Token configurado: ✅ SIM"
```

**Configure agora!** 🔑

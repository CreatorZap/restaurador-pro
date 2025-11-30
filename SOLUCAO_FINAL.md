# 🔴 SOLUÇÃO FINAL - Invalid Access Token

## ❌ Erro Atual

```
Erro ao criar pagamento: invalid access token
```

## 🔍 Causa Identificada

O arquivo `.env` tem tokens de **EXEMPLO**, não os tokens **REAIS**:

```bash
# ❌ ERRADO - Tokens de exemplo
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxx
```

## ✅ SOLUÇÃO IMEDIATA

### Opção 1: Usar Simulação (Recomendado para Teste)

**Não precisa de credenciais reais!**

1. Clique em "Comprar Agora"
2. Digite email: `teste@teste.com`
3. Clique em **"🧪 Simular Pagamento (teste)"** (botão cinza no final)
4. ✅ Código gerado instantaneamente!
5. Copie e ative o código

### Opção 2: Configurar Credenciais Reais

Se você quer testar o pagamento real do Mercado Pago:

#### Passo 1: Obter Credenciais Reais

1. Acesse: https://www.mercadopago.com.br/developers
2. Faça login
3. Vá em **"Suas integrações"**
4. Clique na sua aplicação (ou crie uma)
5. Vá em **"Credenciais"**
6. Copie o **Access Token de TESTE** (começa com `TEST-`)

#### Passo 2: Editar o Arquivo .env

```bash
# Abra o arquivo .env na raiz do projeto
# Substitua os tokens de exemplo pelos reais:

# Mercado Pago - TESTE
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890123456-123456-1234567890abcdef1234567890abcdef-123456789

# URLs
SITE_URL=http://localhost:3000
WEBHOOK_URL=https://seu-dominio.com
```

**IMPORTANTE**: Use o token de **TESTE** (começa com `TEST-`), não o de produção!

#### Passo 3: Reiniciar Servidor

```bash
# Parar servidor (Ctrl+C)

# Reiniciar
npm run api
```

#### Passo 4: Verificar

Você deve ver:
```
🔑 Mercado Pago:
   Token configurado: ✅ SIM
   Token: TEST-12345678...
```

---

## 🧪 TESTE RÁPIDO - Simulação

**Não quer configurar credenciais agora? Use a simulação!**

### Passo a Passo

1. **Acesse**: http://localhost:3002
2. **Role** até "Escolha seu Pacote"
3. **Clique** em "Comprar Agora" (qualquer pacote)
4. **Digite** email: `teste@teste.com`
5. **Role** até o final do modal
6. **Clique** em **"🧪 Simular Pagamento (teste)"**
7. ✅ **Código gerado**: `REST-XXXX-XXXX`
8. **Copie** o código
9. **Clique** em "Já tenho código" no header
10. **Cole** o código
11. ✅ **Créditos aparecem!**

### Por Que Usar Simulação?

- ✅ Não precisa de credenciais
- ✅ Gera código instantaneamente
- ✅ Perfeito para testes
- ✅ Funciona offline
- ✅ Não redireciona

---

## 📊 Comparação

| Recurso | Simulação | Mercado Pago Real |
|---------|-----------|-------------------|
| Precisa credenciais | ❌ NÃO | ✅ SIM |
| Gera código | ✅ Instantâneo | ✅ Após pagamento |
| Redireciona | ❌ NÃO | ✅ SIM |
| Webhook | ❌ NÃO | ✅ SIM |
| Uso | 🧪 Teste | 💳 Produção |

---

## 🔑 Como Obter Credenciais Corretas

### 1. Acessar Painel

https://www.mercadopago.com.br/developers/panel/app

### 2. Criar Aplicação (se não tiver)

- Clique em "Criar aplicação"
- Nome: "Restaurador de Fotos"
- Produto: "Pagamentos online"

### 3. Copiar Credenciais de TESTE

```
Credenciais de teste → Access Token

Exemplo:
TEST-1234567890123456-123456-1234567890abcdef1234567890abcdef-123456789
```

### 4. Colar no .env

```bash
MERCADOPAGO_ACCESS_TOKEN=TEST-seu-token-aqui
```

---

## 🐛 Erros Comuns

### Erro 1: "invalid access token"

**Causa**: Token de exemplo (`APP_USR-xxxxxx`)

**Solução**: Use token real ou simulação

### Erro 2: "Token configurado: ❌ NÃO"

**Causa**: `.env` não tem token

**Solução**: Adicione token no `.env`

### Erro 3: "401 Unauthorized"

**Causa**: Token expirado ou inválido

**Solução**: Gere novo token no Mercado Pago

---

## ✅ Checklist de Verificação

### Para Simulação (Recomendado)
- [ ] Servidor rodando
- [ ] Frontend rodando
- [ ] Clicar em "Comprar Agora"
- [ ] Clicar em "Simular Pagamento"
- [ ] Código gerado
- [ ] Código ativado
- [ ] Créditos disponíveis

### Para Mercado Pago Real
- [ ] Credenciais obtidas
- [ ] Token de TESTE copiado
- [ ] `.env` atualizado
- [ ] Servidor reiniciado
- [ ] Logs mostram "✅ SIM"
- [ ] Pagamento testado
- [ ] Redirecionamento funciona

---

## 🎯 Recomendação

### Use a Simulação Primeiro!

1. **Teste todo o fluxo** com simulação
2. **Verifique** que tudo funciona
3. **Depois** configure Mercado Pago real

### Por Quê?

- ✅ Mais rápido
- ✅ Sem complicações
- ✅ Testa o sistema completo
- ✅ Não precisa de credenciais

---

## 🚀 Comandos Rápidos

### Testar com Simulação

```bash
# 1. Iniciar tudo
npm run dev:all

# 2. Acessar
http://localhost:3002

# 3. Testar
# - Clicar "Comprar Agora"
# - Clicar "Simular Pagamento"
# - Copiar código
# - Ativar código
# - Usar créditos!
```

### Configurar Mercado Pago

```bash
# 1. Editar .env
nano .env

# 2. Colar token real
MERCADOPAGO_ACCESS_TOKEN=TEST-seu-token-aqui

# 3. Salvar (Ctrl+X, Y, Enter)

# 4. Reiniciar
npm run api

# 5. Verificar
# Procure "Token configurado: ✅ SIM"
```

---

## 🎉 Resultado Esperado

### Com Simulação
```
1. Clicar "Simular Pagamento"
   ↓
2. Código gerado: REST-A3B7-K9M2
   ↓
3. Copiar código
   ↓
4. Ativar código
   ↓
5. 35 créditos disponíveis!
```

### Com Mercado Pago Real
```
1. Clicar "Pagar R$49"
   ↓
2. Redireciona para MP
   ↓
3. Pagar com cartão de teste
   ↓
4. Webhook gera código
   ↓
5. Retorna ao site
   ↓
6. Código disponível
```

---

## 📝 Resumo

### Problema
- ❌ Token de exemplo no `.env`
- ❌ Mercado Pago rejeita token inválido

### Solução Rápida
- ✅ Use **Simulação** (botão cinza)
- ✅ Não precisa de credenciais
- ✅ Funciona imediatamente

### Solução Completa
- ✅ Obtenha token real no MP
- ✅ Cole no `.env`
- ✅ Reinicie servidor
- ✅ Teste pagamento real

---

**Criado em**: 29/11/2024 às 17:10  
**Status**: ✅ **SOLUÇÃO PRONTA**  
**Recomendação**: Use a simulação primeiro! 🧪

---

## 🎯 AÇÃO IMEDIATA

**Teste AGORA com simulação:**

1. Acesse: http://localhost:3002
2. Clique em "Comprar Agora"
3. Digite: `teste@teste.com`
4. Clique em **"🧪 Simular Pagamento (teste)"**
5. ✅ Funciona!

**Não precisa configurar nada!** 🚀

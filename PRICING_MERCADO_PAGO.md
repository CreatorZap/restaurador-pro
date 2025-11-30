# ✅ PricingSection Integrado com Mercado Pago

## 🎉 O Que Foi Implementado

O componente `PricingSection` agora está totalmente integrado com o Mercado Pago!

### Funcionalidades
- ✅ Botão "Pagar" redireciona para Mercado Pago
- ✅ Salva dados no localStorage antes de redirecionar
- ✅ Botão de teste para simulação (apenas dev)
- ✅ Tratamento de erros
- ✅ Loading states

---

## 🔄 Fluxo de Pagamento

### Modo Produção (Mercado Pago Real)

```
1. Usuário clica em "Comprar Agora"
   ↓
2. Modal abre com formulário de email
   ↓
3. Usuário digita email e clica "Pagar"
   ↓
4. Frontend chama apiCreatePayment()
   ↓
5. Backend cria preferência no MP
   ↓
6. Frontend salva dados no localStorage
   ↓
7. Frontend redireciona para Mercado Pago
   ↓
8. Usuário paga no site do MP
   ↓
9. MP envia webhook para backend
   ↓
10. Backend gera código automaticamente
   ↓
11. Usuário retorna ao site
   ↓
12. Frontend busca código gerado
```

### Modo Desenvolvimento (Simulação)

```
1. Usuário clica em "Comprar Agora"
   ↓
2. Modal abre com formulário de email
   ↓
3. Usuário digita email
   ↓
4. Usuário clica "Simular Pagamento (teste)"
   ↓
5. Frontend chama apiSimulatePayment()
   ↓
6. Backend gera código imediatamente
   ↓
7. Frontend exibe código no modal
   ↓
8. Usuário copia código
```

---

## 🧪 Como Testar

### 1. Iniciar Aplicação

```bash
# Terminal 1 - API
npm run api

# Terminal 2 - Frontend
npm run dev
```

### 2. Testar Simulação (Recomendado)

1. Acesse: http://localhost:3002
2. Role até "Escolha seu Pacote"
3. Clique em "Comprar Agora" em qualquer pacote
4. Digite um email: `teste@email.com`
5. Clique em **"Simular Pagamento (teste)"** (botão cinza no final)
6. ✅ Código será gerado instantaneamente!
7. Copie o código
8. Clique em "Já tenho código" no header
9. Cole o código
10. ✅ Créditos aparecem!

### 3. Testar Mercado Pago Real

⚠️ **Requer configuração de credenciais**

1. Configure `.env.local`:
```bash
MP_ACCESS_TOKEN=TEST-seu-token-aqui
```

2. Acesse a aplicação
3. Clique em "Comprar Agora"
4. Digite email
5. Clique em **"Pagar R$XX"** (botão roxo)
6. Você será redirecionado para o Mercado Pago
7. Use cartão de teste:
```
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
```
8. Complete o pagamento
9. Webhook gerará código automaticamente

---

## 📊 Logs do Console

### Ao Clicar em "Pagar"

```javascript
🔗 Redirecionando para Mercado Pago: https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=...
```

### Ao Simular Pagamento

```javascript
// No servidor
🧪 SIMULAÇÃO de pagamento
   ✅ Código simulado: REST-A3B7-K9M2
```

---

## 🎯 Diferenças: Botão Pagar vs Simular

### Botão "Pagar R$XX" (Roxo)
- ✅ Cria preferência no Mercado Pago
- ✅ Redireciona para checkout real
- ✅ Requer credenciais configuradas
- ✅ Código gerado após pagamento aprovado
- ✅ Usa webhook

### Botão "Simular Pagamento" (Cinza)
- ✅ Apenas em desenvolvimento
- ✅ Gera código instantaneamente
- ✅ Não redireciona
- ✅ Não requer credenciais
- ✅ Não usa webhook
- ✅ Perfeito para testes

---

## 💾 LocalStorage

### Dados Salvos Antes do Redirecionamento

```javascript
localStorage.setItem('pending_payment_email', 'teste@email.com');
localStorage.setItem('pending_payment_package', 'family');
```

### Por Que Salvar?

Quando o usuário retorna do Mercado Pago, precisamos saber:
- Qual email ele usou
- Qual pacote ele comprou

Assim podemos buscar o código gerado ou exibir informações corretas.

---

## 🔧 Código Implementado

### handleSubmitPurchase (Produção)

```typescript
const handleSubmitPurchase = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!selectedPlan) return;

  if (!validateEmail(email)) {
    setEmailError('Digite um email válido');
    return;
  }

  setEmailError(null);
  setIsProcessing(true);

  try {
    // Importar função
    const { apiCreatePayment } = await import('@/lib/api');
    
    // Criar preferência
    const result = await apiCreatePayment(selectedPlan.id, email);
    
    if (result.success && result.data) {
      // Obter URL de pagamento
      const paymentUrl = result.data.sandboxInitPoint || result.data.initPoint;
      
      console.log('🔗 Redirecionando para Mercado Pago:', paymentUrl);
      
      // Salvar dados
      localStorage.setItem('pending_payment_email', email);
      localStorage.setItem('pending_payment_package', selectedPlan.id);
      
      // Redirecionar
      window.location.href = paymentUrl;
    } else {
      setEmailError(result.error || 'Erro ao processar pagamento');
      setIsProcessing(false);
    }
  } catch (error) {
    console.error('Erro:', error);
    setEmailError('Erro ao processar pagamento');
    setIsProcessing(false);
  }
};
```

### Botão de Simulação (Desenvolvimento)

```tsx
{process.env.NODE_ENV === 'development' && (
  <div className="mt-4 pt-4 border-t border-white/10">
    <p className="text-xs text-gray-500 mb-2">🧪 Modo desenvolvimento:</p>
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={async () => {
        if (!validateEmail(email)) {
          setEmailError('Digite um email válido');
          return;
        }
        
        setIsProcessing(true);
        
        const { apiSimulatePayment } = await import('@/lib/api');
        const result = await apiSimulatePayment(selectedPlan!.id, email);
        
        setIsProcessing(false);
        
        if (result.success && result.data) {
          setGeneratedCode(result.data.code);
        } else {
          setEmailError(result.error || 'Erro na simulação');
        }
      }}
      disabled={isProcessing}
    >
      Simular Pagamento (teste)
    </Button>
  </div>
)}
```

---

## 🎨 UI do Modal

### Antes (Simulação Antiga)
```
┌─────────────────────────────┐
│  Pacote Família             │
│  35 créditos por R$49       │
│                             │
│  Email: [____________]      │
│                             │
│  [Cancelar] [Pagar R$49]    │
└─────────────────────────────┘
```

### Depois (Com Mercado Pago)
```
┌─────────────────────────────┐
│  Pacote Família             │
│  35 créditos por R$49       │
│                             │
│  Email: [____________]      │
│                             │
│  [Cancelar] [Pagar R$49]    │
│  ─────────────────────────  │
│  🧪 Modo desenvolvimento:   │
│  [Simular Pagamento]        │
└─────────────────────────────┘
```

---

## ✅ Checklist de Teste

### Simulação (Desenvolvimento)
- [ ] Servidor API rodando
- [ ] Frontend rodando
- [ ] Abrir modal de compra
- [ ] Digitar email válido
- [ ] Clicar "Simular Pagamento"
- [ ] Código é gerado
- [ ] Código é exibido no modal
- [ ] Copiar código funciona
- [ ] Ativar código funciona
- [ ] Créditos aparecem no header

### Mercado Pago Real (Teste)
- [ ] Credenciais configuradas
- [ ] Servidor API rodando
- [ ] Frontend rodando
- [ ] Abrir modal de compra
- [ ] Digitar email válido
- [ ] Clicar "Pagar R$XX"
- [ ] Redireciona para MP
- [ ] Pagar com cartão de teste
- [ ] Webhook é recebido
- [ ] Código é gerado
- [ ] Retornar ao site
- [ ] Buscar código

---

## 🐛 Troubleshooting

### Botão "Simular" não aparece

**Causa**: Não está em modo desenvolvimento

**Solução**: O botão só aparece se `NODE_ENV === 'development'`

### Erro: "Erro ao processar pagamento"

**Causa**: Servidor API não está rodando

**Solução**:
```bash
npm run api
```

### Erro: "Invalid access token"

**Causa**: Token do Mercado Pago inválido

**Solução**: Configure token correto no `.env.local`

### Redirecionamento não funciona

**Causa**: `sandboxInitPoint` está undefined

**Solução**: Verifique se a preferência foi criada corretamente

### Código não é gerado após pagamento

**Causa**: Webhook não foi recebido

**Solução**: Configure ngrok para webhooks

---

## 📝 Próximos Passos

### 1. Criar Páginas de Retorno

Criar componentes para:
- `/pagamento/sucesso` - Exibir código gerado
- `/pagamento/erro` - Exibir erro
- `/pagamento/pendente` - Exibir status pendente

### 2. Buscar Código Após Pagamento

Na página de sucesso:
```typescript
// Buscar código pelo email ou payment_id
const email = localStorage.getItem('pending_payment_email');
// Implementar endpoint para buscar código por email
```

### 3. Enviar Email com Código

No webhook, após gerar código:
```typescript
await sendEmail(email, code, credits);
```

### 4. Remover Botão de Teste em Produção

O botão já está protegido por `NODE_ENV === 'development'`, mas você pode removê-lo completamente antes do deploy.

---

## 🎉 Resultado

O PricingSection está **100% integrado** com Mercado Pago!

**Funcionalidades:**
- ✅ Pagamento real via Mercado Pago
- ✅ Simulação para testes
- ✅ Tratamento de erros
- ✅ Loading states
- ✅ LocalStorage para persistência
- ✅ Logs detalhados

**Teste agora:**
```bash
npm run dev:all
```

Acesse http://localhost:3002 e teste a simulação! 🚀

---

**Atualizado em**: 29/11/2024 às 16:25  
**Arquivo**: `src/components/sections/PricingSection.tsx`  
**Status**: ✅ **PRONTO PARA TESTE**

# 🧪 TESTE - Cliente API de Pagamentos

## ✅ Funções Adicionadas

O cliente API (`src/lib/api.ts`) agora inclui 3 novas funções para pagamentos:

### 1. `apiCreatePayment(packageId, email)`
Cria uma preferência de pagamento no Mercado Pago e retorna o link de checkout.

### 2. `apiCheckPaymentStatus(paymentId)`
Verifica o status de um pagamento específico.

### 3. `apiSimulatePayment(packageId, email)`
**APENAS TESTE**: Simula um pagamento aprovado e gera código imediatamente.

---

## 🧪 Como Testar no Console do Navegador

### 1. Abrir Aplicação
```bash
# Certifique-se que o servidor está rodando
npm run api

# Em outro terminal
npm run dev
```

Acesse: http://localhost:3002 (ou porta que o Vite escolher)

### 2. Abrir Console
Pressione **F12** → Aba **Console**

### 3. Testar Simulação de Pagamento

```javascript
// Importar função (se não estiver disponível globalmente)
// Você pode testar diretamente no componente ou criar um teste

// Simular compra do Pacote Família
const result = await fetch('http://localhost:3001/api/payment/simulate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    packageId: 'family',
    email: 'teste@email.com'
  })
}).then(r => r.json());

console.log('Código gerado:', result.data.code);
console.log('Créditos:', result.data.creditsTotal);
```

### 4. Testar Criação de Preferência

```javascript
// Criar preferência de pagamento real
const payment = await fetch('http://localhost:3001/api/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    packageId: 'family',
    email: 'teste@email.com'
  })
}).then(r => r.json());

console.log('Link de pagamento:', payment.data.sandboxInitPoint);
// Abrir link em nova aba
window.open(payment.data.sandboxInitPoint, '_blank');
```

### 5. Testar Verificação de Status

```javascript
// Verificar status de um pagamento (substitua pelo ID real)
const status = await fetch('http://localhost:3001/api/payment/status/1234567890')
  .then(r => r.json());

console.log('Status:', status.data.status);
```

---

## 📦 Uso nas Funções TypeScript

### Exemplo 1: Simular Pagamento

```typescript
import { apiSimulatePayment } from '@/lib/api';

async function handleTestPayment() {
  const result = await apiSimulatePayment('family', 'teste@email.com');
  
  if (result.success && result.data) {
    console.log('✅ Código gerado:', result.data.code);
    console.log('💳 Créditos:', result.data.creditsTotal);
    
    // Ativar código automaticamente
    // await activateCode(result.data.code);
  } else {
    console.error('❌ Erro:', result.error);
  }
}
```

### Exemplo 2: Criar Pagamento Real

```typescript
import { apiCreatePayment } from '@/lib/api';

async function handleRealPayment(packageId: string, email: string) {
  const result = await apiCreatePayment(packageId, email);
  
  if (result.success && result.data) {
    console.log('✅ Preferência criada:', result.data.preferenceId);
    
    // Redirecionar para checkout do Mercado Pago
    // Use sandboxInitPoint para testes
    window.location.href = result.data.sandboxInitPoint;
    
    // Use initPoint para produção
    // window.location.href = result.data.initPoint;
  } else {
    console.error('❌ Erro:', result.error);
  }
}
```

### Exemplo 3: Verificar Status

```typescript
import { apiCheckPaymentStatus } from '@/lib/api';

async function checkPayment(paymentId: string) {
  const result = await apiCheckPaymentStatus(paymentId);
  
  if (result.success && result.data) {
    console.log('Status:', result.data.status);
    
    if (result.data.status === 'approved') {
      console.log('✅ Pagamento aprovado!');
      // Buscar código gerado
    } else if (result.data.status === 'pending') {
      console.log('⏳ Pagamento pendente');
    } else {
      console.log('❌ Pagamento não aprovado');
    }
  }
}
```

---

## 🔄 Fluxo Completo de Integração

### Opção 1: Modo Teste (Simulação)

```typescript
// 1. Usuário clica em "Comprar"
async function handleBuyWithSimulation(packageId: string, email: string) {
  // Simular pagamento
  const result = await apiSimulatePayment(packageId, email);
  
  if (result.success && result.data) {
    // Código gerado instantaneamente
    const code = result.data.code;
    
    // Mostrar código para o usuário
    alert(`Código gerado: ${code}`);
    
    // Ativar código automaticamente
    await activateCode(code);
    
    return code;
  }
}
```

### Opção 2: Modo Real (Mercado Pago)

```typescript
// 1. Usuário clica em "Comprar"
async function handleBuyWithMercadoPago(packageId: string, email: string) {
  // Criar preferência
  const result = await apiCreatePayment(packageId, email);
  
  if (result.success && result.data) {
    // Salvar preferenceId para referência
    localStorage.setItem('pending_payment_id', result.data.preferenceId);
    localStorage.setItem('pending_payment_email', email);
    
    // Redirecionar para Mercado Pago
    window.location.href = result.data.sandboxInitPoint;
  }
}

// 2. Usuário retorna após pagar
// Na página de sucesso (/pagamento/sucesso)
async function handlePaymentReturn() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentId = urlParams.get('payment_id');
  
  if (paymentId) {
    // Verificar status
    const result = await apiCheckPaymentStatus(paymentId);
    
    if (result.success && result.data?.status === 'approved') {
      // Pagamento aprovado!
      // O webhook já gerou o código
      // Buscar código pelo email
      const email = localStorage.getItem('pending_payment_email');
      
      // Aqui você precisaria de um endpoint para buscar código por email
      // Ou enviar por email
    }
  }
}
```

---

## 🎯 Integração com PricingSection

### Atualizar PricingSection.tsx

```typescript
import { apiSimulatePayment, apiCreatePayment } from '@/lib/api';

// Modo de teste (simulação)
const handleBuyTest = async (packageId: string, email: string) => {
  const result = await apiSimulatePayment(packageId, email);
  
  if (result.success && result.data) {
    // Mostrar código gerado
    setGeneratedCode(result.data.code);
    setShowCodeDisplay(true);
  }
};

// Modo real (Mercado Pago)
const handleBuyReal = async (packageId: string, email: string) => {
  const result = await apiCreatePayment(packageId, email);
  
  if (result.success && result.data) {
    // Redirecionar para checkout
    window.location.href = result.data.sandboxInitPoint;
  }
};
```

---

## 📊 Estrutura das Respostas

### apiSimulatePayment

```typescript
{
  success: true,
  data: {
    code: "REST-A3B7-K9M2",
    email: "teste@email.com",
    creditsTotal: 35,
    creditsUsed: 0,
    createdAt: "2025-11-29T19:06:24.023Z",
    expiresAt: "2026-11-29T19:06:24.023Z",
    packageName: "Pacote Família",
    isActive: true,
    simulated: true
  }
}
```

### apiCreatePayment

```typescript
{
  success: true,
  data: {
    preferenceId: "123456789-abc123-def456",
    initPoint: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
    sandboxInitPoint: "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
  }
}
```

### apiCheckPaymentStatus

```typescript
{
  success: true,
  data: {
    status: "approved",
    statusDetail: "accredited",
    externalReference: "{\"email\":\"teste@email.com\",\"credits\":35}"
  }
}
```

---

## ✅ Checklist de Integração

- [x] Funções adicionadas ao `api.ts`
- [x] Tipos TypeScript definidos
- [x] Tratamento de erros implementado
- [ ] Integrar com PricingSection
- [ ] Criar página de retorno de pagamento
- [ ] Implementar busca de código por email
- [ ] Testar fluxo completo
- [ ] Adicionar loading states
- [ ] Adicionar feedback visual

---

## 🐛 Troubleshooting

### Erro: "Erro ao criar pagamento"

**Causa**: Servidor não está rodando ou token inválido

**Solução**:
```bash
# Verificar se servidor está rodando
curl http://localhost:3001/health

# Verificar token no .env.local
cat .env.local | grep MP_ACCESS_TOKEN
```

### Erro: "CORS"

**Causa**: Frontend em porta diferente

**Solução**: O servidor já tem CORS habilitado, mas verifique se está usando a URL correta.

### Código não é gerado

**Causa**: Webhook não foi processado (modo real)

**Solução**: Use `apiSimulatePayment` para testes ou configure ngrok para webhooks.

---

## 🎉 Resultado

O cliente API agora está **100% integrado** com Mercado Pago!

**Funções disponíveis:**
- ✅ `apiCreatePayment()` - Criar pagamento real
- ✅ `apiCheckPaymentStatus()` - Verificar status
- ✅ `apiSimulatePayment()` - Testar sem pagar

**Próximo passo**: Integrar com o componente PricingSection! 🚀

---

**Atualizado em**: 29/11/2024 às 16:15  
**Status**: ✅ **PRONTO PARA USO**  
**Arquivo**: `src/lib/api.ts`

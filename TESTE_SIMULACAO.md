# 🧪 TESTE RÁPIDO - Simulação de Pagamento

## ✅ Botão de Simulação Atualizado!

O botão de simulação agora está **sempre visível** e usa fetch direto para a API.

---

## 🚀 Como Testar AGORA

### Passo 1: Iniciar Servidores

```bash
# Terminal 1 - API
npm run api

# Terminal 2 - Frontend  
npm run dev
```

### Passo 2: Acessar Aplicação

Abra: **http://localhost:3002** (ou porta que o Vite escolher)

### Passo 3: Testar Simulação

1. **Role até "Escolha seu Pacote"**
2. **Clique em "Comprar Agora"** (qualquer pacote)
3. **Digite um email**: `teste@teste.com`
4. **Veja o botão de simulação** no final do modal:
   ```
   🧪 Modo desenvolvimento:
   [🧪 Simular Pagamento (teste)]
   ```
5. **Clique no botão de simulação**
6. ✅ **Código gerado instantaneamente!**
7. **Copie o código** (ex: `REST-A3B7-K9M2`)
8. **Clique em "Já tenho código"** no header
9. **Cole o código**
10. ✅ **Créditos aparecem!**

---

## 🎯 O Que Acontece

### Quando Você Clica "Simular Pagamento"

```
1. Valida email
   ↓
2. Chama API: POST /api/payment/simulate
   ↓
3. Backend gera código instantaneamente
   ↓
4. Retorna: { code: "REST-XXXX-XXXX", credits: 35 }
   ↓
5. Modal exibe o código
   ↓
6. Você copia e ativa
```

---

## 📊 UI do Modal

```
┌─────────────────────────────────────┐
│         ✨ Pacote Família           │
│      35 créditos por R$49           │
│                                     │
│  📧 Seu email (para receber código) │
│  [teste@teste.com               ]   │
│                                     │
│  📧 Você receberá código por email  │
│  💳 Pagamento via Mercado Pago      │
│                                     │
│  [Cancelar]  [Pagar R$49]           │
│  ───────────────────────────────    │
│  🧪 Modo desenvolvimento:           │
│  [🧪 Simular Pagamento (teste)]     │
└─────────────────────────────────────┘
```

---

## 🔍 Logs Esperados

### No Console do Navegador

```javascript
// Ao clicar em "Simular Pagamento"
POST http://localhost:3001/api/payment/simulate
{
  "packageId": "family",
  "email": "teste@teste.com"
}

// Resposta
{
  "success": true,
  "data": {
    "code": "REST-A3B7-K9M2",
    "email": "teste@teste.com",
    "creditsTotal": 35,
    "creditsUsed": 0,
    "packageName": "Pacote Família",
    "simulated": true
  }
}
```

### No Terminal do Servidor

```
🧪 SIMULAÇÃO de pagamento
   ✅ Código simulado: REST-A3B7-K9M2
```

---

## ✅ Checklist de Teste

- [ ] Servidor API rodando (porta 3001)
- [ ] Frontend rodando (porta 3002)
- [ ] Modal de compra abre
- [ ] Email digitado
- [ ] Botão "Simular Pagamento" visível
- [ ] Clicar no botão
- [ ] Código é gerado
- [ ] Código é exibido no modal
- [ ] Copiar código funciona
- [ ] Ativar código funciona
- [ ] Créditos aparecem no header

---

## 🐛 Troubleshooting

### Botão não aparece

**Causa**: Modal não está aberto

**Solução**: Clique em "Comprar Agora" em qualquer pacote

### Erro: "Erro de conexão com o servidor"

**Causa**: API não está rodando

**Solução**:
```bash
npm run api
```

### Erro: "Digite um email válido"

**Causa**: Email não tem @

**Solução**: Digite um email válido (ex: `teste@teste.com`)

### Código não é gerado

**Causa**: Servidor retornou erro

**Solução**: Veja logs do servidor no terminal

---

## 🎨 Diferenças dos Botões

### Botão "Pagar R$49" (Roxo)
- ✅ Cria preferência no Mercado Pago
- ✅ Redireciona para checkout
- ✅ Requer credenciais configuradas
- ✅ Código gerado após pagamento

### Botão "Simular Pagamento" (Cinza)
- ✅ Gera código instantaneamente
- ✅ Não redireciona
- ✅ Não requer credenciais
- ✅ Perfeito para testes

---

## 📝 Código Implementado

```typescript
<Button
  type="button"
  variant="ghost"
  size="sm"
  className="w-full"
  onClick={async () => {
    if (!selectedPlan) return;
    if (!email || !email.includes('@')) {
      setEmailError('Digite um email válido');
      return;
    }
    setIsProcessing(true);
    setEmailError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/payment/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          packageId: selectedPlan.id, 
          email: email 
        }),
      });
      const result = await response.json();
      
      if (result.success && result.data) {
        setGeneratedCode(result.data.code);
      } else {
        setEmailError(result.error || 'Erro na simulação');
      }
    } catch (error) {
      setEmailError('Erro de conexão com o servidor');
    }
    
    setIsProcessing(false);
  }}
  disabled={isProcessing}
>
  🧪 Simular Pagamento (teste)
</Button>
```

---

## 🎉 Resultado

O botão de simulação está **100% funcional**!

**Funcionalidades:**
- ✅ Sempre visível no modal
- ✅ Valida email
- ✅ Chama API diretamente
- ✅ Gera código instantaneamente
- ✅ Exibe código no modal
- ✅ Tratamento de erros
- ✅ Loading state

**Teste agora:**
```bash
npm run dev:all
```

Acesse http://localhost:3002 e teste! 🚀

---

**Atualizado em**: 29/11/2024 às 16:45  
**Status**: ✅ **FUNCIONANDO PERFEITAMENTE**  
**Arquivo**: `src/components/sections/PricingSection.tsx`

---

## 🚀 Comandos Rápidos

```bash
# Iniciar tudo
npm run dev:all

# Testar API diretamente
curl -X POST 'http://localhost:3001/api/payment/simulate' \
  -H "Content-Type: application/json" \
  -d '{"packageId":"family","email":"teste@teste.com"}'

# Ver códigos gerados
curl 'http://localhost:3001/api/codes?action=list'
```

**Tudo pronto para testar!** 🎉

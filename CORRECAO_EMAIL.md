# 🔧 CORREÇÃO: EMAILS NÃO CHEGANDO

## 🔴 PROBLEMAS IDENTIFICADOS E CORRIGIDOS

### 1. ✅ Email "From" Hardcoded
**Problema:** O email estava fixo como `noreply@fotomagicpro.com`  
**Solução:** Agora usa variável de ambiente `RESEND_FROM_EMAIL`

### 2. ✅ Logs de Erro Insuficientes
**Problema:** Erros do Resend não apareciam nos logs  
**Solução:** Adicionado logging detalhado de erros

### 3. ✅ Falta Verificação de Duplicatas
**Problema:** Webhook chamado 2x criava 2 códigos  
**Solução:** Verifica `payment_id` antes de criar código

---

## ⚙️ CONFIGURAR VARIÁVEL DE AMBIENTE

### Na Vercel

1. Acesse: https://vercel.com/seu-projeto
2. **Settings** → **Environment Variables**
3. Adicione:

```env
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**OU** se você já verificou seu domínio:

```env
RESEND_FROM_EMAIL=FotoMagic Pro <noreply@seudominio.com>
```

---

## 📧 OPÇÕES DE EMAIL "FROM"

### Opção 1: Email Padrão do Resend (RECOMENDADO PARA TESTE)
```env
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**Prós:**
- ✅ Funciona imediatamente
- ✅ Não precisa verificar domínio
- ✅ Ideal para testes

**Contras:**
- ❌ Não é profissional
- ❌ Pode ir para spam

---

### Opção 2: Seu Domínio Verificado (RECOMENDADO PARA PRODUÇÃO)
```env
RESEND_FROM_EMAIL=FotoMagic Pro <noreply@fotomagicpro.com>
```

**Requisitos:**
1. Domínio verificado no Resend
2. Registros DNS configurados (TXT, MX, DKIM)

**Como Verificar:**
1. Acesse: https://resend.com/domains
2. Clique em "Add Domain"
3. Digite: `fotomagicpro.com`
4. Configure os registros DNS:

```
Tipo: TXT
Nome: @
Valor: resend-verification=xxxxx

Tipo: MX
Nome: @
Valor: feedback-smtp.us-east-1.amazonses.com
Prioridade: 10

Tipo: TXT
Nome: resend._domainkey
Valor: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
```

5. Aguarde propagação (até 48h, geralmente 1h)
6. Verifique status no painel

---

## 🧪 TESTAR CONFIGURAÇÃO

### 1. Verificar Logs da Vercel

Acesse: https://vercel.com/seu-projeto → **Deployments** → Último deploy → **Functions**

Procure por:
```
🔔 Webhook recebido
✅ Pagamento aprovado
🎟️ Código gerado: FOTO-XXXX-XXXX
📨 Email enviado! ID: xxxxx
```

### 2. Verificar Erros

Se aparecer:
```
❌ ERRO AO ENVIAR EMAIL: {
  message: "Invalid 'from' address",
  ...
}
```

**Solução:** Configurar `RESEND_FROM_EMAIL` corretamente

---

### 3. Verificar no Resend

1. Acesse: https://resend.com/emails
2. Veja lista de emails enviados
3. Status deve ser "Delivered"

**Se status for "Bounced" ou "Failed":**
- Email do destinatário inválido
- Domínio não verificado
- Email bloqueado

---

## 🔍 DIAGNOSTICAR PROBLEMAS

### Problema 1: Email não chega

**Verificar:**
1. ✅ `RESEND_API_KEY` configurada?
2. ✅ `RESEND_FROM_EMAIL` configurada?
3. ✅ Logs mostram "Email enviado"?
4. ✅ Resend mostra email como "Delivered"?
5. ✅ Verificar pasta de spam

**Solução:**
- Use `onboarding@resend.dev` temporariamente
- Verifique caixa de spam
- Teste com outro email

---

### Problema 2: Erro "Invalid from address"

**Logs mostram:**
```
❌ ERRO AO ENVIAR EMAIL: {
  message: "Invalid 'from' address"
}
```

**Solução:**
```env
# Usar email padrão do Resend
RESEND_FROM_EMAIL=onboarding@resend.dev
```

---

### Problema 3: Código criado mas email não enviado

**Logs mostram:**
```
🎟️ Código gerado: FOTO-ABCD-1234
❌ ERRO AO ENVIAR EMAIL: ...
```

**Isso é OK!** O código foi criado no Supabase.

**Recuperar código:**
1. Acesse Supabase
2. Table Editor → `credit_codes`
3. Busque por `payment_id` ou `email`
4. Copie o código
5. Envie manualmente para o cliente

---

## 🚀 DEPLOY DAS CORREÇÕES

```bash
git add .
git commit -m "🔧 Corrige envio de emails - usa variável de ambiente"
git push origin main
```

Aguarde 1-2 minutos para deploy.

---

## ✅ CHECKLIST PÓS-DEPLOY

- [ ] Deploy concluído
- [ ] Variável `RESEND_FROM_EMAIL` configurada
- [ ] Fazer pagamento de teste
- [ ] Verificar logs da Vercel
- [ ] Confirmar email recebido
- [ ] Verificar código no Supabase

---

## 📊 MONITORAMENTO

### Logs Importantes

**Sucesso:**
```
🔔 Webhook recebido
📋 Status do pagamento: approved
✅ Pagamento aprovado: 123456789
📧 Email: usuario@email.com
📦 Pacote: Pacote Família
💰 Créditos: 35
🎟️ Código gerado: FOTO-ABCD-1234
📨 Email enviado! ID: abc123
```

**Duplicata (OK):**
```
⚠️ Código já existe para este pagamento: FOTO-ABCD-1234
```

**Erro de Email (Código criado):**
```
🎟️ Código gerado: FOTO-ABCD-1234
❌ ERRO AO ENVIAR EMAIL: {...}
```

---

## 🆘 SUPORTE

### Se emails continuarem não chegando:

1. **Verificar Resend:**
   - https://resend.com/emails
   - Status dos emails
   - Logs de erro

2. **Verificar Supabase:**
   - Códigos estão sendo criados?
   - `payment_id` correto?

3. **Verificar Variáveis:**
   ```bash
   # Na Vercel
   RESEND_API_KEY=re_xxxxx
   RESEND_FROM_EMAIL=onboarding@resend.dev
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_KEY=eyJxxx
   ```

4. **Testar Resend Diretamente:**
   ```bash
   curl -X POST 'https://api.resend.com/emails' \
     -H 'Authorization: Bearer re_sua-chave' \
     -H 'Content-Type: application/json' \
     -d '{
       "from": "onboarding@resend.dev",
       "to": "seu@email.com",
       "subject": "Teste",
       "html": "<p>Teste</p>"
     }'
   ```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Fazer deploy das correções
2. ✅ Configurar `RESEND_FROM_EMAIL`
3. ✅ Testar pagamento
4. ✅ Verificar email recebido
5. ⏭️ Verificar domínio no Resend (produção)
6. ⏭️ Atualizar `RESEND_FROM_EMAIL` para domínio próprio

---

**Correções aplicadas! Configure a variável de ambiente e teste novamente.** 🚀✨

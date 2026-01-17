# 🐛 Guia de Debug - Sistema de Códigos

## Correções Implementadas

### ✅ 1. Formatação Consistente
- `formatCode()` agora sempre retorna UPPERCASE
- Códigos são salvos com chave formatada
- Validação ignora diferenças de case

### ✅ 2. Logs de Debug
- Console mostra cada etapa da validação
- Exibe todos os códigos no storage
- Mostra código procurado vs encontrado

### ✅ 3. Busca Tolerante
- Se código não for encontrado exato, busca ignorando case
- Previne erros por diferenças de maiúsculas/minúsculas

### ✅ 4. Funções de Debug Expostas
- `debugCodes()` - lista todos os códigos
- `getAllCodes()` - retorna objeto com todos os códigos

---

## 🧪 Como Testar

### Passo 1: Limpar Storage (Opcional)
Se quiser começar do zero:

```javascript
// No console do browser (F12)
localStorage.clear()
// Recarregue a página
```

### Passo 2: Comprar um Pacote
1. Vá para a seção "Preços"
2. Clique em "Comprar Agora"
3. Digite um email (ex: `teste@email.com`)
4. Clique em "Pagar"
5. **Copie o código gerado** (ex: `REST-A3B7-K9M2`)

### Passo 3: Verificar Código no Console
Abra o console (F12) e digite:

```javascript
// Ver todos os códigos salvos
debugCodes()

// Ou diretamente
getAllCodes()
```

**Saída esperada:**
```
=== TODOS OS CÓDIGOS ===
Key: "REST-A3B7-K9M2"
  Code: "REST-A3B7-K9M2"
  Credits: 35/35
  Active: true
```

### Passo 4: Testar Ativação
1. Abra uma aba anônima (ou limpe o código ativo)
2. Clique em "Já tenho código"
3. Cole o código copiado
4. Clique em "Ativar Código"

**Logs esperados no console:**
```
=== DEBUG validateCode ===
Input: REST-A3B7-K9M2
Formatted: REST-A3B7-K9M2
All codes in storage: ["REST-A3B7-K9M2"]
Looking for: REST-A3B7-K9M2
Found: {code: "REST-A3B7-K9M2", email: "teste@email.com", ...}
```

### Passo 5: Verificar Código Ativo
```javascript
// Ver código ativo no dispositivo
localStorage.getItem('fotorestore_active_code')
// Deve retornar: "REST-A3B7-K9M2"
```

---

## 🔍 Diagnóstico de Problemas

### Problema: "Código não encontrado"

**Verificar 1: Código existe no storage?**
```javascript
debugCodes()
```
- Se não aparecer nenhum código → Problema na criação
- Se aparecer → Problema na validação

**Verificar 2: Formato do código**
```javascript
const codes = getAllCodes()
Object.keys(codes) // Ver exatamente como está salvo
```

**Verificar 3: Código ativo**
```javascript
localStorage.getItem('fotorestore_active_code')
```

### Problema: Código salvo mas não ativa

**Verificar logs no console:**
Ao tentar ativar, você deve ver:
```
=== DEBUG validateCode ===
Input: [seu código]
Formatted: [código formatado]
All codes in storage: [lista de códigos]
Looking for: [código procurado]
Found: [objeto encontrado ou undefined]
```

**Se "Found: undefined":**
- Há diferença entre o código salvo e o procurado
- Copie exatamente o que aparece em "All codes in storage"
- Tente ativar com esse código exato

### Problema: Créditos não aparecem

**Verificar estrutura do código:**
```javascript
const codes = getAllCodes()
const code = codes['REST-XXXX-XXXX'] // Substitua pelo seu código
console.log('Total:', code.creditsTotal)
console.log('Usado:', code.creditsUsed)
console.log('Restante:', code.creditsTotal - code.creditsUsed)
```

---

## 🛠️ Comandos Úteis

### Limpar tudo e recomeçar
```javascript
localStorage.clear()
location.reload()
```

### Ver estado completo
```javascript
console.log('Códigos:', getAllCodes())
console.log('Código ativo:', localStorage.getItem('fotorestore_active_code'))
console.log('Créditos locais:', JSON.parse(localStorage.getItem('fotorestore_local_credits')))
```

### Criar código manualmente (para teste)
```javascript
// Não recomendado, mas útil para debug
const testCode = {
  code: 'REST-TEST-1234',
  email: 'test@test.com',
  creditsTotal: 10,
  creditsUsed: 0,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 365*24*60*60*1000).toISOString(),
  packageName: 'Teste',
  isActive: true
}

const codes = getAllCodes()
codes['REST-TEST-1234'] = testCode
localStorage.setItem('fotorestore_codes', JSON.stringify(codes))
console.log('Código de teste criado!')
```

### Ativar código manualmente
```javascript
localStorage.setItem('fotorestore_active_code', 'REST-TEST-1234')
location.reload()
```

---

## 📊 Estrutura de Dados

### localStorage Keys

**`fotorestore_codes`**
```json
{
  "REST-A3B7-K9M2": {
    "code": "REST-A3B7-K9M2",
    "email": "user@example.com",
    "creditsTotal": 35,
    "creditsUsed": 5,
    "createdAt": "2024-11-29T10:00:00.000Z",
    "expiresAt": "2025-11-29T10:00:00.000Z",
    "packageName": "Pacote Família",
    "isActive": true
  }
}
```

**`fotorestore_active_code`**
```
"REST-A3B7-K9M2"
```

**`fotorestore_local_credits`**
```json
{
  "free": 2,
  "code": "REST-A3B7-K9M2",
  "codeCredits": 30,
  "isPaidUser": true
}
```

---

## ✅ Checklist de Verificação

Após as correções, verifique:

- [ ] Código é gerado no formato correto (REST-XXXX-XXXX)
- [ ] Código é salvo no localStorage
- [ ] `debugCodes()` mostra o código
- [ ] Código pode ser copiado
- [ ] Código pode ser ativado
- [ ] Créditos aparecem no header
- [ ] Badge de código ativo aparece
- [ ] CodeStatus aparece acima do upload
- [ ] Upload usa créditos do código (sem marca d'água)
- [ ] Desconectar remove o código
- [ ] Código pode ser reativado

---

## 🚨 Se Nada Funcionar

1. **Abra o console (F12)**
2. **Execute:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```
3. **Compre um novo pacote**
4. **Copie TODO o log do console**
5. **Envie para análise**

---

## 📝 Notas Importantes

- Os logs de debug devem ser **removidos em produção**
- As funções `debugCodes()` e `getAllCodes()` são apenas para desenvolvimento
- O sistema usa localStorage, então códigos são específicos do navegador/domínio
- Para produção, migrar para backend com banco de dados

---

**Última atualização:** 29/11/2024  
**Versão:** 1.1.0 (com correções de validação)

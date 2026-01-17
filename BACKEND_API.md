# 🚀 Backend API - Sistema de Códigos

## Arquitetura

```
Frontend (React) → API Routes → Storage (Memória/Vercel KV)
```

### Desenvolvimento Local
- **Frontend**: Vite (porta 3000)
- **Backend**: Express (porta 3001)
- **Storage**: Memória (objeto JavaScript)

### Produção (Vercel)
- **Frontend**: Vercel Edge
- **Backend**: Vercel Edge Functions
- **Storage**: Vercel KV (Redis)

---

## 📁 Estrutura de Arquivos

```
projeto/
├── api/
│   └── codes.ts          # Vercel Edge Function
├── server.js             # Servidor Express local
├── src/
│   ├── lib/
│   │   └── api.ts        # Cliente API
│   └── hooks/
│       └── useCredits.ts # Hook atualizado com API
```

---

## 🔌 Endpoints da API

### Base URL
- **Dev**: `http://localhost:3001/api/codes`
- **Prod**: `https://seu-dominio.vercel.app/api/codes`

---

### 1. Criar Código (POST)

**Endpoint**: `POST /api/codes?action=create`

**Body**:
```json
{
  "email": "user@example.com",
  "credits": 35,
  "packageName": "Pacote Família"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "code": "REST-A3B7-K9M2",
    "email": "user@example.com",
    "creditsTotal": 35,
    "creditsUsed": 0,
    "createdAt": "2024-11-29T10:00:00.000Z",
    "expiresAt": "2025-11-29T10:00:00.000Z",
    "packageName": "Pacote Família",
    "isActive": true
  }
}
```

**Response Error (400)**:
```json
{
  "success": false,
  "error": "Dados incompletos"
}
```

---

### 2. Validar Código (GET)

**Endpoint**: `GET /api/codes?action=validate&code=REST-A3B7-K9M2`

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "code": "REST-A3B7-K9M2",
    "email": "user@example.com",
    "creditsTotal": 35,
    "creditsUsed": 5,
    "creditsRemaining": 30,
    "createdAt": "2024-11-29T10:00:00.000Z",
    "expiresAt": "2025-11-29T10:00:00.000Z",
    "packageName": "Pacote Família",
    "isActive": true
  }
}
```

**Response Error (404)**:
```json
{
  "success": false,
  "error": "Código não encontrado"
}
```

**Response Error (400)**:
```json
{
  "success": false,
  "error": "Código expirado"
}
```

---

### 3. Usar Crédito (POST)

**Endpoint**: `POST /api/codes?action=use`

**Body**:
```json
{
  "code": "REST-A3B7-K9M2"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "creditsRemaining": 29
  }
}
```

**Response Error (404)**:
```json
{
  "success": false,
  "error": "Código não encontrado"
}
```

**Response Error (400)**:
```json
{
  "success": false,
  "error": "Sem créditos disponíveis"
}
```

---

### 4. Listar Códigos (GET) - Debug Only

**Endpoint**: `GET /api/codes?action=list`

**Disponível apenas em**: `NODE_ENV=development`

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
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
}
```

---

## 🛠️ Como Rodar

### Opção 1: Rodar Tudo Junto (Recomendado)

```bash
npm run dev:all
```

Isso inicia:
- ✅ API Server na porta 3001
- ✅ Frontend Vite na porta 3000

### Opção 2: Rodar Separadamente

**Terminal 1 - API**:
```bash
npm run api
```

**Terminal 2 - Frontend**:
```bash
npm run dev
```

---

## 🧪 Testar API com cURL

### Criar Código
```bash
curl -X POST http://localhost:3001/api/codes?action=create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "credits": 35,
    "packageName": "Pacote Família"
  }'
```

### Validar Código
```bash
curl http://localhost:3001/api/codes?action=validate&code=REST-A3B7-K9M2
```

### Usar Crédito
```bash
curl -X POST http://localhost:3001/api/codes?action=use \
  -H "Content-Type: application/json" \
  -d '{"code": "REST-A3B7-K9M2"}'
```

### Listar Códigos (Dev)
```bash
curl http://localhost:3001/api/codes?action=list
```

---

## 📊 Fluxo Completo

### 1. Usuário Compra Pacote

```typescript
// Frontend chama
const result = await apiCreateCode(
  'user@example.com',
  35,
  'Pacote Família'
);

// API retorna
{
  success: true,
  data: {
    code: 'REST-A3B7-K9M2',
    // ...
  }
}

// Frontend salva código ativo
localStorage.setItem('fotorestore_active_code', 'REST-A3B7-K9M2');
```

### 2. Usuário Ativa Código em Outro Dispositivo

```typescript
// Frontend chama
const result = await apiValidateCode('REST-A3B7-K9M2');

// API valida e retorna
{
  success: true,
  data: {
    code: 'REST-A3B7-K9M2',
    creditsRemaining: 35,
    // ...
  }
}

// Frontend salva código ativo
localStorage.setItem('fotorestore_active_code', 'REST-A3B7-K9M2');
```

### 3. Usuário Usa Crédito

```typescript
// Frontend chama
const result = await apiUseCredit('REST-A3B7-K9M2');

// API decrementa e retorna
{
  success: true,
  data: {
    creditsRemaining: 34
  }
}

// Frontend atualiza UI
setCredits(prev => ({ ...prev, codeCredits: 34 }));
```

---

## 🔐 Segurança

### Implementado
- ✅ CORS habilitado
- ✅ Validação de dados de entrada
- ✅ Códigos em uppercase
- ✅ Emails em lowercase
- ✅ Verificação de expiração
- ✅ Verificação de créditos

### Para Produção
- [ ] Rate limiting
- [ ] Autenticação de usuário
- [ ] Logs de auditoria
- [ ] Webhook de pagamento
- [ ] Envio de email
- [ ] Criptografia de dados sensíveis

---

## 🚀 Deploy na Vercel

### 1. Instalar Vercel KV

```bash
npm install @vercel/kv
```

### 2. Configurar Variáveis de Ambiente

No painel da Vercel, adicione:
```
KV_URL=seu_kv_url
KV_REST_API_URL=seu_kv_rest_api_url
KV_REST_API_TOKEN=seu_kv_token
KV_REST_API_READ_ONLY_TOKEN=seu_kv_read_only_token
```

### 3. Deploy

```bash
vercel deploy
```

A pasta `api/` será automaticamente detectada como Edge Functions.

---

## 📝 Diferenças: Dev vs Prod

### Desenvolvimento Local (server.js)
- Storage em memória (objeto JavaScript)
- Dados perdidos ao reiniciar
- Ideal para testes rápidos
- Porta 3001

### Produção (api/codes.ts)
- Storage em Vercel KV (Redis)
- Dados persistentes
- Escalável
- Edge Functions (global)

---

## 🐛 Debug

### Ver Logs do Servidor
```bash
# Terminal onde rodou npm run api
# Logs aparecem automaticamente
```

### Testar Endpoints
```bash
# Listar todos os códigos
curl http://localhost:3001/api/codes?action=list

# Ver resposta formatada
curl http://localhost:3001/api/codes?action=list | jq
```

### Verificar Estado
```javascript
// No console do browser
fetch('http://localhost:3001/api/codes?action=list')
  .then(r => r.json())
  .then(console.log)
```

---

## ⚡ Performance

### Desenvolvimento
- Latência: ~10ms (local)
- Throughput: Ilimitado

### Produção (Vercel)
- Latência: ~50-100ms (global)
- Throughput: Escalável automaticamente
- Cache: Edge caching disponível

---

## 🎯 Próximos Passos

### Curto Prazo
1. ✅ API funcionando localmente
2. ✅ Frontend integrado
3. ⏳ Testes em múltiplos navegadores
4. ⏳ Deploy na Vercel

### Médio Prazo
1. Integrar gateway de pagamento
2. Envio de email com código
3. Dashboard administrativo
4. Relatórios de uso

### Longo Prazo
1. Autenticação de usuários
2. Sistema de assinaturas
3. API pública para parceiros
4. Mobile app

---

## 📚 Recursos

### Documentação
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [Express.js](https://expressjs.com/)

### Ferramentas
- [Postman](https://www.postman.com/) - Testar API
- [Insomnia](https://insomnia.rest/) - Testar API
- [jq](https://stedolan.github.io/jq/) - Formatar JSON no terminal

---

**Implementado por**: Cascade AI  
**Data**: 29/11/2024  
**Versão**: 2.0.0 (com Backend)  
**Status**: ✅ Funcionando em Dev

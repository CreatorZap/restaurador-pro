# 🚀 GUIA COMPLETO - PREPARAÇÃO PARA PRODUÇÃO

## ✅ Checklist Completo - Tudo Aplicado!

### 1. ✅ Botão de Simulação Condicionado
**Arquivo**: `src/components/sections/PricingSection.tsx`

O botão de simulação agora **só aparece em desenvolvimento**:

```tsx
{/* DESENVOLVIMENTO - Botão de simulação (apenas em modo dev) */}
{import.meta.env.DEV && (
  <div className="mt-4 pt-4 border-t border-white/10">
    <p className="text-xs text-gray-500 mb-2 text-center">🧪 Modo desenvolvimento:</p>
    <Button ...>
      🧪 Simular Pagamento (teste)
    </Button>
  </div>
)}
```

**Resultado:**
- ✅ Em desenvolvimento (`npm run dev`): Botão aparece
- ✅ Em produção (build): Botão **não aparece**

---

### 2. ✅ Arquivo de Configuração de Ambiente
**Arquivo**: `src/config/environment.ts`

```typescript
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD 
      ? 'https://seu-dominio.vercel.app/api' 
      : 'http://localhost:3001'),
  
  siteUrl: import.meta.env.VITE_SITE_URL || 
    (import.meta.env.PROD 
      ? 'https://seu-dominio.vercel.app' 
      : 'http://localhost:3000'),
  
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
};
```

---

### 3. ✅ Tipos do Vite
**Arquivo**: `src/vite-env.d.ts`

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_GEMINI_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

### 4. ✅ API Client Atualizado
**Arquivo**: `src/lib/api.ts`

```typescript
const getApiUrl = () => {
  // Em produção, usar mesma origem (Vercel)
  if (import.meta.env.PROD) {
    return '/api/codes';
  }
  // Em desenvolvimento, usar servidor local
  return 'http://localhost:3001/api/codes';
};

const API_URL = getApiUrl();
```

---

### 5. ✅ Configuração Vercel
**Arquivo**: `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

### 6. ✅ API Serverless (Vercel)
**Arquivo**: `api/codes.ts`

Já existe e está configurado com:
- ✅ Suporte a Vercel KV
- ✅ Fallback para memória local
- ✅ Endpoints completos

---

### 7. ✅ Scripts de Build
**Arquivo**: `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "api": "node server.js",
    "dev:all": "concurrently \"npm run api\" \"npm run dev\"",
    "build": "tsc && vite build",
    "vercel-build": "vite build",
    "preview": "vite preview"
  }
}
```

---

### 8. ✅ Exemplo de Variáveis de Produção
**Arquivo**: `.env.production.example`

```env
# Mercado Pago - PRODUÇÃO (trocar pelo token real)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu-token-de-producao-aqui

# URLs
VITE_SITE_URL=https://seu-dominio.vercel.app
VITE_API_URL=https://seu-dominio.vercel.app/api

# Gemini
GEMINI_API_KEY=sua-chave-gemini-aqui
```

---

### 9. ✅ .gitignore
**Arquivo**: `.gitignore`

Já configurado com:
```
.env
.env.local
.env.production
node_modules
dist
```

---

## 🚀 DEPLOY NO VERCEL

### Passo 1: Preparar Repositório

```bash
# 1. Inicializar Git (se ainda não tiver)
git init

# 2. Adicionar arquivos
git add .

# 3. Commit
git commit -m "Preparado para produção"

# 4. Criar repositório no GitHub
# (Faça isso no site do GitHub)

# 5. Adicionar remote
git remote add origin https://github.com/seu-usuario/seu-repo.git

# 6. Push
git push -u origin main
```

---

### Passo 2: Deploy no Vercel

#### Opção A: Via Interface Web

1. Acesse: https://vercel.com
2. Clique em "Add New Project"
3. Importe seu repositório do GitHub
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Adicione as **Environment Variables**:
   ```
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu-token-de-producao
   VITE_SITE_URL=https://seu-dominio.vercel.app
   VITE_API_URL=https://seu-dominio.vercel.app/api
   GEMINI_API_KEY=sua-chave-gemini
   ```

6. Clique em "Deploy"

#### Opção B: Via CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Adicionar variáveis de ambiente
vercel env add MERCADOPAGO_ACCESS_TOKEN
vercel env add VITE_SITE_URL
vercel env add VITE_API_URL
vercel env add GEMINI_API_KEY

# 5. Deploy para produção
vercel --prod
```

---

### Passo 3: Configurar Domínio (Opcional)

1. No painel do Vercel, vá em "Settings" > "Domains"
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções
4. Atualize as variáveis de ambiente com o novo domínio

---

## 🔧 CONFIGURAÇÕES PÓS-DEPLOY

### 1. Atualizar URLs do Mercado Pago

No painel do Mercado Pago:

1. Acesse: https://www.mercadopago.com.br/developers
2. Vá em "Suas integrações"
3. Selecione sua aplicação
4. Configure:
   - **Redirect URI**: `https://seu-dominio.vercel.app`
   - **Webhook URL**: `https://seu-dominio.vercel.app/api/payment/webhook`

---

### 2. Testar em Produção

```bash
# 1. Acessar site
https://seu-dominio.vercel.app

# 2. Testar pagamento
- Clique em "Comprar Agora"
- Digite email
- Clique em "Pagar R$49"
- Use cartão de teste

# 3. Verificar logs
vercel logs
```

---

## 📊 DIFERENÇAS: DESENVOLVIMENTO vs PRODUÇÃO

| Recurso | Desenvolvimento | Produção |
|---------|----------------|----------|
| **Botão Simulação** | ✅ Visível | ❌ Oculto |
| **API URL** | localhost:3001 | /api |
| **Site URL** | localhost:3000 | seu-dominio.vercel.app |
| **Storage** | Memória | Vercel KV |
| **Token MP** | Teste | Produção |
| **auto_return** | ❌ Não usar | ✅ Pode usar |
| **Logs** | Console | Vercel Logs |

---

## 🎯 CHECKLIST FINAL PRÉ-DEPLOY

- [x] Botão de simulação condicionado
- [x] Configuração de ambiente criada
- [x] Tipos do Vite definidos
- [x] API client atualizado
- [x] vercel.json configurado
- [x] Scripts de build atualizados
- [x] .env.production.example criado
- [x] .gitignore verificado
- [ ] Repositório Git criado
- [ ] Push para GitHub
- [ ] Deploy no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] URLs do Mercado Pago atualizadas
- [ ] Testes em produção

---

## 🐛 TROUBLESHOOTING

### Erro: "Module not found"

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erro: "import.meta.env is undefined"

**Solução:**
- Certifique-se que `src/vite-env.d.ts` existe
- Reinicie o servidor de desenvolvimento

### Erro: "API não responde"

**Solução:**
1. Verifique `vercel.json`
2. Confirme que `api/codes.ts` existe
3. Verifique logs: `vercel logs`

### Botão de simulação aparece em produção

**Solução:**
- Verifique se usou `import.meta.env.DEV`
- Faça rebuild: `npm run build`
- Faça redeploy: `vercel --prod`

---

## 📝 VARIÁVEIS DE AMBIENTE

### Desenvolvimento (.env)
```env
MERCADOPAGO_ACCESS_TOKEN=TEST-...
SITE_URL=http://localhost:3000
GEMINI_API_KEY=...
```

### Produção (Vercel Dashboard)
```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...-producao
VITE_SITE_URL=https://seu-dominio.vercel.app
VITE_API_URL=https://seu-dominio.vercel.app/api
GEMINI_API_KEY=...
```

---

## 🎉 RESULTADO FINAL

### Em Desenvolvimento
```
✅ Botão de simulação visível
✅ API local (localhost:3001)
✅ Token de teste
✅ Logs no console
✅ Hot reload
```

### Em Produção
```
✅ Botão de simulação oculto
✅ API serverless (Vercel)
✅ Token de produção
✅ Logs no Vercel
✅ CDN global
✅ HTTPS automático
✅ Domínio personalizado
```

---

## 🚀 PRÓXIMOS PASSOS

1. **Criar repositório no GitHub**
2. **Fazer push do código**
3. **Deploy no Vercel**
4. **Configurar variáveis de ambiente**
5. **Atualizar URLs do Mercado Pago**
6. **Testar pagamento em produção**
7. **Configurar domínio personalizado** (opcional)
8. **Monitorar logs e erros**

---

## 📚 RECURSOS ÚTEIS

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev
- **Mercado Pago Docs**: https://www.mercadopago.com.br/developers
- **Vercel KV**: https://vercel.com/docs/storage/vercel-kv

---

**Preparado em**: 29/11/2024 às 22:05  
**Status**: ✅ **PRONTO PARA PRODUÇÃO**  
**Próximo**: Deploy no Vercel! 🚀

---

## 🎯 COMANDOS RÁPIDOS

```bash
# Testar build local
npm run build
npm run preview

# Deploy no Vercel
vercel

# Deploy em produção
vercel --prod

# Ver logs
vercel logs

# Listar variáveis de ambiente
vercel env ls
```

**Tudo pronto para o deploy!** 🎉

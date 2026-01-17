# 🧪 GUIA DE TESTE - Upload de Imagem

## ✅ Correções Aplicadas

### 1. **Async/Await Corrigido**
- `onUseCredit` agora é `Promise<{ success: boolean; hasWatermark: boolean }>`
- Handler `handleFileSelect` usa `await` corretamente

### 2. **Logs de Debug Adicionados**
Agora você verá no console:
```
📁 handleFileSelect triggered
📁 File: foto.jpg image/jpeg 2048576
💳 Usando crédito...
💳 Resultado: { success: true, hasWatermark: false }
🔄 Iniciando processamento...
📸 Convertendo para base64...
✅ Base64 convertido
🤖 Chamando API Gemini...
🤖 Resposta recebida: { hasText: true, hasImage: true }
✅ Restauração completa!
```

### 3. **Validação de Créditos**
- Verifica se há créditos antes de processar
- Mostra erro se não houver créditos

---

## 🧪 Como Testar

### 1. Iniciar Aplicação
```bash
npm run dev:all
```

Isso inicia:
- API na porta 3001
- Frontend na porta 3000

### 2. Abrir DevTools
1. Acesse `http://localhost:3000`
2. Pressione `F12` para abrir DevTools
3. Vá na aba **Console**

### 3. Testar Upload

#### Opção A: Clique para Selecionar
1. Role até a seção "Restaure Sua Foto Agora"
2. Clique na área de upload
3. Selecione uma imagem (JPG, PNG ou WEBP)
4. Observe os logs no console

#### Opção B: Drag and Drop
1. Arraste uma imagem do seu computador
2. Solte na área de upload
3. Observe os logs no console

### 4. Verificar Logs

**Logs Esperados (Sucesso):**
```
📁 handleFileSelect triggered
📁 File: minha-foto.jpg image/jpeg 1234567
💳 Usando crédito...
💳 Resultado: { success: true, hasWatermark: true }
🔄 Iniciando processamento...
📸 Convertendo para base64...
✅ Base64 convertido
🤖 Chamando API Gemini...
🤖 Resposta recebida: { hasText: true, hasImage: true }
🔖 Adicionando marca d'água...
✅ Marca d'água adicionada
✅ Restauração completa!
```

**Logs Esperados (Sem Créditos):**
```
📁 handleFileSelect triggered
📁 File: foto.jpg image/jpeg 1234567
❌ Sem créditos
```

**Logs Esperados (Erro):**
```
📁 handleFileSelect triggered
📁 File: foto.jpg image/jpeg 1234567
💳 Usando crédito...
💳 Resultado: { success: true, hasWatermark: false }
🔄 Iniciando processamento...
📸 Convertendo para base64...
✅ Base64 convertido
🤖 Chamando API Gemini...
❌ Erro: [mensagem de erro]
```

---

## 🔍 Troubleshooting

### Problema: Nada acontece ao clicar

**Possível Causa 1: Sem créditos**
- Verifique se há créditos disponíveis no topo da página
- Se não houver, compre um pacote ou use créditos gratuitos

**Possível Causa 2: Input file não está funcionando**
- Abra o console (F12)
- Veja se aparece `📁 handleFileSelect triggered`
- Se não aparecer, o click não está funcionando

**Solução:**
```javascript
// No console do navegador
document.querySelector('input[type="file"]')
// Deve retornar o elemento input
```

### Problema: Erro ao processar

**Possível Causa 1: API Key não configurada**
- Verifique se `.env.local` existe
- Verifique se `VITE_GEMINI_API_KEY` está definida

**Possível Causa 2: Formato de arquivo inválido**
- Use apenas JPG, PNG ou WEBP
- Tamanho máximo: 10MB

**Possível Causa 3: API Gemini offline**
- Verifique conexão com internet
- Tente novamente em alguns minutos

### Problema: Marca d'água não aparece

**Causa:** Você está usando créditos de código (sem marca d'água)

**Esperado:**
- Créditos gratuitos → **COM** marca d'água
- Créditos de código → **SEM** marca d'água

---

## 📊 Estados do Upload

### 1. Idle (Inicial)
```
┌─────────────────────────┐
│   📷 Arraste sua foto   │
│   ou clique para        │
│   selecionar            │
└─────────────────────────┘
```

### 2. Processing (Processando)
```
┌─────────────────────────┐
│   ⏳ Processando...     │
│   Nossa IA está         │
│   trabalhando           │
└─────────────────────────┘
```

### 3. Complete (Completo)
```
┌─────────────────────────┐
│   ✅ Concluído!         │
│   [Imagem Original]     │
│   [Imagem Restaurada]   │
│   [Baixar] [Nova]       │
└─────────────────────────┘
```

### 4. Error (Erro)
```
┌─────────────────────────┐
│   ❌ Erro!              │
│   [Mensagem de erro]    │
│   [Tentar Novamente]    │
└─────────────────────────┘
```

---

## 🎯 Checklist de Teste

- [ ] Aplicação iniciada (`npm run dev:all`)
- [ ] Console aberto (F12)
- [ ] Upload por clique funciona
- [ ] Upload por drag-and-drop funciona
- [ ] Logs aparecem no console
- [ ] Crédito é descontado
- [ ] Imagem é processada
- [ ] Marca d'água aparece (se crédito gratuito)
- [ ] Download funciona
- [ ] "Nova Restauração" reseta o estado

---

## 🐛 Comandos de Debug

### Ver estado do input
```javascript
// No console do navegador
document.querySelector('input[type="file"]')
```

### Simular click
```javascript
// No console do navegador
document.querySelector('input[type="file"]').click()
```

### Ver créditos
```javascript
// No console do navegador
localStorage.getItem('fotorestore_local_credits')
```

### Ver código ativo
```javascript
// No console do navegador
localStorage.getItem('fotorestore_active_code')
```

---

## 📝 Fluxo Completo

```
1. Usuário clica/arrasta imagem
   ↓
2. handleFileSelect é chamado
   ↓
3. Verifica se há créditos
   ↓
4. Usa crédito (onUseCredit)
   ↓
5. Converte imagem para base64
   ↓
6. Chama API Gemini
   ↓
7. Recebe imagem restaurada
   ↓
8. Adiciona marca d'água (se necessário)
   ↓
9. Exibe resultado
   ↓
10. Permite download
```

---

## ✅ Resultado Esperado

Após aplicar as correções:

1. ✅ Upload funciona por clique
2. ✅ Upload funciona por drag-and-drop
3. ✅ Logs aparecem no console
4. ✅ Créditos são descontados
5. ✅ Imagem é processada
6. ✅ Marca d'água é adicionada (se necessário)
7. ✅ Download funciona
8. ✅ Reset funciona

---

**Testado em**: 29/11/2024  
**Status**: ✅ Pronto para teste  
**Logs**: Habilitados no console

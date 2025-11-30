# 📸 Imagens de Exemplo - FotoMagic Pro

## 🎯 Estrutura de Arquivos

Coloque as imagens de exemplo nesta pasta seguindo esta nomenclatura:

```
public/examples/
├── 01-antes.jpg      # Exemplo 1 - Foto original
├── 01-depois.jpg     # Exemplo 1 - Foto restaurada
├── 02-antes.jpg      # Exemplo 2 - Foto original
├── 02-depois.jpg     # Exemplo 2 - Foto restaurada
├── 03-antes.jpg      # Exemplo 3 - Foto original
├── 03-depois.jpg     # Exemplo 3 - Foto restaurada
├── 04-antes.jpg      # Exemplo 4 - Foto original
├── 04-depois.jpg     # Exemplo 4 - Foto restaurada
└── README.md         # Este arquivo
```

---

## 📋 Especificações das Imagens

### Formato
- **Tipo**: JPG ou PNG
- **Orientação**: Retrato (vertical)
- **Aspect Ratio**: 3:4 ou 4:5 (recomendado)

### Tamanho
- **Largura**: 800px - 1200px
- **Altura**: 1000px - 1500px
- **Peso**: Máximo 500KB por imagem

### Qualidade
- **Compressão**: 80-90%
- **Resolução**: 72 DPI (web)

---

## 🎨 Exemplos Sugeridos

### Exemplo 1: Reconstrução Completa
- **Antes**: Foto rasgada, danificada, em pedaços
- **Depois**: Foto restaurada e colorizada
- **Descrição**: "Foto rasgada em 3 pedaços restaurada e colorizada"

### Exemplo 2: Remoção de Danos
- **Antes**: Foto com rachaduras, manchas, dobras
- **Depois**: Foto limpa e restaurada
- **Descrição**: "Rachaduras e manchas removidas com precisão"

### Exemplo 3: Foto de Família
- **Antes**: Foto antiga em P&B desbotada
- **Depois**: Foto colorizada e nítida
- **Descrição**: "Restauração completa com colorização natural"

### Exemplo 4: Restauração Facial
- **Antes**: Rosto danificado ou desfocado
- **Depois**: Detalhes faciais restaurados
- **Descrição**: "Reconstrução de detalhes faciais danificados"

---

## 🔧 Como Adicionar Novas Imagens

1. **Prepare as imagens** seguindo as especificações acima
2. **Renomeie** seguindo o padrão: `XX-antes.jpg` e `XX-depois.jpg`
3. **Copie** para a pasta `public/examples/`
4. **Atualize** o array `examples` em `src/components/sections/ExamplesSection.tsx`:

```tsx
const examples = [
  // ... exemplos existentes
  {
    id: 5,
    before: '/examples/05-antes.jpg',
    after: '/examples/05-depois.jpg',
    title: 'Seu Título',
    description: 'Sua descrição'
  }
];
```

---

## 🖼️ Otimização de Imagens

### Ferramentas Recomendadas

**Online:**
- [TinyPNG](https://tinypng.com/) - Compressão inteligente
- [Squoosh](https://squoosh.app/) - Otimização avançada
- [ImageOptim](https://imageoptim.com/) - Mac

**Linha de Comando:**
```bash
# Usando ImageMagick
convert input.jpg -quality 85 -resize 1000x1333 output.jpg

# Usando cwebp (WebP)
cwebp -q 85 input.jpg -o output.webp
```

---

## 📱 Responsividade

As imagens serão exibidas em diferentes tamanhos:

- **Mobile**: 100% da largura (max 400px)
- **Tablet**: 600px
- **Desktop**: 800px

O componente `ImageSlider` ajusta automaticamente o aspect ratio:
- Mobile: `aspect-[3/4]`
- Desktop: `aspect-[4/5]`

---

## ✅ Checklist de Qualidade

Antes de adicionar imagens, verifique:

- [ ] Imagens em alta qualidade
- [ ] Tamanho otimizado (< 500KB)
- [ ] Nomenclatura correta
- [ ] Aspect ratio adequado
- [ ] Contraste bom entre antes/depois
- [ ] Exemplos representativos
- [ ] Descrições claras

---

## 🎯 Dicas para Melhores Exemplos

### O que funciona bem:
✅ Transformações dramáticas (P&B → Colorido)  
✅ Danos visíveis claramente reparados  
✅ Antes e depois bem contrastantes  
✅ Fotos de pessoas (mais impactante)  
✅ Detalhes faciais restaurados  

### O que evitar:
❌ Diferenças sutis demais  
❌ Imagens muito escuras  
❌ Baixa qualidade  
❌ Direitos autorais duvidosos  
❌ Conteúdo sensível  

---

## 📄 Licença e Direitos

**IMPORTANTE**: Use apenas imagens que você tem direito de usar:

- ✅ Fotos próprias
- ✅ Fotos de domínio público
- ✅ Fotos com licença comercial
- ✅ Fotos com permissão do autor

❌ **NÃO USE** imagens protegidas por copyright sem permissão!

---

## 🔗 Recursos Úteis

### Bancos de Imagens Gratuitas
- [Unsplash](https://unsplash.com/)
- [Pexels](https://pexels.com/)
- [Pixabay](https://pixabay.com/)

### Fotos Antigas de Domínio Público
- [Library of Congress](https://www.loc.gov/pictures/)
- [Wikimedia Commons](https://commons.wikimedia.org/)
- [National Archives](https://www.archives.gov/)

---

## 🚀 Deploy

Após adicionar as imagens:

```bash
# 1. Verificar se as imagens estão na pasta
ls public/examples/

# 2. Testar localmente
npm run dev

# 3. Build
npm run build

# 4. Commit e push
git add public/examples/
git commit -m "✨ Adiciona imagens de exemplo"
git push origin main
```

---

**Última atualização**: 30/11/2024  
**Versão**: 1.0  
**FotoMagic Pro** 🎨✨

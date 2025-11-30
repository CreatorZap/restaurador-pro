export function addWatermark(
  imageUrl: string, 
  text: string = 'FotoRestore AI - Versão Gratuita'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas não suportado'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Desenha imagem original
      ctx.drawImage(img, 0, 0);
      
      // Configuração da marca d'água
      const fontSize = Math.max(16, img.width / 30);
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      
      // Posição: canto inferior direito
      const padding = 20;
      const textWidth = ctx.measureText(text).width;
      const x = canvas.width - textWidth - padding;
      const y = canvas.height - padding;
      
      // Desenha texto com contorno
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
      
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    
    img.onerror = () => reject(new Error('Erro ao carregar imagem'));
    img.src = imageUrl;
  });
}

export function removeWatermark(imageUrl: string): string {
  // Para usuários pagos, retorna a imagem original
  return imageUrl;
}

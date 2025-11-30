import React, { useState } from 'react';
import { Maximize2, Download } from './Icons';

interface ImageComparisonProps {
  original: string;
  restored: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({ original, restored }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };
  
  // Touch support
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
     if (!isResizing) return;
     const rect = e.currentTarget.getBoundingClientRect();
     const touch = e.touches[0];
     const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
     setSliderPosition((x / rect.width) * 100);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = restored;
    link.download = `restaurada_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div 
        className="relative w-full aspect-[4/3] md:aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 select-none cursor-col-resize group shadow-2xl"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Restored Image (Background) */}
        <img 
          src={restored} 
          alt="Restaurada" 
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Original Image (Foreground - Clipped) */}
        <div 
          className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none border-r border-white/50 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={original} 
            alt="Original" 
            className="absolute top-0 left-0 max-w-none h-full object-contain"
            style={{ width: `${100 / (sliderPosition / 100)}%` }} // Counter-scale logic not strictly needed for simple containment, but keeping it simple: just force fit
          />
           {/* Since both images are object-contain and same aspect ratio container, simple width clipping works if images match dimensions. 
               If images have different dimensions, we rely on them fitting the container identically. 
               For robustness, we usually use object-cover for comparisons, but for restoration, we want to see the whole image.
               Let's assume the user uploaded image is X, and restored is X.
           */}
           <div className="w-full h-full relative">
              <img src={original} className="w-full h-full object-contain" />
           </div>
        </div>

        {/* Fix for the slider logic with object-contain: 
            It's tricky to align perfectly if aspect ratios differ. 
            Better approach for this demo: Use background images or ensure styling locks them.
            Let's simplify: Just render both absolutely and clip the top one.
         */}
         
        {/* Re-implementation for robustness */}
        <div className="absolute inset-0 bg-zinc-950">
             <img src={restored} className="absolute inset-0 w-full h-full object-contain opacity-100" />
             <div 
                className="absolute inset-0 overflow-hidden border-r-2 border-white/80"
                style={{ width: `${sliderPosition}%` }}
             >
                 <img src={original} className="absolute inset-0 w-full h-full object-contain" />
             </div>
        </div>

        {/* Slider Handle */}
        <div 
            className="absolute top-0 bottom-0 w-1 bg-transparent cursor-col-resize flex items-center justify-center z-10"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
            <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-zinc-900">
                <Maximize2 size={16} className="rotate-45" />
            </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-medium border border-white/10">
          Original
        </div>
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium border border-white/10 text-white">
          Restaurada
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={downloadImage}
          className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          <Download size={18} />
          Baixar Imagem Restaurada
        </button>
      </div>
    </div>
  );
};
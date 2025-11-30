import React from 'react';
import { Sparkles, Wrench, Palette, ScanLine, CheckCircle2 } from './Icons';

interface AnalysisResultProps {
  text: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ text }) => {
  // Simple parser to map text lines to UI elements
  const lines = text.split('\n').filter(line => line.trim() !== '');

  const renderContent = () => {
    const corrections: string[] = [];
    let colorization = "";
    let quality = "";

    let currentSection = "";

    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (lower.includes('correções') || lower.includes('realizadas')) {
        currentSection = 'corrections';
        return;
      }
      if (lower.includes('colorização')) {
        currentSection = 'color';
        colorization = line.split(':')[1]?.trim() || line.replace('Colorização', '').trim();
        return;
      }
      if (lower.includes('qualidade')) {
        currentSection = 'quality';
        quality = line.split(':')[1]?.trim() || line.replace('Qualidade', '').trim();
        return;
      }

      if (currentSection === 'corrections' && (line.trim().startsWith('-') || line.trim().startsWith('•'))) {
        corrections.push(line.replace(/^[-•]\s*/, '').trim());
      }
    });

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 text-emerald-400 mb-6">
          <Sparkles className="w-6 h-6" />
          <h3 className="text-xl font-semibold text-white">Restauração Concluída</h3>
        </div>

        {corrections.length > 0 && (
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-100 mb-3 font-medium">
              <Wrench className="w-4 h-4 text-blue-400" />
              <span>Correções Realizadas</span>
            </div>
            <ul className="space-y-2">
              {corrections.map((corr, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0" />
                  <span>{corr}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {colorization && (
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-100 mb-2 font-medium">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Colorização</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {colorization}
            </p>
          </div>
        )}

        {quality && (
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-100 mb-2 font-medium">
              <ScanLine className="w-4 h-4 text-amber-400" />
              <span>Qualidade</span>
            </div>
            <p className="text-sm text-zinc-400">
              {quality}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
};
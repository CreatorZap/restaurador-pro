import { GoogleGenAI } from "@google/genai";
import { RestorationMode } from "../types";
import { SYSTEM_PROMPT } from "../constants/prompts";

// Helper to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const restoreImage = async (
  base64Image: string, 
  mode: RestorationMode,
  mimeType: string = 'image/jpeg'
): Promise<{ text: string; image: string | null }> => {
  
  // Create instance here to ensure we use the latest API key if it was just selected
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct the specific instruction based on mode
  let modeInstruction = "";
  switch (mode) {
    case RestorationMode.BW:
      modeInstruction = 'COMANDO: "P&B". Restaure mantendo preto e branco (não colorize). Foque em contraste e remoção de danos.';
      break;
    case RestorationMode.SEPIA:
      modeInstruction = 'COMANDO: "sépia". Restaure em tons sépia clássicos.';
      break;
    case RestorationMode.REPAIR_ONLY:
      modeInstruction = 'COMANDO: "apenas reparar". Corrija danos sem colorizar. Mantenha as cores originais.';
      break;
    case RestorationMode.VIBRANT:
      modeInstruction = 'COMANDO: "mais saturado". Restaure com cores vibrantes e vivas.';
      break;
    case RestorationMode.NATURAL:
      modeInstruction = 'COMANDO: "mais natural". Restaure com cores suaves e realistas.';
      break;
    default:
      modeInstruction = 'MODO AUTOMÁTICO: Realize a restauração completa incluindo colorização natural.';
      break;
  }

  const fullPrompt = `${SYSTEM_PROMPT}\n\n${modeInstruction}\n\nATENÇÃO: A geração da imagem é a prioridade máxima.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: fullPrompt
          }
        ]
      },
      config: {
        imageConfig: {
          imageSize: '2K'
        }
      }
    });

    let generatedImage: string | null = null;
    let generatedText: string = "";

    // Parse the response parts
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImage = part.inlineData.data;
        } else if (part.text) {
          generatedText += part.text;
        }
      }
    }

    // If we have text but no image, it's a failure for this app
    if (!generatedImage && generatedText) {
      console.warn("Model returned text only:", generatedText);
    }

    if (!generatedImage && !generatedText) {
      throw new Error("O modelo não retornou conteúdo válido.");
    }

    return { text: generatedText, image: generatedImage };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
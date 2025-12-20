
import { GoogleGenAI } from "@google/genai";

/**
 * Converte um blob/ficheiro para base64.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Restaura e colore a imagem usando o modelo Gemini 2.5 Flash.
 * A chave de API é obtida automaticamente de process.env.API_KEY.
 */
export const restoreImage = async (file: File | string): Promise<string> => {
  try {
    // IMPORTANTE: Criamos a instância aqui para garantir que usa a chave mais atual do sistema
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let base64Data: string;
    if (file instanceof File) {
      base64Data = await blobToBase64(file);
    } else if (typeof file === 'string' && file.startsWith('data:')) {
      base64Data = file.split(',')[1];
    } else {
      base64Data = file;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png',
            },
          },
          {
            text: 'Restore this old photo. Remove scratches and dust. Colorize it with natural and vibrant colors. Enhance faces. Return ONLY the restored image.',
          },
        ],
      },
    });

    let restoredUrl: string | null = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          restoredUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!restoredUrl) {
      throw new Error("O motor de IA não devolveu uma imagem. Tente novamente.");
    }
    
    return restoredUrl;
  } catch (error: any) {
    console.error("Erro no Gemini Service:", error);
    if (error.message?.includes("429") || error.message?.includes("QUOTA")) {
      throw new Error("Limite de quota atingido. Por favor, clique no botão 'Ligar ao Motor AI' para usar a sua chave pessoal.");
    }
    throw error;
  }
};

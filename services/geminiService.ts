
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
 * Restaura e colore a imagem usando o modelo Gemini 2.5 Flash diretamente no browser.
 * A chave de API é obtida automaticamente de process.env.API_KEY injetada pelo sistema.
 */
export const restoreImage = async (file: File | string): Promise<string> => {
  try {
    // A chave process.env.API_KEY é fornecida automaticamente pelo ambiente de execução.
    if (!process.env.API_KEY) {
      throw new Error("Chave de API não configurada no ambiente.");
    }

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
            text: 'Perform a professional photo restoration. 1. Colorize naturally if it is a black and white photo. 2. Remove all scratches, dust and digital noise. 3. Sharpen facial details and enhance clarity. Return ONLY the restored image as a binary part.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
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
      throw new Error("O motor de IA não conseguiu gerar a imagem. Verifique se o conteúdo da foto é suportado.");
    }
    
    return restoredUrl;
  } catch (error: any) {
    console.error("Erro no Processo de Restauro:", error);
    if (error.message?.includes("API_KEY")) {
      throw new Error("Erro de Configuração: A chave de API não foi detetada. Por favor, use o botão 'Ligar ao Motor AI' no topo da página.");
    }
    throw error;
  }
};

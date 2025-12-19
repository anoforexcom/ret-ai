
import { GoogleGenAI } from "@google/genai";

/**
 * Converte um blob/ficheiro para base64 com tratamento de erro robusto.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        const base64String = result.split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error("Falha ao extrair dados Base64 da imagem. O ficheiro pode estar corrompido."));
        }
      } else {
        reject(new Error("O resultado da leitura do ficheiro é inválido."));
      }
    };

    reader.onerror = () => {
      const errorMsg = reader.error?.message || "Erro desconhecido no FileReader.";
      reject(new Error(`Erro ao ler o ficheiro: ${errorMsg}`));
    };

    try {
      reader.readAsDataURL(blob);
    } catch (err) {
      reject(new Error("Não foi possível iniciar a leitura do ficheiro. Verifique as permissões do navegador."));
    }
  });
};

/**
 * Restaura e colore a imagem usando o motor RetroColor AI (Gemini 3 Pro Engine).
 */
export const restoreImage = async (file: File | string): Promise<string> => {
  try {
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
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png',
            },
          },
          {
            text: 'Restore this old photo using your highest quality capabilities. Remove all scratches, noise, dust, and physical damage. Colorize it with extremely natural, vibrant, and historically accurate colors. Enhance the clarity of faces and textures. Return ONLY the restored image as data.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    let restoredUrl: string | null = null;
    if (response.candidates && response.candidates[0].content) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          restoredUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!restoredUrl) {
      const textResponse = response.text || "";
      if (textResponse.includes("quota") || textResponse.includes("limit")) {
        throw new Error("Quota do motor RetroColor AI excedida. Por favor, utilize a sua própria chave de autenticação.");
      }
      throw new Error("O motor RetroColor AI não conseguiu processar esta imagem. Tente uma foto com melhor foco.");
    }
    
    return restoredUrl;
  } catch (error: any) {
    console.error("Erro no Serviço de Restauração RetroColor:", error);
    
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("A chave de ligação ao motor RetroColor é inválida ou expirou.");
    }
    
    throw new Error(error.message || "Erro inesperado no motor RetroColor AI.");
  }
};

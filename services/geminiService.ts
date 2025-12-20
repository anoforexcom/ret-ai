
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
 * Restaura e colore a imagem usando o motor RetroColor AI (Gemini 2.5 Flash Engine).
 */
export const restoreImage = async (file: File | string): Promise<string> => {
  try {
    // Inicializa o cliente com a chave mais recente disponível no ambiente
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
            text: 'Restore this old photo using your highest quality capabilities. Remove all scratches, noise, dust, and physical damage. Colorize it with extremely natural, vibrant, and historically accurate colors. Enhance the clarity of faces and textures. Return ONLY the restored image as data.',
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
      if (textResponse.includes("quota") || textResponse.includes("limit") || textResponse.includes("exhausted")) {
        throw new Error("Quota do motor RetroColor AI excedida. Por favor, utilize a sua própria chave de autenticação paga.");
      }
      throw new Error("O motor RetroColor AI não conseguiu processar esta imagem. Tente uma foto com melhor foco.");
    }
    
    return restoredUrl;
  } catch (error: any) {
    console.error("Erro no Serviço de Restauração RetroColor:", error);
    
    const errorMsg = error.message || "";
    if (errorMsg.includes("Requested entity was not found") || errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("Limite de quota atingido ou chave inválida. Por favor, selecione uma chave de API paga para continuar sem restrições.");
    }
    
    throw new Error(error.message || "Erro inesperado no motor RetroColor AI.");
  }
};

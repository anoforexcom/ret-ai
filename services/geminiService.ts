
import { GoogleGenAI } from "@google/genai";

/**
 * Converte um ficheiro para uma string base64 sem o prefixo de URL de dados.
 */
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Envia uma foto antiga para o Gemini para ser restaurada e colorida.
 * Utiliza o modelo gemini-2.5-flash-image para edição de imagem.
 */
export const restoreImage = async (file: File): Promise<string> => {
  try {
    // Create a new GoogleGenAI instance right before making an API call
    // The API key is obtained exclusively from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const base64Data = await fileToGenerativePart(file);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: file.type,
            },
          },
          {
            text: 'Restore this old photo. Remove scratches, noise, and digital artifacts. Enhance clarity and sharpness. Colorize it with natural, realistic colors appropriate for the scene. Preserve the historical essence while making it look like a high-quality modern photograph. Return ONLY the restored image.',
          },
        ],
      },
    });

    let restoredUrl = null;
    
    // O modelo gemini-2.5-flash-image retorna a imagem dentro de candidates[0].content.parts
    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          restoredUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!restoredUrl) {
      // Accessing .text property directly (not as a method)
      const textOutput = response.text;
      if (textOutput) {
        throw new Error(`A IA não conseguiu processar a imagem: ${textOutput}`);
      }
      throw new Error("Não foi possível gerar a imagem restaurada.");
    }

    return restoredUrl;

  } catch (error: any) {
    console.error("Erro no Serviço de Restauração:", error);
    throw new Error(error.message || "Falha ao restaurar a imagem.");
  }
};

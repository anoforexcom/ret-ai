import { GoogleGenAI } from "@google/genai";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const restoreImage = async (file: File): Promise<string> => {
  try {
    // Agora usamos a chave diretamente no cliente para facilitar (sem backend)
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey.includes("INSIRA_A_SUA_CHAVE")) {
        throw new Error("Chave de API não configurada. Edite o ficheiro .env com a sua chave da Google AI.");
    }

    // Validação extra: Chaves da Google geralmente começam com AIzaSy
    if (!apiKey.startsWith("AIzaSy")) {
         throw new Error("A chave de API parece incorreta (deve começar por 'AIzaSy'). Verifique se copiou a chave completa no Google AI Studio e não apenas o nome do projeto.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Converter ficheiro para base64
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
            text: 'Restore this old photo. Remove scratches, noise, and blur. Colorize it to make it look like a high-quality modern photo with natural, vibrant colors. Return ONLY the image.',
          },
        ],
      },
    });

    let restoredUrl = null;
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          restoredUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!restoredUrl) {
       throw new Error("A IA não conseguiu gerar a imagem. Tente novamente.");
    }

    return restoredUrl;

  } catch (error: any) {
    console.error("Service Error:", error);
    
    let msg = error.message || "Falha ao restaurar a imagem. Tente novamente.";
    // Melhorar mensagens para erros comuns
    if (msg.includes("403") || msg.includes("API key")) {
        msg = "Chave de API inválida ou expirada. Verifique o ficheiro .env.";
    }
    
    throw new Error(msg);
  }
};
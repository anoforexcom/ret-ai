
import { GoogleGenAI } from "@google/genai";

/**
 * Handler da API Route para restaurar imagens.
 * Recebe uma imagem em base64 e utiliza o Gemini 2.5 Flash Image para processar.
 */
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Método não permitido', { status: 405 });
  }

  try {
    const { image } = await req.json();

    if (!image) {
      return new Response(JSON.stringify({ error: 'Nenhuma imagem fornecida.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // A instância é criada aqui para usar o segredo injetado no ambiente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: image,
              mimeType: 'image/png',
            },
          },
          {
            text: 'Perform a professional photo restoration. 1. Colorize naturally if B&W. 2. Remove all scratches and dust. 3. Enhance facial details. Return ONLY the restored image as a binary part.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    let restoredBase64: string | null = null;
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          restoredBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!restoredBase64) {
      return new Response(JSON.stringify({ error: 'Falha ao processar a imagem com IA.' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ restoredImage: restoredBase64 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Erro na API Route:", error);
    return new Response(JSON.stringify({ error: error.message || 'Erro interno no servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

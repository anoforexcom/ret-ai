import Replicate from "replicate";

export const config = {
  maxDuration: 120,
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  console.log("--- TESTE DE CONECTIVIDADE ---");

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Nenhuma imagem fornecida.' });
    }

    // SIMULAÇÃO DE PROCESSAMENTO (MOCK)
    // Retorna a própria imagem de volta para testar se o "cano" está funcionando
    console.log("Mock: Devolvendo imagem original para teste de conectividade.");
    
    // Pequeno delay para simular IA
    await new Promise(r => setTimeout(r, 2000));

    return res.status(200).json({ 
      restoredImage: imageBase64,
      mimeType: "image/jpeg",
      isMock: true
    });

  } catch (error: any) {
    console.error("ERRO NO MOCK:", error);
    return res.status(500).json({ error: error.message });
  }
}

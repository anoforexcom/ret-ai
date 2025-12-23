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

  console.log("--- INÍCIO DO PROCESSO DE RESTAURO ---");

  try {
    const { imageBase64, modelName = "Stable", renderFactor = 35 } = req.body;

    if (!imageBase64) {
      console.log("Erro: Imagem base64 não fornecida.");
      return res.status(400).json({ error: 'Nenhuma imagem fornecida.' });
    }

    console.log(`Chamando Replicate... Modelo: DeOldify, Style: ${modelName}, Render: ${renderFactor}`);

    // Executa o modelo DeOldify
    const output = await replicate.run(
      "arielreplicate/deoldify_image:376c74a2c9eb442a2ff9391b84dc5b949cd4e80b4dc0565115be0a19b7df0ae6",
      {
        input: {
          input_image: `data:image/jpeg;base64,${imageBase64}`,
          model_name: modelName,
          render_factor: renderFactor
        }
      }
    );

    console.log("Replicate respondeu com sucesso.");

    // O Replicate pode retornar uma string simples ou um array de strings
    let resultUrl = "";
    if (Array.isArray(output)) {
      resultUrl = output[0];
    } else {
      resultUrl = output as string;
    }

    console.log("URL da imagem processada:", resultUrl);

    if (!resultUrl) {
      console.log("Erro: O Replicate não retornou URL válida.");
      return res.status(500).json({ error: 'O motor de IA não devolveu nenhum resultado.' });
    }

    console.log("Baixando imagem do Replicate para conversão Base64...");
    const imageRes = await fetch(resultUrl);
    if (!imageRes.ok) {
      console.log(`Erro ao baixar imagem: ${imageRes.status} ${imageRes.statusText}`);
      throw new Error(`Falha ao baixar a imagem do Replicate (${imageRes.status}).`);
    }

    const arrayBuffer = await imageRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    console.log("Conversão concluída. Enviando resposta ao frontend.");

    return res.status(200).json({
      restoredImage: base64,
      mimeType: "image/jpeg"
    });

  } catch (error: any) {
    console.error("ERRO CRÍTICO NO BACKEND:", error);
    return res.status(500).json({
      error: error.message || 'Erro interno no servidor',
      details: error.stack
    });
  } finally {
    console.log("--- FIM DO PROCESSO DE RESTAURO ---");
  }
}

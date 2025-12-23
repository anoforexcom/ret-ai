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

  console.log("--- INÍCIO DO PROCESSO REAL DE COLORIZAÇÃO ---");

  try {
    const { imageBase64, modelName = "Stable", renderFactor = 35 } = req.body;

    if (!imageBase64) {
      console.log("Erro: Imagem não fornecida.");
      return res.status(400).json({ error: 'Nenhuma imagem fornecida.' });
    }

    console.log(`Enviando para Replicate... (Estilo: ${modelName}, Render: ${renderFactor})`);

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

    console.log("Replicate finalizou o processamento.");

    let resultUrl = "";
    if (Array.isArray(output)) {
      resultUrl = output[0];
    } else {
      resultUrl = output as string;
    }

    if (!resultUrl) {
      console.log("Erro: Sem URL de saída.");
      return res.status(500).json({ error: 'O motor de IA não devolveu nenhum resultado.' });
    }

    console.log("Iniciando conversão para Base64 interna (Proxy)...");
    const imageRes = await fetch(resultUrl);
    if (!imageRes.ok) throw new Error("Falha ao capturar imagem final.");

    const arrayBuffer = await imageRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    console.log("Sucesso! Enviando imagem para o usuário.");

    return res.status(200).json({
      restoredImage: base64,
      mimeType: "image/jpeg"
    });

  } catch (error: any) {
    console.error("ERRO NO BACKEND:", error);
    return res.status(500).json({ error: error.message || 'Erro no processamento' });
  } finally {
    console.log("--- FIM DO PROCESSO ---");
  }
}

import Replicate from "replicate";

export const config = {
  maxDuration: 120,
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'M├®todo n├úo permitido' });
  }

  console.log("--- IN├ìCIO DO PROCESSO REAL DE COLORIZA├ç├âO ---");

  try {
    const { imageBase64, modelName = "Artistic", renderFactor = 28 } = req.body;

    if (!imageBase64) {
      console.log("Erro: Imagem n├úo fornecida.");
      return res.status(400).json({ error: 'Nenhuma imagem fornecida.' });
    }

    console.log(`Enviando para Replicate... (Estilo: ${modelName}, Render: ${renderFactor})`);

    // Executa o modelo DeOldify
    const output = await replicate.run(
      "arielreplicate/deoldify_image:0da600fab0c45a66211339f1c16b71345d22f26ef5fea3dca1bb90bb5711e950",
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
      console.log("Erro: Sem URL de sa├¡da.");
      return res.status(500).json({ error: 'O motor de IA n├úo devolveu nenhum resultado.' });
    }

    console.log("Iniciando convers├úo para Base64 interna (Proxy)...");
    const imageRes = await fetch(resultUrl);
    if (!imageRes.ok) throw new Error("Falha ao capturar imagem final.");

    const arrayBuffer = await imageRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    console.log("Sucesso! Enviando imagem para o usu├írio.");

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

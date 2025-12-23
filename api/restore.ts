import Replicate from "replicate";

export const config = {
  maxDuration: 60,
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  console.log("Iniciando colorização com DeOldify...");

  try {
    const { imageBase64, modelName = "Stable", renderFactor = 35 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Nenhuma imagem fornecida.' });
    }

    // Executa o modelo DeOldify no Replicate usando a versão específica fornecida
    // arielreplicate/deoldify_image:376c74a2c9eb442a2ff9391b84dc5b949cd4e80b4dc0565115be0a19b7df0ae6
    const output = await replicate.run(
      "arielreplicate/deoldify_image:376c74a2c9eb442a2ff9391b84dc5b949cd4e80b4dc0565115be0a19b7df0ae6",
      {
        input: {
          input_image: `data:image/png;base64,${imageBase64}`,
          model_name: modelName,
          render_factor: renderFactor
        }
      }
    );

    console.log("DeOldify output URL:", output);

    if (!output) {
      return res.status(500).json({ error: 'O motor de IA não devolveu nenhum resultado.' });
    }

    // Convertemos o URL para Base64 no servidor para evitar erros de CORS e "Falha de Rede" no download
    console.log("Convertendo resultado para Base64...");
    const imageRes = await fetch(output as string);
    if (!imageRes.ok) throw new Error("Falha ao baixar a imagem processada.");

    const arrayBuffer = await imageRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return res.status(200).json({ restoredImage: base64 });

  } catch (error: any) {
    console.error("Erro no DeOldify:", error);
    return res.status(500).json({ error: error.message || 'Erro interno no servidor' });
  }
}

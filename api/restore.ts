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

  console.log("Iniciando restauro com CodeFormer...");

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Nenhuma imagem fornecida.' });
    }

    // Executa o modelo CodeFormer no Replicate
    const output = await replicate.run(
      "sczhou/codeformer:cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2",
      {
        input: {
          image: `data:image/png;base64,${image}`,
          upscale: 2,
          face_upsample: true,
          background_enhance: true,
          codeformer_fidelity: 0.7
        }
      }
    );

    console.log("CodeFormer output:", output);

    if (!output) {
      return res.status(500).json({ error: 'O motor de IA não devolveu nenhum resultado.' });
    }

    // Retorna o URL diretamente para o frontend
    return res.status(200).json({ restoredImage: output });

  } catch (error: any) {
    console.error("Erro no CodeFormer:", error);
    return res.status(500).json({ error: error.message || 'Erro interno no servidor' });
  }
}

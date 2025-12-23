import Replicate from "replicate";

export const config = {
  maxDuration: 60,
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req: any, res: any) {
  // Configuração de CORS se necessário (opcional para rotas internas na Vercel)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  console.log("Iniciando restauro com Replicate...");

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Nenhuma imagem fornecida.' });
    }

    // Executa o modelo GFPGAN no Replicate
    // tencentarc/gfpgan:9283608cc6b7c309b5881f1d9fa9921997371881ad5d7aca371e12697c3ef221
    const output = await replicate.run(
      "tencentarc/gfpgan:9283608cc6b7c309b5881f1d9fa9921997371881ad5d7aca371e12697c3ef221",
      {
        input: {
          image: `data:image/png;base64,${image}`,
          upscale: 2,
          face_soften: 0.5
        }
      }
    );

    console.log("Replicate output:", output);

    if (!output) {
      return res.status(500).json({ error: 'O Replicate não devolveu nenhum resultado.' });
    }

    // Retorna o URL diretamente para o frontend. 
    // Isso evita o download e reconversão pesada no servidor (que causa timeout).
    return res.status(200).json({ restoredImage: output });

  } catch (error: any) {
    console.error("Erro no Replicate:", error);
    return res.status(500).json({ error: error.message || 'Erro interno no servidor' });
  }
}

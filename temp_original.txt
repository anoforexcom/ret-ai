import Replicate from "replicate";

/**
 * Handler da API Route para restaurar imagens usando Replicate (GFPGAN).
 * Mais especializado em restauro e colorização do que o Gemini.
 */
export const config = {
  maxDuration: 60,
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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

    // Executa o modelo GFPGAN no Replicate
    // Este modelo é especialista em restaurar rostos e melhorar qualidade
    const output = await replicate.run(
      "tencentarc/gfpgan:9283608cc6b7c309b5881f1d9fa9921997371881ad5d7aca371e12697c3ef221",
      {
        input: {
          image: `data:image/png;base64,${image}`,
          upscale: 2,
          face_soften: 0.5
        }
      }
    ) as string;

    if (!output) {
      return new Response(JSON.stringify({ error: 'O Replicate não devolveu nenhum resultado.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // O Replicate devolve normalmente um URL direto para a imagem hospedada
    // Vamos converter para base64 para o frontend lidar de forma consistente ou enviar o URL
    const imageRes = await fetch(output);
    const arrayBuffer = await imageRes.arrayBuffer();
    const restoredBase64 = Buffer.from(arrayBuffer).toString('base64');

    return new Response(JSON.stringify({ restoredImage: restoredBase64 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Erro no Replicate:", error);
    return new Response(JSON.stringify({ error: error.message || 'Erro interno no servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

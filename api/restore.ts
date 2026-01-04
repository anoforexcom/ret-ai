import Replicate from "replicate";

export const config = {
  maxDuration: 120,
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const token = process.env.REPLICATE_API_TOKEN;
  console.log("--- INÍCIO DO PROCESSO DE RESTAURO (VERSÃO DEBUG) ---");
  console.log(`Token Replicate presente: ${token ? 'SIM (Começa com ' + token.substring(0, 4) + '...)' : 'NÃO'}`);

  try {
    const { imageBase64, modelName = "Artistic", renderFactor = 28 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Nenhuma imagem fornecida.' });
    }

    let output: any;

    try {
      console.log("Criando predição DeOldify...");
      const prediction = await replicate.predictions.create({
        version: "0da600fab0c45a66211339f1c16b71345d22f26ef5fea3dca1bb90bb5711e950",
        input: {
          input_image: `data:image/jpeg;base64,${imageBase64}`,
          model_name: "Artistic",
          render_factor: Number(renderFactor)
        }
      });

      console.log(`Predição iniciada (ID: ${prediction.id}). Aguardando...`);
      const result = await replicate.wait(prediction);

      console.log("Resultado da Predição extraído. Status:", result.status);

      if (result.status === "failed") {
        throw new Error(`A predição falhou: ${result.error || 'Sem detalhes do erro'}`);
      }

      output = result.output;
      console.log("Output extraído:", typeof output, JSON.stringify(output));

    } catch (primaryError: any) {
      console.error("DEBUG: ERRO NO MOTOR PRINCIPAL:", primaryError.message);

      const errorMsg = primaryError.message?.toLowerCase() || "";
      const isQuotaError = primaryError.status === 429 || primaryError.status === 402 ||
        errorMsg.includes("quota") || errorMsg.includes("balance");

      if (isQuotaError) {
        if (primaryError.status === 429) {
          console.log("Rate limit (429). Pausa de 11s antes do fallback...");
          await sleep(11000);
        }

        console.log("Iniciando Fallback...");
        // Repetimos o processo para o fallback se necessário, mas aqui apenas tentamos correr novamente
        output = await replicate.run(
          "arielreplicate/deoldify_image:0da600fab0c45a66211339f1c16b71345d22f26ef5fea3dca1bb90bb5711e950",
          {
            input: {
              input_image: `data:image/jpeg;base64,${imageBase64}`,
              model_name: "Artistic",
              render_factor: Number(renderFactor)
            }
          }
        );
      } else {
        return res.status(primaryError.status || 500).json({
          error: "Erro técnico na IA.",
          details: primaryError.message,
          debug_status: primaryError.status
        });
      }
    }

    // Extracção do URL com logs de tipo
    let resultUrl = "";
    if (output) {
      if (typeof output === 'string' && output.startsWith('http')) {
        resultUrl = output;
      } else if (Array.isArray(output) && output.length > 0) {
        const first = output[0];
        resultUrl = typeof first === 'string' ? first : (first?.url ? String(first.url) : String(first));
      } else if (typeof output === 'object') {
        // Se for um FileOutput do novo SDK, tentamos converter para string ou pegar .url
        resultUrl = output.url ? String(output.url) : (output.toString ? output.toString() : "");
      }
    }

    console.log("URL Extraído Final:", resultUrl);

    if (!resultUrl || !resultUrl.startsWith('http')) {
      return res.status(500).json({
        error: 'A IA não devolveu um resultado válido.',
        details: `Status: 200 OK mas Output inválido. Raw: ${JSON.stringify(output)}`,
        debug_status: 500
      });
    }

    console.log("Baixando imagem final...");
    const imageRes = await fetch(resultUrl);
    if (!imageRes.ok) throw new Error("Erro ao baixar resultado do Replicate.");

    const arrayBuffer = await imageRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return res.status(200).json({
      restoredImage: base64,
      mimeType: "image/jpeg"
    });

  } catch (error: any) {
    console.error("ERRO GERAL:", error);
    return res.status(500).json({ error: error.message || 'Erro interno' });
  } finally {
    console.log("--- FIM DO PROCESSO ---");
  }
}

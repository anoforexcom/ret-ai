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
  console.log("--- INÍCIO DO PROCESSO REAL DE COLORIZAÇÃO ---");
  console.log(`Token Replicate presente: ${token ? 'SIM (Começa com ' + token.substring(0, 4) + '...)' : 'NÃO'}`);

  try {
    const { imageBase64, modelName = "Artistic", renderFactor = 28 } = req.body;

    if (!imageBase64) {
      console.log("Erro: Imagem não fornecida.");
      return res.status(400).json({ error: 'Nenhuma imagem fornecida.' });
    }

    console.log(`Enviando para Replicate... (Modelo: DeOldify - ORIGINAL)`);
    let output: any;

    try {
      // Tenta o motor original DeOldify (Confirmado pelo utilizador)
      // Nota: input_image é o campo esperado para esta versão de acordo com o log de erro anterior
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
      console.log("DeOldify finalizou a chamada API.");
      console.log("Output Raw Type:", typeof output);
    } catch (primaryError: any) {
      console.error("DEBUG: ERRO DETETADO NO MOTOR DEOLDIFY:");
      console.error("Mensagem:", primaryError.message);
      console.error("Status:", primaryError.status);

      const errorMsg = primaryError.message?.toLowerCase() || "";
      const isQuotaError =
        primaryError.status === 429 ||
        primaryError.status === 402 ||
        errorMsg.includes("quota") ||
        errorMsg.includes("limit") ||
        errorMsg.includes("balance") ||
        errorMsg.includes("credit") ||
        errorMsg.includes("payment required");

      if (isQuotaError) {
        if (primaryError.status === 429 || errorMsg.includes("throttled")) {
          console.log("Rate limit atingido. Aguardando Reset...");
          await sleep(11000);
        }

        console.log("Iniciando Fallback (Mesmos parâmetros)...");
        try {
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
        } catch (fallbackError: any) {
          return res.status(fallbackError.status || 500).json({
            error: "Quota excedida ou erro no motor de IA.",
            details: fallbackError.message,
            debug_status: fallbackError.status
          });
        }
      } else {
        return res.status(primaryError.status || 500).json({
          error: "Erro técnico no motor de IA.",
          details: primaryError.message,
          debug_status: primaryError.status
        });
      }
    }

    console.log("Processando resultado do Replicate...");

    // Extracção robusta do URL
    let resultUrl = "";
    if (output) {
      if (typeof output === 'string') {
        resultUrl = output;
      } else if (Array.isArray(output) && output.length > 0) {
        resultUrl = output[0];
      } else if (typeof output === 'object') {
        // Alguns modelos retornam FileOutput ou objeto com .url
        resultUrl = output.url || output.output || (output.toString ? output.toString() : "");
      }
    }

    if (!resultUrl || resultUrl === "[object Object]") {
      console.log("Erro: Resultado vazio ou inválido.", output);
      return res.status(500).json({
        error: 'O motor de IA não devolveu nenhum resultado utilizável.',
        details: `Tipo: ${typeof output}. Raw: ${JSON.stringify(output)}`,
        debug_status: 500
      });
    }

    console.log("A baixar imagem final do URL:", resultUrl);
    const imageRes = await fetch(resultUrl);
    if (!imageRes.ok) throw new Error("Falha ao capturar imagem final do Replicate.");

    const arrayBuffer = await imageRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return res.status(200).json({
      restoredImage: base64,
      mimeType: "image/jpeg"
    });

  } catch (error: any) {
    console.error("ERRO GERAL NO BACKEND:", error);
    return res.status(500).json({ error: error.message || 'Erro interno' });
  } finally {
    console.log("--- FIM DO PROCESSO ---");
  }
}

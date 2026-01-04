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
      // O campo deve ser exatamente "input_image" para esta versão do DeOldify
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
          console.log("Rate limit atingido. Aguardando 11 segundos...");
          await sleep(11000);
        }

        console.log("Tentativa de Fallback automática...");
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
            error: "Quota insuficiente ou erro persistente na IA.",
            details: fallbackError.message,
            debug_status: fallbackError.status
          });
        }
      } else {
        return res.status(primaryError.status || 500).json({
          error: "O motor de IA encontrou um erro técnico.",
          details: primaryError.message,
          debug_status: primaryError.status
        });
      }
    }

    console.log("Processando resultado (Extracção de URL)...");

    // Extracção ULTRA-robusta do URL para evitar o erro "Failed to parse URL"
    let resultUrl = "";
    if (output) {
      if (typeof output === 'string') {
        resultUrl = output;
      } else if (Array.isArray(output) && output.length > 0) {
        // Se for um array, pegamos o primeiro elemento e tentamos converter para string (link)
        const first = output[0];
        resultUrl = typeof first === 'string' ? first : (first?.url ? String(first.url) : String(first));
      } else if (typeof output === 'object') {
        // Se for um FileOutput ou similar, .url pode ser um objecto URL ou string
        if (output.url) {
          resultUrl = String(output.url);
        } else if (output.toString && typeof output.toString === 'function') {
          const str = output.toString();
          if (str && str.startsWith('http')) {
            resultUrl = str;
          }
        }
      }
    }

    // Se ainda for "[object Object]", tentamos uma última conversão forçada
    if (resultUrl === "[object Object]" || !resultUrl.startsWith('http')) {
      // Se o output em si for o link mas o String() falhou de forma estranha
      if (typeof output === 'object' && output !== null && !resultUrl.startsWith('http')) {
        // Tenta encontrar qualquer string que comece com http dentro do objecto (caso raro)
        for (const key in output) {
          if (typeof output[key] === 'string' && output[key].startsWith('http')) {
            resultUrl = output[key];
            break;
          }
        }
      }
    }

    console.log("Resultado final da extracção de URL:", resultUrl);

    if (!resultUrl || typeof resultUrl !== 'string' || !resultUrl.startsWith('http')) {
      console.log("Erro: Falha grave na extracção do URL.", { outputType: typeof output, outputJson: JSON.stringify(output) });
      return res.status(500).json({
        error: 'O motor de IA não devolveu um URL válido.',
        details: `Raw Output: ${JSON.stringify(output)}`,
        debug_status: 500
      });
    }

    console.log("A baixar imagem final...");
    const imageRes = await fetch(resultUrl);
    if (!imageRes.ok) throw new Error(`Falha ao capturar imagem final do URL: ${resultUrl}`);

    const arrayBuffer = await imageRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return res.status(200).json({
      restoredImage: base64,
      mimeType: "image/jpeg"
    });

  } catch (error: any) {
    console.error("ERRO CRÍTICO NO BACKEND:", error);
    return res.status(500).json({ error: error.message || 'Erro inesperado' });
  } finally {
    console.log("--- FIM DO PROCESSO ---");
  }
}

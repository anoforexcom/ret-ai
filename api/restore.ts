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
    let output;

    try {
      // Tenta o motor original DeOldify (Confirmado pelo utilizador)
      output = await replicate.run(
        "arielreplicate/deoldify_image:0da600fab0c45a66211339f1c16b71345d22f26ef5fea3dca1bb90bb5711e950",
        {
          input: {
            image: `data:image/jpeg;base64,${imageBase64}`,
            model_name: "Artistic",
            render_factor: renderFactor
          }
        }
      );
      console.log("DeOldify finalizou com sucesso.");
    } catch (primaryError: any) {
      console.error("DEBUG: ERRO DETETADO NO MOTOR DEOLDIFY:");
      console.error("Mensagem:", primaryError.message);
      console.error("Status:", primaryError.status);

      // Deteta se o erro é de quota, rate limit ou similar para tentar fallback
      const errorMsg = primaryError.message?.toLowerCase() || "";
      const isQuotaError =
        primaryError.status === 429 ||
        primaryError.status === 402 ||
        errorMsg.includes("quota") ||
        errorMsg.includes("limit") ||
        errorMsg.includes("balance") ||
        errorMsg.includes("credit") ||
        errorMsg.includes("payment required") ||
        errorMsg.includes("429") ||
        errorMsg.includes("402") ||
        errorMsg.includes("free tier") ||
        errorMsg.includes("throttled") ||
        errorMsg.includes("less than $5.0");

      if (isQuotaError) {
        // Se for 429, esperamos o tempo de reset médio (6 RPM = 10s por pedido + margem)
        if (primaryError.status === 429 || errorMsg.includes("throttled")) {
          console.log("Rate limit atingido (429). Aguardando 11 segundos para o bucket recarregar...");
          await sleep(11000);
        }

        console.log("Condição de Quota detetada no Tencentarc. Iniciando Fallback para DeOldify...");
        try {
          output = await replicate.run(
            "arielreplicate/deoldify_image:0da600fab0c45a66211339215a9ad513b75ca55a16c41a3a4bbaf901419730f9",
            {
              input: {
                image: `data:image/jpeg;base64,${imageBase64}`,
                model_name: "Artistic",
                render_factor: renderFactor
              }
            }
          );
          console.log("Sucesso no Fallback!");
        } catch (fallbackError: any) {
          console.error("DEBUG: ERRO NO MOTOR DE FALLBACK (DeOldify):");
          const fErrorStatus = fallbackError.status || fallbackError.response?.status || 429;
          const fErrorMsg = fallbackError.message?.toLowerCase() || "";

          let friendlyError = "A quota total da sua conta Replicate foi atingida ou o saldo é insuficiente.";

          if (fErrorMsg.includes("less than $5.0") || errorMsg.includes("less than $5.0")) {
            friendlyError = "O Replicate ainda reporta saldo baixo ou limite de taxa. Se já carregaste, aguarda 1-2 minutos para o sistema deles atualizar.";
          }

          return res.status(fErrorStatus).json({
            error: friendlyError,
            details: fallbackError.message,
            debug_status: fErrorStatus
          });
        }
      } else {
        // Se for um erro inesperado (ex: auth failed)
        console.log("Erro não relacionado com quota no Tencentarc. Abortando.");
        return res.status(primaryError.status || 500).json({
          error: "O motor de IA encontrou um erro técnico.",
          details: primaryError.message,
          debug_status: primaryError.status
        });
      }
    }

    console.log("Replicate finalizou o processamento.");

    let resultUrl = "";
    if (typeof output === 'string') {
      resultUrl = output;
    } else if (Array.isArray(output)) {
      resultUrl = output[0];
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

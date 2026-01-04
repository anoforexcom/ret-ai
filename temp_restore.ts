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

  const token = process.env.REPLICATE_API_TOKEN;
  console.log("--- IN├ìCIO DO PROCESSO REAL DE COLORIZA├ç├âO ---");
  console.log(`Token Replicate presente: ${token ? 'SIM (Come├ºa com ' + token.substring(0, 4) + '...)' : 'N├âO'}`);

  try {
    const { imageBase64, modelName = "Artistic", renderFactor = 28 } = req.body;

    if (!imageBase64) {
      console.log("Erro: Imagem n├úo fornecida.");
      return res.status(400).json({ error: 'Nenhuma imagem fornecida.' });
    }

    console.log(`Enviando para Replicate... (Modelo: DDColor)`);
    let output;

    try {
      // Tenta o motor DDColor primeiro (Melhor qualidade)
      output = await replicate.run(
        "piddnad/ddcolor:ca494ba129e44e45f661d6ece83c4c98a9a7c774309beca01429b58fce8aa695",
        {
          input: {
            image: `data:image/jpeg;base64,${imageBase64}`,
            model_size: "large"
          }
        }
      );
      console.log("DDColor finalizou com sucesso.");
    } catch (primaryError: any) {
      console.error("DEBUG: ERRO DETETADO NO MOTOR DDColor:");
      console.error("Mensagem:", primaryError.message);
      console.error("Status:", primaryError.status);
      console.error("Objeto de erro completo:", JSON.stringify(primaryError, null, 2));

      // Deteta se o erro ├® de quota, rate limit ou similar para tentar fallback
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
        errorMsg.includes("free tier");

      if (isQuotaError) {
        console.log("Condi├º├úo de Quota detetada. Iniciando Fallback para DeOldify...");
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
          console.error("Mensagem:", fallbackError.message);
          console.error("Status:", fallbackError.status);
          console.error("Objeto completo (Fallback):", JSON.stringify(fallbackError, null, 2));

          return res.status(402).json({
            error: "A quota total da sua conta Replicate foi atingida ou o saldo ├® insuficiente.",
            details: fallbackError.message,
            debug_status: fallbackError.status
          });
        }
      } else {
        // Se for um erro inesperado (ex: auth failed)
        console.log("Erro n├úo relacionado com quota. Abortando.");
        return res.status(primaryError.status || 500).json({
          error: "O motor de IA encontrou um erro t├®cnico.",
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

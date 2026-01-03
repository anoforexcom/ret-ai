import Replicate from "replicate";

export const config = {
  maxDuration: 120,
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  console.log("--- INÍCIO DO PROCESSO REAL DE COLORIZAÇÃO ---");

  try {
    const { imageBase64, modelName = "Artistic", renderFactor = 28 } = req.body;

    if (!imageBase64) {
      console.log("Erro: Imagem não fornecida.");
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
      console.warn("ERRO NO MOTOR DDColor:", primaryError.message);

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
        errorMsg.includes("402");

      if (isQuotaError) {
        console.log("Limite de quota ou erro de créditos no DDColor. Tentando fallback para DeOldify...");
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
          console.log("Fallback para DeOldify concluído com sucesso.");
        } catch (fallbackError: any) {
          console.error("ERRO NO FALLBACK (DeOldify):", fallbackError.message);
          return res.status(402).json({
            error: "A quota total da sua conta Replicate foi atingida ou o saldo é insuficiente. Por favor, carregue a sua conta em replicate.com para continuar a usar o motor de IA.",
            details: fallbackError.message
          });
        }
      } else {
        // Se não for especificamente um erro de quota, tentamos fallback de qualquer forma se for um erro de servidor (5xx)
        if (primaryError.status !== 400 && primaryError.status !== 401) {
          console.log("Erro de servidor no DDColor. Tentando fallback para DeOldify como precaução...");
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
            console.log("Fallback preventivo para DeOldify concluído com sucesso.");
          } catch (fError: any) {
            console.error("ERRO NO FALLBACK PREVENTIVO:", fError.message);
            return res.status(500).json({ error: "O motor de IA encontrou um erro persistente em ambos os modelos. Verifique a consola ou os seus créditos no Replicate." });
          }
        } else {
          return res.status(primaryError.status || 500).json({ error: primaryError.message || 'Erro no processamento' });
        }
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


import { db } from '../firebaseConfig';

/**
 * Envia um e-mail de confirmação de pagamento e agradecimento.
 * Utiliza a extensão 'Trigger Email' do Firebase via coleção 'mail'.
 */
export const sendPaymentConfirmation = async (
    email: string,
    name: string,
    orderId: string,
    amount: number,
    itemLabel: string
) => {
    if (!db) {
        console.warn("⚠️ Firestore não configurado. E-mail não enviado.");
        return;
    }

    try {
        await db.collection('mail').add({
            to: email,
            message: {
                subject: `Confirmação de Pagamento - Encomenda ${orderId} - RetroColor AI`,
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #4f46e5; text-align: center;">Obrigado pelo seu pagamento!</h2>
            <p>Olá <strong>${name}</strong>,</p>
            <p>Confirmamos com sucesso o seu pagamento para a encomenda <strong>${orderId}</strong>.</p>
            
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #64748b;">Detalhes da Encomenda:</h3>
              <p style="margin: 5px 0;"><strong>Serviço:</strong> ${itemLabel}</p>
              <p style="margin: 5px 0;"><strong>Valor Pago:</strong> ${amount.toFixed(2)}€</p>
              <p style="margin: 5px 0;"><strong>Data:</strong> ${new Date().toLocaleDateString('pt-PT')}</p>
            </div>

            <p>A sua memória está a ser processada com o máximo cuidado pela nossa tecnologia RetroColor AI.</p>
            
            <p style="margin-top: 30px;">Se tiver alguma dúvida, não hesite em contactar o nosso suporte respondendo a este e-mail ou via <a href="https://retrocolor.ai/contact" style="color: #4f46e5; text-decoration: none;">nosso site</a>.</p>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">
              &copy; ${new Date().getFullYear()} RetroColor AI. Todos os direitos reservados.
            </p>
          </div>
        `,
            },
        });
        console.log(`✅ E-mail de confirmação agendado para: ${email}`);
    } catch (error) {
        console.error("❌ Erro ao agendar e-mail no Firestore:", error);
    }
};

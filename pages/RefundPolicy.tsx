import React from 'react';

const RefundPolicy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-indigo">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Política de Reembolso</h1>
        
        <p className="text-slate-600 mb-6">
          Última atualização: {new Date().toLocaleDateString('pt-PT')}
        </p>

        <p className="text-slate-600 mb-6">
          Na RetroColor AI, esforçamo-nos para garantir que fica completamente satisfeito com a restauração das suas fotografias. No entanto, compreendemos que por vezes o resultado pode não corresponder às suas expectativas.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Garantia de Satisfação</h2>
        <p className="text-slate-600 mb-4">
          Oferecemos uma garantia de reembolso de 14 dias para todas as compras de restauração de fotos. Se não estiver satisfeito com o resultado final da imagem em alta resolução, pode solicitar o reembolso total do valor pago (4,00 €).
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. Elegibilidade para Reembolso</h2>
        <p className="text-slate-600 mb-4">
          Para ser elegível para um reembolso, a sua situação deve enquadrar-se num dos seguintes critérios:
        </p>
        <ul className="list-disc pl-5 text-slate-600 space-y-2 mb-4">
          <li><strong>Falha Técnica:</strong> Ocorreu um erro ao descarregar a imagem ou o ficheiro está corrompido.</li>
          <li><strong>Qualidade Insuficiente:</strong> A restauração apresenta defeitos visuais graves ou distorções que não eram visíveis na pré-visualização.</li>
          <li><strong>Cobrança Duplicada:</strong> Foi cobrado múltiplas vezes pelo mesmo serviço devido a um erro de processamento.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. Produtos Não Reembolsáveis</h2>
        <p className="text-slate-600 mb-4">
          Não podemos emitir reembolsos nas seguintes situações:
        </p>
        <ul className="list-disc pl-5 text-slate-600 space-y-2 mb-4">
          <li>Se o pedido for feito mais de 14 dias após a compra.</li>
          <li>Se a insatisfação se dever apenas à qualidade da foto original (ex: foto original extremamente desfocada onde a IA não consegue inventar detalhes).</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. Como Solicitar um Reembolso</h2>
        <p className="text-slate-600 mb-4">
          Para iniciar um pedido de reembolso, por favor envie um email para <strong>suporte@retrocolor.ai</strong> com o assunto "Pedido de Reembolso".
        </p>
        <p className="text-slate-600 mb-4">
          Por favor, inclua no email:
        </p>
        <ul className="list-disc pl-5 text-slate-600 space-y-2 mb-4">
          <li>A data da transação.</li>
          <li>O motivo da insatisfação.</li>
          <li>A imagem restaurada (se possível).</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">5. Processamento</h2>
        <p className="text-slate-600 mb-4">
          Assim que o seu pedido for recebido e inspecionado, enviar-lhe-emos um email a notificar a aprovação ou rejeição do reembolso.
        </p>
        <p className="text-slate-600 mb-4">
          Se aprovado, o reembolso será processado e o crédito será aplicado automaticamente no seu cartão de crédito ou método de pagamento original, num prazo de 5 a 10 dias úteis.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;
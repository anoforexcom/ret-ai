import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-indigo">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Termos de Serviço</h1>
        
        <p className="text-slate-600 mb-6">
          Última atualização: {new Date().toLocaleDateString('pt-PT')}
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Aceitação dos Termos</h2>
        <p className="text-slate-600 mb-4">
          Ao aceder e utilizar o RetroColor AI, aceita e concorda em ficar vinculado pelos termos e disposições deste acordo.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. Descrição do Serviço</h2>
        <p className="text-slate-600 mb-4">
          O RetroColor AI fornece um serviço online baseado em inteligência artificial para restauração e colorização de fotografias antigas. O serviço é fornecido "como está" e a qualidade do resultado depende da qualidade da imagem original submetida.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. Pagamentos e Reembolsos</h2>
        <p className="text-slate-600 mb-4">
          O serviço de download da imagem restaurada tem um custo de 4,00 €. O pagamento é processado antes do download da versão em alta resolução sem marca de água.
        </p>
        <p className="text-slate-600 mb-4">
          Se não ficar satisfeito com o resultado devido a uma falha técnica evidente, poderá solicitar o reembolso contactando o nosso suporte no prazo de 14 dias após a compra.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. Conduta do Utilizador</h2>
        <p className="text-slate-600 mb-4">
          Concorda em não usar o serviço para processar imagens que sejam ilegais, ofensivas, pornográficas ou que infrinjam direitos de autor de terceiros. Reservamo-nos o direito de recusar serviço a qualquer pessoa por qualquer motivo a qualquer momento.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">5. Propriedade Intelectual</h2>
        <p className="text-slate-600 mb-4">
          O utilizador mantém todos os direitos sobre as imagens originais que submete. A RetroColor AI não reivindica propriedade sobre o seu conteúdo.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">6. Limitação de Responsabilidade</h2>
        <p className="text-slate-600 mb-4">
          Em caso algum a RetroColor AI será responsável por quaisquer danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou incapacidade de usar o serviço.
        </p>
      </div>
    </div>
  );
};

export default Terms;
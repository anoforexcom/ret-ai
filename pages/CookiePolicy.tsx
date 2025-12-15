import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-indigo">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Política de Cookies</h1>
        
        <p className="text-slate-600 mb-6">
          Última atualização: {new Date().toLocaleDateString('pt-PT')}
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. O que são Cookies?</h2>
        <p className="text-slate-600 mb-4">
          Cookies são pequenos ficheiros de texto que são descarregados para o seu computador ou dispositivo móvel quando visita um site. Eles permitem que o site reconheça o seu dispositivo e armazene algumas informações sobre as suas preferências ou ações passadas.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. Como Usamos os Cookies</h2>
        <p className="text-slate-600 mb-4">
          Na RetroColor AI, utilizamos cookies para melhorar a sua experiência de navegação e garantir o funcionamento correto do nosso serviço de restauração de fotos.
        </p>
        
        <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2">Cookies Essenciais</h3>
        <p className="text-slate-600 mb-4">
          Estes cookies são necessários para que o site funcione e não podem ser desligados nos nossos sistemas. Geralmente, são configurados apenas em resposta a ações feitas por si, como definir as suas preferências de privacidade, iniciar sessão ou preencher formulários (como o processo de pagamento).
        </p>

        <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2">Cookies de Analítica</h3>
        <p className="text-slate-600 mb-4">
          Utilizamos estes cookies para contar visitas e fontes de tráfego, para que possamos medir e melhorar o desempenho do nosso site. Eles ajudam-nos a saber quais são as páginas mais e menos populares e a ver como os visitantes se movimentam pelo site.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. Cookies de Terceiros</h2>
        <p className="text-slate-600 mb-4">
          Podemos utilizar serviços de terceiros confiáveis que também podem configurar cookies no seu dispositivo:
        </p>
        <ul className="list-disc pl-5 text-slate-600 space-y-2 mb-4">
          <li><strong>Processadores de Pagamento:</strong> Para garantir a segurança e processamento das transações.</li>
          <li><strong>Google Analytics:</strong> Para análise estatística de uso do site.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. Gerir as suas Preferências</h2>
        <p className="text-slate-600 mb-4">
          Pode controlar e/ou apagar cookies conforme desejar. Pode apagar todos os cookies que já estão no seu computador e pode configurar a maioria dos browsers para impedir que sejam definidos. No entanto, se o fizer, poderá ter de ajustar manualmente algumas preferências sempre que visitar um site e alguns serviços e funcionalidades (como o download da imagem restaurada) podem não funcionar.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">5. Alterações à Política de Cookies</h2>
        <p className="text-slate-600 mb-4">
          Podemos atualizar esta Política de Cookies periodicamente. Recomendamos que verifique esta página regularmente para se manter informado sobre o nosso uso de cookies.
        </p>
      </div>
    </div>
  );
};

export default CookiePolicy;
import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-indigo">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Política de Privacidade</h1>
        
        <p className="text-slate-600 mb-6">
          Última atualização: {new Date().toLocaleDateString('pt-PT')}
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Introdução</h2>
        <p className="text-slate-600 mb-4">
          A RetroColor AI respeita a sua privacidade e está empenhada em proteger os seus dados pessoais. Esta política de privacidade informá-lo-á sobre como tratamos os seus dados pessoais quando visita o nosso site e utiliza os nossos serviços de restauração de fotos.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. Dados que Recolhemos</h2>
        <p className="text-slate-600 mb-4">
          Podemos recolher, usar, armazenar e transferir diferentes tipos de dados pessoais sobre si, que agrupámos da seguinte forma:
        </p>
        <ul className="list-disc pl-5 text-slate-600 space-y-2 mb-4">
          <li><strong>Dados de Identidade:</strong> inclui nome, apelido, nome de utilizador ou identificador similar.</li>
          <li><strong>Dados de Contacto:</strong> inclui endereço de email.</li>
          <li><strong>Dados de Imagem:</strong> as fotografias que carrega para o serviço.</li>
          <li><strong>Dados de Transação:</strong> detalhes sobre pagamentos de e para si.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. Como Usamos as Suas Fotos</h2>
        <p className="text-slate-600 mb-4">
          As fotos que carrega são usadas <strong>exclusivamente</strong> para o propósito de restauração e colorização através dos nossos algoritmos de IA.
        </p>
        <p className="text-slate-600 mb-4">
          <strong>Retenção de Dados:</strong> As imagens originais e restauradas são armazenadas temporariamente para permitir o download. Elas são automaticamente eliminadas dos nossos servidores após 24 horas. Não usamos as suas fotos para treinar os nossos modelos de IA sem o seu consentimento explícito.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. Segurança de Dados</h2>
        <p className="text-slate-600 mb-4">
          Implementámos medidas de segurança apropriadas para impedir que os seus dados pessoais sejam acidentalmente perdidos, usados ou acedidos de forma não autorizada, alterados ou divulgados.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">5. Os Seus Direitos Legais</h2>
        <p className="text-slate-600 mb-4">
          Sob certas circunstâncias, tem direitos ao abrigo das leis de proteção de dados em relação aos seus dados pessoais, incluindo o direito de solicitar acesso, correção, eliminação, ou transferência dos seus dados pessoais.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">6. Contacto</h2>
        <p className="text-slate-600">
          Se tiver alguma questão sobre esta política de privacidade, por favor contacte-nos através do email: privacy@retrocolor.ai.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
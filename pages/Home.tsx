import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Wand2, Download, Zap, Heart, Shield } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

const Home: React.FC = () => {
  const { config } = useConfig();

  // Helper to highlight part of the text if desired, or just render straight
  // We'll split the title for the gradient effect roughly
  const renderTitle = () => {
    const parts = config.heroTitle.split(' ');
    const half = Math.ceil(parts.length / 2);
    const firstPart = parts.slice(0, half).join(' ');
    const secondPart = parts.slice(half).join(' ');

    return (
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
        {firstPart} <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          {secondPart}
        </span>
      </h1>
    );
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left Column: Text */}
            <div className="flex-1 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 rounded-full px-4 py-1.5 border border-indigo-500/20 mb-8 mx-auto lg:mx-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-sm font-medium text-indigo-300">Nova Tecnologia de IA 2.5 Disponível</span>
              </div>
              
              {renderTitle()}
              
              <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {config.heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/restore" 
                  className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Restaurar Foto Agora
                </Link>
                <Link 
                  to="/faq" 
                  className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700"
                >
                  Saber mais
                </Link>
              </div>
            </div>

            {/* Right Column: Interactive Slider */}
            <div className="flex-1 w-full max-w-lg lg:max-w-xl relative z-10">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800/50 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[3/4]">
                   <BeforeAfterSlider 
                      beforeImage="https://picsum.photos/id/64/800/1066?grayscale" // Girl portrait grayscale
                      afterImage="https://picsum.photos/id/64/800/1066" // Girl portrait color
                      className="h-full"
                   />
                </div>
              </div>
              {/* Decorative elements behind slider */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-cyan-600/30 rounded-full blur-3xl -z-10"></div>
            </div>

          </div>
        </div>

        {/* Global Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Como Funciona</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Três passos simples para a magia acontecer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Carregue a Foto</h3>
              <p className="text-gray-600">
                Arraste a sua foto antiga, riscada ou a preto e branco para a nossa plataforma segura.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-6">
                <Wand2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Processamento IA</h3>
              <p className="text-gray-600">
                A nossa IA avançada remove ruído, arranhões e aplica cores realistas automaticamente.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-6">
                <Download className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Baixe o Resultado</h3>
              <p className="text-gray-600">
                Pré-visualize o resultado instantaneamente e baixe a versão em alta resolução.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison/Example Section (Lion) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0 order-2 lg:order-1">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                Recupere detalhes que pensava estarem perdidos
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                As fotos em papel degradam-se com o tempo. Cores desvanecem, o papel ganha manchas e os rostos perdem definição. 
                <br /><br />
                O <strong>{config.storeName}</strong> não apenas "pinta" a imagem; ele entende o contexto, a iluminação e as texturas para reconstruir a cena original com uma precisão impressionante.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Zap className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900">Rápido e Automático</h4>
                    <p className="text-gray-500">Sem necessidade de conhecimentos de edição. 100% automático.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Heart className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900">Preservação Emocional</h4>
                    <p className="text-gray-500">Mantemos a expressão e a identidade das pessoas nas fotos.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900">Privacidade Garantida</h4>
                    <p className="text-gray-500">As suas fotos são processadas e depois eliminadas dos nossos servidores.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative order-1 lg:order-2">
              {/* Abstract decorative background for image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-cyan-100 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
              
              {/* Lion Comparison Slider */}
              <div className="rounded-2xl shadow-2xl overflow-hidden h-80 md:h-96">
                <BeforeAfterSlider 
                    beforeImage="https://picsum.photos/id/1074/800/600?grayscale" // Lioness grayscale
                    afterImage="https://picsum.photos/id/1074/800/600" // Lioness color
                    className="h-full"
                />
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-sm font-semibold text-gray-800 z-20 flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-indigo-600" />
                Resultado Profissional
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Teaser */}
      <section id="pricing" className="py-20 bg-indigo-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Qualidade de Estúdio por um Preço Simbólico</h2>
          <p className="text-xl text-indigo-200 mb-8">
            Enquanto estúdios tradicionais cobram centenas de euros, nós usamos o poder da IA para oferecer resultados incríveis por apenas o preço de um café.
          </p>
          <div className="inline-block bg-white text-indigo-900 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <span className="block text-sm font-semibold uppercase tracking-wider text-indigo-500 mb-2">Preço Único</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-extrabold">4€</span>
              <span className="text-xl text-gray-500">/foto</span>
            </div>
            <ul className="mt-6 space-y-3 text-left">
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                Alta Resolução
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                Sem Marca d'água
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                Recolorização Avançada
              </li>
            </ul>
            <Link 
              to="/restore"
              className="mt-8 block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Restaurar Agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper icon
function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default Home;
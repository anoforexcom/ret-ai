
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Wand2, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Star, 
  MessageSquare, 
  Plus, 
  Minus, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  History,
  Zap,
  Highlighter,
  Heart
} from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

const Home: React.FC = () => {
  const { config } = useConfig();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const testimonials = config.testimonials || [];
  const activeBundles = config.bundles.filter(b => b.active);

  const homeFaqs = [
    {
      question: "Quanto tempo demora o restauro?",
      answer: "O processamento pela nossa tecnologia RetroColor AI é quase instantâneo. Após carregar a foto, o restauro demora entre 15 a 30 segundos, dependendo da complexidade da imagem."
    },
    {
      question: "As cores são historicamente precisas?",
      answer: "A nossa tecnologia proprietária RetroColor Vision analisa o contexto (ex: tipos de tecido, uniformes militares, vegetação) para aplicar as cores mais realistas possíveis baseadas no nosso vasto banco de dados histórico."
    },
    {
      question: "Como recebo a minha foto?",
      answer: "Após o restauro, pode visualizar uma pré-visualização gratuita. Para baixar em alta definição e sem marcas de água, basta selecionar um pack. O download é imediato após o pagamento."
    },
    {
      question: "Posso imprimir as fotos restauradas?",
      answer: "Sim! O restauro via RetroColor Engine otimiza a nitidez e resolução, tornando as imagens ideais para impressão em álbuns de família ou quadros."
    }
  ];

  const advantages = [
    {
      title: "Cores Naturais e Humanas",
      desc: "O nosso motor RetroColor AI evita o aspeto 'pintado', focando-se em tons de pele naturais e sombras profundas.",
      icon: Heart
    },
    {
      title: "Preservação de Detalhes",
      desc: "Ao contrário de filtros comuns, nós reconstruímos texturas perdidas em tecidos e fundos desfocados.",
      icon: ShieldCheck
    },
    {
      title: "Resolução Ultra HD",
      desc: "Aumentamos a escala da imagem para que possa imprimir em grandes formatos sem perder qualidade.",
      icon: Zap
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Dark Tech Theme */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-950">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -ml-64 -mb-64"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:flex lg:items-center lg:gap-16">
            <div className="lg:flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="h-3 w-3" /> Tecnologia RetroColor AI
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                Dê vida nova às suas <span className="text-indigo-400">fotos antigas</span>
              </h1>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Restaure cores vibrantes, remova danos e preserve as suas memórias mais preciosas com a tecnologia de inteligência artificial RetroColor, desenvolvida para realismo absoluto.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link to="/restore" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-black shadow-2xl shadow-indigo-500/40 transition-all flex items-center gap-2 group">
                  <Upload className="h-5 w-5 group-hover:-translate-y-1 transition-transform" /> COMEÇAR AGORA
                </Link>
                <a href="#precos" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-bold transition-all backdrop-blur-md">
                  Ver Packs de Preço
                </a>
              </div>
            </div>

            <div className="lg:flex-1 mt-16 lg:mt-0 relative">
               <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full scale-75 animate-pulse"></div>
               <div className="rounded-3xl overflow-hidden shadow-2xl border-[10px] border-white/5 relative z-10 h-[450px]">
                  <BeforeAfterSlider 
                    beforeImage="https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1200&sat=-100"
                    afterImage="https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1200"
                    className="h-full"
                  />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white border-b border-slate-100">
         <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
               <div className="group">
                  <div className="bg-slate-50 w-20 h-20 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                     <Wand2 className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Colorização Realista</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">A nossa RetroColor AI analisa o contexto da foto para aplicar tons de pele e ambientes de forma ultra-realista.</p>
               </div>
               <div className="group">
                  <div className="bg-slate-50 w-20 h-20 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                     <Sparkles className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Remoção de Danos</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Elimine riscos físicos, manchas de humidade e vincos que o tempo deixou através do nosso processamento avançado.</p>
               </div>
               <div className="group">
                  <div className="bg-slate-50 w-20 h-20 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                     <Star className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Qualidade Superior</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Otimizamos a nitidez através de redes neurais exclusivas da RetroColor AI para impressões impecáveis.</p>
               </div>
            </div>
         </div>
      </section>

      {/* NEW: Advantages with Interactive Comparison Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Advantages Text */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 leading-tight">
                A tecnologia que o tempo não consegue apagar
              </h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                O RetroColor AI não é apenas um filtro. É um motor de reconstrução digital que entende a história de cada pixel para devolver a alma às suas fotografias.
              </p>
              
              <div className="space-y-8 mb-12">
                <div className="flex gap-5 group">
                  <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <History className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Fidelidade de Época</h4>
                    <p className="text-slate-500 text-sm">O nosso motor identifica vestuário e arquitetura para aplicar tons historicamente coerentes com a data da foto.</p>
                  </div>
                </div>
                
                <div className="flex gap-5 group">
                  <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Highlighter className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Realismo na Pele</h4>
                    <p className="text-slate-500 text-sm">A RetroColor AI utiliza inteligência emocional para reproduzir o calor e as nuances da pele humana em qualquer iluminação.</p>
                  </div>
                </div>

                <div className="flex gap-5 group">
                  <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Proteção de Originais</h4>
                    <p className="text-slate-500 text-sm">Processamento 100% digital e não destrutivo. Os seus ficheiros originais nunca são alterados, apenas transformados em novas cópias HD.</p>
                  </div>
                </div>
              </div>

              <Link to="/restore" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:translate-x-1 transition-all shadow-lg shadow-indigo-500/20">
                Experimentar com a Minha Foto <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Comparison Slider */}
            <div className="order-1 lg:order-2">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[8px] border-white">
                <BeforeAfterSlider 
                  beforeImage="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1200&sat=-100"
                  afterImage="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1200"
                  className="h-[500px]"
                />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full border border-white/50 shadow-lg pointer-events-none z-30">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="h-3 w-3 text-indigo-600 fill-current" /> Arraste para comparar
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section (Bundles) */}
      <section id="precos" className="py-24 bg-indigo-950 scroll-mt-16 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/10 rounded-full blur-[140px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white sm:text-4xl">Packs de Restauro</h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">Escolha o pacote ideal para as suas memórias. Processamento prioritário via RetroColor Engine.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeBundles.map((tier) => (
              <div key={tier.id} className={`relative p-8 rounded-[2rem] border-2 transition-all hover:translate-y-[-8px] flex flex-col ${tier.popular ? 'bg-white border-indigo-600 shadow-2xl shadow-indigo-500/20' : 'bg-indigo-900/40 border-indigo-800/50 hover:border-indigo-500 backdrop-blur-sm'}`}>
                {tier.popular && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase py-1.5 px-4 rounded-full flex items-center gap-1 z-20 shadow-lg">
                    <Star className="h-3 w-3 fill-current" /> O MAIS ESCOLHIDO
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className={`text-lg font-black mb-4 ${tier.popular ? 'text-slate-900' : 'text-white'}`}>{tier.label}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-5xl font-black ${tier.popular ? 'text-slate-900' : 'text-white'}`}>{tier.price}€</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  <li className={`flex items-center text-sm font-bold ${tier.popular ? 'text-slate-700' : 'text-slate-300'}`}><CheckCircle2 className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" /> {tier.photos} {tier.photos === 1 ? 'Foto HD' : 'Fotos HD'}</li>
                  <li className={`flex items-center text-sm ${tier.popular ? 'text-slate-500' : 'text-slate-400'}`}><CheckCircle2 className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" /> Restauro via RetroColor AI</li>
                  <li className={`flex items-center text-sm ${tier.popular ? 'text-slate-500' : 'text-slate-400'}`}><CheckCircle2 className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" /> Download imediato</li>
                </ul>
                <Link to="/restore" className={`block w-full py-4 px-6 rounded-2xl font-black text-center transition-all ${tier.popular ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20' : 'bg-white/5 text-white border-2 border-white/10 hover:bg-white/10 hover:border-indigo-500'}`}>SELECIONAR PACK</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3"><MessageSquare className="h-8 w-8 text-indigo-600" /> Histórias de Sucesso</h2>
              <p className="text-slate-500 mt-2 font-medium">Veja como a nossa RetroColor AI está a emocionar famílias.</p>
            </div>
            <Link to="/testimonials" className="text-indigo-600 font-black flex items-center gap-2 hover:translate-x-1 transition-transform group">Ver todos <ChevronRight className="h-5 w-5" /></Link>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide">
            {testimonials.slice(0, 4).map((t) => (
              <div key={t.id} className="flex-shrink-0 w-80 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />)}</div>
                <p className="text-slate-700 italic text-sm mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">{t.name.charAt(0)}</div>
                  <p className="text-xs font-bold text-slate-900">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm text-indigo-600 mb-4">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Perguntas Frequentes</h2>
            <p className="text-slate-500 mt-2">Tudo o que precisa de saber sobre o restauro RetroColor AI.</p>
          </div>
          
          <div className="space-y-4">
            {homeFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900">{faq.question}</span>
                  {openFaq === idx ? <Minus className="h-5 w-5 text-indigo-600" /> : <Plus className="h-5 w-5 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/faq" className="inline-flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-xl text-indigo-600 font-bold hover:shadow-md transition-all">
              Ver FAQ Completa <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="pb-24 pt-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-indigo-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Pronto para recuperar o passado?</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">Junte-se a milhares de clientes que já redescobriram as suas memórias com a melhor tecnologia de restauração RetroColor AI.</p>
            <Link to="/restore" className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black hover:scale-105 transition-all">RESTAURAR PRIMEIRA FOTO</Link>
          </div>
        </div>
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Home;

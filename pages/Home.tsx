
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
  Zap,
  Brain,
  History,
  Lock,
  Focus
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
      answer: "A nossa tecnologia proprietária RetroColor Vision analisa o contexto para aplicar as cores mais realistas possíveis baseadas no nosso vasto banco de dados histórico."
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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-slate-950 text-white">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
                <Sparkles className="h-3 w-3" /> {config.storeName} Engine v3
              </div>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6">
                {config.heroTitle}
              </h1>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-lg">
                {config.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/restore"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  Restaurar Agora <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="#precos"
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center"
                >
                  Ver Preços
                </a>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="Avatar" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-400 font-medium">
                  Mais de <span className="text-white font-bold">12,000</span> memórias restauradas
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full"></div>
              <div className="relative bg-slate-900 p-2 rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                <BeforeAfterSlider 
                  beforeImage={config.heroBeforeImage || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&sat=-100"}
                  afterImage={config.heroAfterImage || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200"}
                  className="rounded-[2rem] aspect-[4/3]"
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
              <p className="text-slate-500 text-sm leading-relaxed">A nossa IA aplica tons naturais baseados no contexto da foto original.</p>
            </div>
            <div className="group">
              <div className="bg-slate-50 w-20 h-20 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Remoção de Danos</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Elimine riscos, manchas e vincos que o tempo deixou nas suas memórias.</p>
            </div>
            <div className="group">
              <div className="bg-slate-50 w-20 h-20 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Qualidade Garantida</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Otimizamos a nitidez para impressões perfeitas em alta resolução.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section - NEW */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">Vantagens da RetroColor AI</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Tecnologia de ponta ao serviço das suas recordações de família.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">IA Generativa Avançada</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Utilizamos os modelos mais recentes da Google para reconstruir detalhes perdidos com precisão cirúrgica.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <History className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Fidelidade Histórica</h4>
              <p className="text-sm text-slate-500 leading-relaxed">As nossas cores são ajustadas para corresponder aos tons e pigmentos da época em que a foto foi tirada.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Focus className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Super Resolução</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Não apenas colorimos; aumentamos a resolução para que possa imprimir as suas fotos em tamanhos maiores.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Lock className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Privacidade Total</h4>
              <p className="text-sm text-slate-500 leading-relaxed">O processamento é feito com chaves de segurança e as imagens são apagadas automaticamente após o download.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-24 bg-slate-950 scroll-mt-16 text-white relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Packs de Restauro</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Escolha o pacote ideal para as suas fotografias com garantia de satisfação.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeBundles.map((tier) => (
              <div key={tier.id} className={`relative p-8 rounded-[2.5rem] border-2 transition-all hover:translate-y-[-8px] flex flex-col ${tier.popular ? 'bg-slate-900 border-indigo-500 shadow-2xl shadow-indigo-500/10' : 'bg-slate-900/50 border-white/5 backdrop-blur-sm'}`}>
                {tier.popular && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase py-2 px-5 rounded-full flex items-center gap-2 z-20 shadow-lg border border-indigo-400/50">
                    <Star className="h-3 w-3 fill-current" /> MAIS ESCOLHIDO
                  </div>
                )}
                <div className="text-center mb-10">
                  <h3 className="text-xl font-bold text-white mb-6 opacity-80">{tier.label}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-black text-white">{tier.price}€</span>
                  </div>
                </div>
                <ul className="space-y-5 mb-12 flex-grow">
                  <li className="flex items-center text-sm font-bold text-slate-200">
                    <CheckCircle2 className="h-6 w-6 text-indigo-400 mr-4 flex-shrink-0" /> {tier.photos} {tier.photos === 1 ? 'Foto HD' : 'Fotos HD'}
                  </li>
                  <li className="flex items-center text-sm text-slate-400">
                    <CheckCircle2 className="h-6 w-6 text-indigo-400 mr-4 flex-shrink-0" /> Restauro RetroColor AI
                  </li>
                  <li className="flex items-center text-sm text-slate-400">
                    <CheckCircle2 className="h-6 w-6 text-indigo-400 mr-4 flex-shrink-0" /> Download imediato
                  </li>
                  <li className="flex items-center text-sm text-slate-400">
                    <CheckCircle2 className="h-6 w-6 text-indigo-400 mr-4 flex-shrink-0" /> Alta Resolução 1K
                  </li>
                </ul>
                <Link 
                  to="/restore" 
                  className={`block w-full py-4 px-6 rounded-2xl font-black text-center transition-all ${
                    tier.popular 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  SELECIONAR
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second Comparison Section - NEW */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-cyan-500/10 blur-3xl rounded-full"></div>
              <div className="relative bg-slate-50 p-2 rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
                <BeforeAfterSlider 
                  beforeImage="https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=800&auto=format&fit=crop&sat=-100"
                  afterImage="https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=800&auto=format&fit=crop"
                  className="rounded-[2rem] aspect-[4/3]"
                />
              </div>
            </div>
            <div className="mb-12 lg:mb-0 order-1 lg:order-2">
              <h2 className="text-3xl font-black text-slate-900 sm:text-4xl mb-6">Resultados que Contam Histórias</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Repare como a nossa IA não apenas adiciona cor, mas reconstrói a textura do papel e limpa as imperfeições causadas por décadas de armazenamento inadequado.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-600 rounded-full p-1"><CheckCircle2 className="h-4 w-4 text-white" /></div>
                  <p className="text-sm font-bold text-slate-700">Limpeza profunda de manchas e riscos</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-600 rounded-full p-1"><CheckCircle2 className="h-4 w-4 text-white" /></div>
                  <p className="text-sm font-bold text-slate-700">Equilíbrio de luz e contraste automático</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-600 rounded-full p-1"><CheckCircle2 className="h-4 w-4 text-white" /></div>
                  <p className="text-sm font-bold text-slate-700">Nitidez facial aprimorada para retratos</p>
                </li>
              </ul>
              <Link
                to="/restore"
                className="inline-flex items-center gap-2 text-indigo-600 font-black hover:translate-x-2 transition-transform"
              >
                Experimentar com as minhas fotos <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials with Horizontal Scroll (Moved before FAQ) */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-indigo-600" /> O que dizem os clientes
              </h2>
              <p className="text-slate-500 mt-2 font-medium">Veja as opiniões de {testimonials.length} clientes satisfeitos.</p>
            </div>
            <Link to="/testimonials" className="text-indigo-600 font-black flex items-center gap-2 hover:translate-x-1 transition-transform group">Ver todos <ChevronRight className="h-5 w-5" /></Link>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide">
            {testimonials.map((t) => (
              <div key={t.id} className="flex-shrink-0 w-80 bg-white p-8 rounded-[2rem] border border-slate-100 snap-center shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 italic text-sm mb-6 leading-relaxed line-clamp-3">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">Dúvidas Frequentes</h2>
          <div className="space-y-4">
            {homeFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900">{faq.question}</span>
                  {openFaq === idx ? <Minus className="h-5 w-5 text-indigo-600" /> : <Plus className="h-5 w-5 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;

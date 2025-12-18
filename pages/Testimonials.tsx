
import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { Star, Quote, MessageSquare } from 'lucide-react';

const Testimonials: React.FC = () => {
  const { config } = useConfig();

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-full mb-4">
             <MessageSquare className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Testemunhos dos Clientes</h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Milhares de memórias restauradas e famílias emocionadas. Veja o que dizem sobre o RetroColor AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {config.testimonials.map((t) => (
            <div key={t.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative group flex flex-col h-full">
              <Quote className="absolute top-6 right-6 h-10 w-10 text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < t.rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} 
                  />
                ))}
              </div>

              <p className="text-slate-700 text-lg mb-8 italic flex-1">"{t.text}"</p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-lg shadow-inner">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{t.location} • {new Date(t.date).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-indigo-600 rounded-3xl p-10 text-center text-white shadow-xl shadow-indigo-500/20">
          <h2 className="text-3xl font-bold mb-4">Pronto para restaurar a sua história?</h2>
          <p className="text-indigo-100 mb-8 max-w-lg mx-auto">
            Junte-se a milhares de clientes satisfeitos e dê uma nova vida às suas fotos hoje mesmo.
          </p>
          <a 
            href="/#/restore" 
            className="inline-block bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Começar Agora
          </a>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

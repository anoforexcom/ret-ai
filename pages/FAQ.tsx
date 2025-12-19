
import React from 'react';
import { FaqItem } from '../types';
import { Plus, Minus } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "Como funciona a tecnologia de recolorização?",
      answer: "Utilizamos o motor de Inteligência Artificial RetroColor AI, desenvolvido por nós e treinado em milhões de fotos históricas e modernas. A nossa tecnologia analisa as formas, texturas e contexto da sua imagem para prever as cores mais prováveis para cada elemento, como pele, roupas e paisagens."
    },
    {
      question: "O pagamento é seguro?",
      answer: "Sim, absolutamente. Utilizamos processadores de pagamento certificados com encriptação SSL de nível bancário. Não armazenamos os dados do seu cartão de crédito nos nossos servidores."
    },
    {
      question: "O que acontece às minhas fotos?",
      answer: "A sua privacidade é a nossa prioridade. As fotos são processadas localmente pelo motor RetroColor AI e são eliminadas automaticamente dos nossos servidores após 24 horas. Nunca usamos as suas fotos para treinar os nossos modelos sem o seu consentimento."
    },
    {
      question: "Posso restaurar fotos muito danificadas?",
      answer: "A RetroColor AI é excelente a remover riscos, ruído e manchas. No entanto, se partes faciais críticas estiverem completamente em falta, o motor tentará reconstruir com base na simetria e padrões anatómicos conhecidos."
    },
    {
      question: "Qual o tamanho máximo do ficheiro?",
      answer: "Atualmente o RetroColor Engine suporta ficheiros JPG e PNG até 5MB. Para ficheiros maiores, o motor pode demorar mais tempo a processar."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-12">Perguntas Frequentes</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none bg-white hover:bg-slate-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-slate-900">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="h-5 w-5 text-indigo-600" />
                ) : (
                  <Plus className="h-5 w-5 text-slate-400" />
                )}
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;

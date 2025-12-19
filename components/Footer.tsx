
import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Lock } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const Footer: React.FC = () => {
  const { config } = useConfig();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Wand2 className="h-6 w-6 text-indigo-400" />
              <span className="font-bold text-lg text-white">{config.storeName}</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              {config.footerText}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Produto</h3>
            <ul className="space-y-3">
              <li><Link to="/restore" className="text-sm hover:text-white transition-colors">Restaurar Foto</Link></li>
              <li><Link to="/pricing" className="text-sm hover:text-white transition-colors">Preços</Link></li>
              <li><Link to="/faq" className="text-sm hover:text-white transition-colors">Perguntas Frequentes</Link></li>
              <li><Link to="/testimonials" className="text-sm hover:text-white transition-colors">Testemunhos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              {config.footerMenu.map((link) => (
                <li key={link.id}>
                    <Link to={link.path} className="text-sm hover:text-white transition-colors">
                        {link.label}
                    </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Suporte</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-sm hover:text-white transition-colors">Contactar Suporte</Link></li>
              <li>
                <Link to="/admin" className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-indigo-400 transition-colors pt-4">
                  <Lock className="h-3 w-3" /> Acesso Administrativo
                </Link>
              </li>
            </ul>
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                Pagamento seguro via:
                </p>
                <div className="flex flex-wrap items-center gap-2 text-slate-500">
                  {config.paymentMethods.filter(m => m.enabled).map(m => (
                      <span key={m.id} className="text-xs border border-slate-700 px-2 py-1 rounded">{m.name}</span>
                  ))}
                  {config.paymentMethods.every(m => !m.enabled) && (
                      <span className="text-xs border border-slate-700 px-2 py-1 rounded">SSL Seguro</span>
                  )}
                </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {config.storeName}. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link to="/admin" className="text-xs text-slate-600 hover:text-indigo-500">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Lock, Wallet } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { config } = useConfig();
  const { t } = useTranslation();

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
              {t('footer.text')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">{t('footer.product')}</h3>
            <ul className="space-y-3">
              <li><Link to="/restore" className="text-sm hover:text-white transition-colors">{t('footer.restore')}</Link></li>
              <li><Link to="/pricing" className="text-sm hover:text-white transition-colors">{t('footer.pricing')}</Link></li>
              <li><Link to="/faq" className="text-sm hover:text-white transition-colors">{t('footer.faq')}</Link></li>
              <li><Link to="/testimonials" className="text-sm hover:text-white transition-colors">{t('footer.testimonials')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-3">
              {config.footerMenu.map((link) => {
                let label = link.label;

                // Translation mapping for footer links
                if (link.id === '1') label = t('footer.privacy'); // ID 1 is Privacy
                else if (link.id === '2') label = t('footer.terms'); // ID 2 is Terms
                else if (link.id === 'faq_footer') label = t('footer.faq');
                else if (link.id === 'contact_footer') label = t('footer.support'); // Using 'support' label or we could use 'contact'

                return (
                  <li key={link.id}>
                    <Link to={link.path} className="text-sm hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">{t('footer.support')}</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-sm hover:text-white transition-colors">{t('footer.contact')}</Link></li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-slate-400 mb-2">
                {t('footer.secure_payment')}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-slate-500">
                {config.paymentMethods.filter(m => m.enabled).map(m => {
                  if (m.id === 'cc_stripe') {
                    return (
                      <div key={m.id} className="flex gap-2" title={m.name}>
                        {/* Visa */}
                        <div className="h-8 w-12 bg-white rounded flex items-center justify-center p-1">
                          <svg viewBox="0 0 36 12" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.464 0.44397L10.088 11.528H6.55203L3.99203 2.656C3.84803 1.944 3.73603 1.632 3.23203 1.344C2.08003 0.720001 0.992026 0.504 0.160026 0.328L0.288026 0H5.56003C6.30403 0 7.00803 0.567999 7.17603 1.576L8.52803 8.872L13.12 0.44397H15.464ZM23.448 8.136C23.472 5.064 19.344 4.896 19.416 3.528C19.44 3.12 19.824 2.712 20.832 2.624C21.36 2.576 22.776 2.50397 24.312 3.24L24.792 1.056C24.12 0.816001 23.28 0.551971 22.224 0.551971C19.536 0.551971 17.616 2.016 17.592 4.128C17.568 5.64 18.912 6.504 19.92 7.008C20.952 7.536 21.288 7.848 21.288 8.352C21.288 9.144 20.376 9.48 19.512 9.504C18.576 9.528 17.064 9.24 16.2 8.808L15.696 11.088C16.344 11.4 17.568 11.664 18.816 11.688C21.648 11.688 23.448 10.248 23.448 8.136ZM30.432 0.44397H27.648C26.88 0.44397 26.256 0.683971 25.968 1.44L22.2 11.528H25.032L25.608 9.84H28.848L29.184 11.528H31.848L30.432 0.44397ZM26.352 7.824L27.744 3.79199L28.536 7.824H26.352ZM36.0001 0.44397H33.3601L31.0081 11.528H33.5281L36.0001 0.44397Z" fill="#1A1F70" />
                          </svg>
                        </div>
                        {/* Mastercard */}
                        <div className="h-8 w-12 bg-white rounded flex items-center justify-center p-1">
                          <svg viewBox="0 0 24 15" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="15" fill="#1A1F70" />
                            <circle cx="7.7" cy="7.5" r="5.7" fill="#EB001B" />
                            <circle cx="16.3" cy="7.5" r="5.7" fill="#F79E1B" />
                            <path d="M12 11.16C10.74 11.16 9.57602 10.74 8.64002 10.02C8.04002 9.24 7.68002 8.4 7.68002 7.5C7.68002 6.6 8.04002 5.76 8.64002 4.98C9.57602 4.26 10.74 3.84 12 3.84C13.26 3.84 14.424 4.26 15.36 4.98C15.96 5.76 16.32 6.6 16.32 7.5C16.32 8.4 15.96 9.24 15.36 10.02C14.424 10.74 13.26 11.16 12 11.16Z" fill="#FF5F00" />
                          </svg>
                        </div>
                      </div>
                    );
                  } else if (m.id === 'mbway_sibs') {
                    return (
                      <div key={m.id} className="h-8 w-14 bg-white rounded flex items-center justify-center p-1" title={m.name}>
                        <span className="font-extrabold text-[#E33333] tracking-tighter italic text-xs leading-none" style={{ transform: 'skewX(-10deg)' }}>MB WAY</span>
                      </div>
                    );
                  } else if (m.id === 'internal_balance') {
                    return (
                      <div key={m.id} className="h-8 w-12 bg-indigo-600 rounded flex items-center justify-center p-1 relative overflow-hidden" title={m.name}>
                        <Wallet className="h-5 w-5 text-indigo-200" />
                        <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-indigo-700"></div>
                      </div>
                    );
                  }
                  return (
                    <span key={m.id} className="text-xs border border-slate-700 px-2 py-1 rounded">{m.name}</span>
                  );
                })}
                {config.paymentMethods.every(m => !m.enabled) && (
                  <span className="text-xs border border-slate-700 px-2 py-1 rounded">{t('footer.ssl_secure')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {config.storeName}. {t('footer.rights_reserved')}
          </p>
          <div className="flex items-center gap-6">
            {config.socialLinks?.facebook && (
              <a href={config.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-400 transition-all hover:scale-110">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}
            {config.socialLinks?.instagram && (
              <a href={config.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-400 transition-all hover:scale-110">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}
            {config.socialLinks?.tiktok && (
              <a href={config.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-400 transition-all hover:scale-110">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.75.42-1.24 1.25-1.33 2.1-.05.82.02 1.68.4 2.43.34.61.94 1.11 1.6 1.38.65.29 1.38.35 2.08.26 1.12-.17 2.04-.97 2.46-2.02.24-.48.33-1.01.35-1.54.01-1.57.01-3.14.01-4.71 0-3.37 0-6.74-.01-10.11z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

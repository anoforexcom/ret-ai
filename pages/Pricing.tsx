
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Star, Zap, Shield, Heart } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { useTranslation } from 'react-i18next';

const Pricing: React.FC = () => {
  const { config } = useConfig();
  const activeBundles = config.bundles.filter(b => b.active);
  const { t } = useTranslation();

  return (
    <div className="bg-slate-50 min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">{t('pricing.title')}</h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {activeBundles.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white p-8 rounded-3xl shadow-sm border-2 transition-all hover:shadow-xl ${tier.popular ? 'border-indigo-600 scale-105' : 'border-slate-100 hover:border-slate-200'
                }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold uppercase py-1 px-4 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" /> {t('pricing.popular_badge')}
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.label}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold text-slate-900">{tier.price}€</span>
                  <span className="text-slate-500 font-medium">{t('pricing.per_total')}</span>
                </div>
                {tier.savings && (
                  <p className="mt-2 text-green-600 font-bold text-sm bg-green-50 py-1 px-3 rounded-full inline-block">
                    {tier.savings}
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                  <span className="font-semibold">{tier.photos} {tier.photos === 1 ? t('pricing.features.photos_one') : t('pricing.features.photos_many')}</span>
                </li>
                <li className="flex items-center text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                  {t('pricing.features.scratches')}
                </li>
                <li className="flex items-center text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                  {t('pricing.features.colorize')}
                </li>
                <li className="flex items-center text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                  {t('pricing.features.watermark')}
                </li>
                <li className="flex items-center text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                  {t('pricing.features.lifetime')}
                </li>
              </ul>

              <Link
                to="/restore"
                className={`block w-full py-4 px-6 rounded-2xl font-bold text-center transition-all ${tier.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
              >
                {t('pricing.btn_choose')} {tier.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center py-16 border-t border-slate-200">
          <div>
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">{t('pricing.props.secure.title')}</h4>
            <p className="text-sm text-slate-500">{t('pricing.props.secure.desc')}</p>
          </div>
          <div>
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">{t('pricing.props.download.title')}</h4>
            <p className="text-sm text-slate-500">{t('pricing.props.download.desc')}</p>
          </div>
          <div>
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-indigo-600" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">{t('pricing.props.guarantee.title')}</h4>
            <p className="text-sm text-slate-500">{t('pricing.props.guarantee.desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

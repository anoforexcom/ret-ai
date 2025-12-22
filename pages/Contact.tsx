import React, { useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900">{t('contact.title')}</h1>
          <p className="mt-4 text-lg text-slate-600">
            {t('contact.subtitle')}
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-900">{t('contact.success.title')}</h3>
            <p className="mt-2 text-green-600">
              {t('contact.success.message')}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 text-sm font-medium text-green-700 hover:text-green-800 underline"
            >
              {t('contact.success.btn')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">{t('contact.form.name')}</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t('contact.form.name_placeholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">{t('contact.form.email')}</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t('contact.form.email_placeholder')}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700">{t('contact.form.message')}</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t('contact.form.message_placeholder')}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              {t('contact.form.submit')}
            </button>
          </form>
        )}

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <Mail className="h-6 w-6 text-indigo-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-slate-900">Email</p>
              <p className="text-sm text-slate-500">suporte@retrocolor.ai</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <MessageSquare className="h-6 w-6 text-indigo-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-slate-900">{t('contact.info.chat')}</p>
              <p className="text-sm text-slate-500">{t('contact.info.chat_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
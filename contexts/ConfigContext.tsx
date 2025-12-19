
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreConfig, Order, NavigationLink, ProductBundle, AuditLog, Testimonial, Expense, ThemeConfig, PaymentMethod, StoreMember, CustomerAccount } from '../types';

interface ConfigContextType {
  config: StoreConfig;
  orders: Order[];
  auditLogs: AuditLog[];
  updateConfig: (newConfig: Partial<StoreConfig>) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, status: Order['status']) => void;
  addAuditLog: (action: string, details: string) => void;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  currentCustomer: CustomerAccount | null;
  customerLogin: (email: string) => boolean;
  customerLogout: () => void;
  registerCustomer: (customer: Omit<CustomerAccount, 'id' | 'balance' | 'createdAt'>) => CustomerAccount;
  updateCustomerBalance: (customerId: string, amount: number) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const defaultBundles: ProductBundle[] = [
  { id: 'recolor_1', photos: 1, price: 4, label: 'Colorização Individual', active: true },
  { id: 'recolor_5', photos: 5, price: 15, label: 'Pack Familiar (5 Fotos)', savings: 'Poupe 5€', popular: true, active: true },
  { id: 'recolor_10', photos: 10, price: 25, label: 'Pack Arquivo (10 Fotos)', savings: 'Poupe 15€', active: true },
];

const defaultTestimonials: Testimonial[] = [
  { id: 't1', name: 'António Ferreira', location: 'Porto, PT', text: 'Restaurei as fotos de casamento dos meus pais. O resultado foi emocionante, as cores parecem tão naturais!', rating: 5, date: '2024-03-15' },
  { id: 't2', name: 'Marta Rodrigues', location: 'Lisboa, PT', text: 'Serviço rápido e de qualidade incrível. Recomendo vivamente para quem quer preservar memórias de família.', rating: 5, date: '2024-04-02' },
  { id: 't3', name: 'João Pires', location: 'Coimbra, PT', text: 'A nitidez que a IA conseguiu recuperar numa foto de 1950 é simplesmente inexplicável. Nota 10!', rating: 5, date: '2024-04-10' },
  { id: 't4', name: 'Beatriz Santos', location: 'Braga, PT', text: 'O processo é muito simples e o download é imediato. Vale cada cêntimo pela emoção de ver os meus avós a cores.', rating: 5, date: '2024-04-12' },
  { id: 't5', name: 'Ricardo Costa', location: 'Faro, PT', text: 'Tentei outros sites mas este é o único que não deixa a pele com aspeto artificial. Muito bom.', rating: 4, date: '2024-04-15' },
  { id: 't6', name: 'Sofia Oliveira', location: 'Funchal, PT', text: 'O apoio ao cliente foi impecável quando tive uma dúvida sobre o formato do ficheiro. Recomendo!', rating: 5, date: '2024-04-18' },
  { id: 't7', name: 'Manuel Silva', location: 'Ponta Delgada, PT', text: 'Recuperei uma foto histórica da nossa freguesia. A comunidade ficou impressionada com o realismo.', rating: 5, date: '2024-04-20' },
  { id: 't8', name: 'Helena Matos', location: 'Aveiro, PT', text: 'As cores da roupa na foto restaurada batem certo com o que a minha mãe se lembrava. Incrível!', rating: 5, date: '2024-04-22' },
  { id: 't9', name: 'Vítor Pereira', location: 'Viseu, PT', text: 'Rápido, eficaz e muito profissional. O site é intuitivo e funciona bem no telemóvel.', rating: 5, date: '2024-04-25' },
  { id: 't10', name: 'Luísa Gomes', location: 'Setúbal, PT', text: 'Um presente perfeito para o aniversário do meu pai. Ele chorou ao ver as fotos da sua juventude restauradas.', rating: 5, date: '2024-04-28' }
];

const defaultStats: StoreConfig = {
  storeName: 'RetroColor AI',
  adminPassword: 'admin',
  heroTitle: 'Dê cor às suas memórias mais queridas',
  heroSubtitle: 'Restaure fotos antigas e colorize imagens a preto e branco em segundos com a nossa tecnologia proprietária RetroColor AI.',
  footerText: 'Recupere o passado com cores vibrantes. Especialistas em restauração digital por RetroColor AI Engine.',
  mainMenu: [
    { id: '1', label: 'Início', path: '/' },
    { id: '2', label: 'Restaurar', path: '/restore' },
    { id: 'precos', label: 'Preços', path: '/pricing' },
    { id: 'faq_nav', label: 'FAQ', path: '/faq' },
    { id: 'contact_nav', label: 'Contacto', path: '/contact' },
  ],
  footerMenu: [
    { id: '1', label: 'Privacidade', path: '/privacy' },
    { id: '2', label: 'Termos', path: '/terms' },
    { id: 'faq_footer', label: 'Perguntas Frequentes', path: '/faq' },
    { id: 'contact_footer', label: 'Suporte', path: '/contact' },
  ],
  paymentMethods: [
    { id: 'cc_stripe', name: 'Cartão de Crédito', enabled: true, type: 'card', provider: 'stripe', environment: 'sandbox' },
    { id: 'mbway_sibs', name: 'MB Way', enabled: true, type: 'mbway', provider: 'sibs', environment: 'sandbox' },
    { id: 'internal_balance', name: 'Saldo da Conta', enabled: true, type: 'balance', provider: 'internal' },
  ],
  bundles: defaultBundles,
  testimonials: defaultTestimonials,
  expenses: [],
  members: [],
  customers: [],
  apiKeys: {},
  theme: {
    primaryColor: '#4f46e5',
    secondaryColor: '#06b6d4',
    borderRadius: '8px',
    fontFamily: 'Inter'
  }
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('retro_v10_config');
    return saved ? JSON.parse(saved) : defaultStats;
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<CustomerAccount | null>(null);

  useEffect(() => localStorage.setItem('retro_v10_config', JSON.stringify(config)), [config]);

  const updateConfig = (newConfig: Partial<StoreConfig>) => setConfig(prev => ({ ...prev, ...newConfig }));
  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);
  const updateOrder = (id: string, status: Order['status']) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  const addAuditLog = (action: string, details: string) => setAuditLogs(prev => [{ id: Date.now().toString(), action, details, date: new Date().toISOString(), user: 'Admin' }, ...prev]);
  
  const customerLogin = (email: string) => {
    const c = config.customers.find(x => x.email.toLowerCase() === email.toLowerCase());
    if (c) { setCurrentCustomer(c); return true; }
    return false;
  };
  const customerLogout = () => setCurrentCustomer(null);
  const registerCustomer = (data: any) => {
    const newC = { ...data, id: `C-${Date.now()}`, balance: 0, createdAt: new Date().toISOString() };
    updateConfig({ customers: [...config.customers, newC] });
    setCurrentCustomer(newC);
    return newC;
  };
  const updateCustomerBalance = (id: string, amount: number) => {
    const updated = config.customers.map(c => c.id === id ? { ...c, balance: c.balance + amount } : c);
    updateConfig({ customers: updated });
    if (currentCustomer?.id === id) setCurrentCustomer(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
  };

  return (
    <ConfigContext.Provider value={{ 
      config, orders, auditLogs, updateConfig, addOrder, updateOrder, addAuditLog, isAdmin, login: () => setIsAdmin(true), logout: () => setIsAdmin(false),
      currentCustomer, customerLogin, customerLogout, registerCustomer, updateCustomerBalance
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within a ConfigProvider');
  return context;
};

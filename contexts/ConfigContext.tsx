
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreConfig, Order, NavigationLink, ProductBundle, AuditLog, Testimonial, Expense, ThemeConfig, PaymentMethod, StoreMember, CustomerAccount } from '../types';
import { auth, db } from '../firebaseConfig';

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
  customerLogin: (email: string, password?: string) => { success: boolean, message: string };
  customerLogout: () => void;
  registerCustomer: (customer: Omit<CustomerAccount, 'id' | 'balance' | 'createdAt'>) => CustomerAccount;
  updateCustomerBalance: (customerId: string, amount: number) => void;
  updateCustomerPassword: (customerId: string, newPassword: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const defaultBundles: ProductBundle[] = [
  { id: 'recolor_1', photos: 1, price: 4, label: 'Colorização Individual', active: true },
  { id: 'recolor_5', photos: 5, price: 15, label: 'Pack Familiar (5 Fotos)', savings: 'Poupe 5€', popular: true, active: true },
  { id: 'recolor_10', photos: 10, price: 25, label: 'Pack Arquivo (10 Fotos)', savings: 'Poupe 15€', active: true },
];

const defaultTestimonials: Testimonial[] = [
  { id: 't1', name: 'António Ferreira', location: 'Porto, PT', text: 'Restaurei as fotos de casamento dos meus pais. O resultado foi emocionante, as cores parecem tão naturais!', rating: 5, date: '2024-03-15' },
  { id: 't2', name: 'Marta Rodrigues', location: 'Lisboa, PT', text: 'Serviço rápido e de qualidade incrível. Recomendo vivamente para quem quer preservar memórias de família.', rating: 5, date: '2024-04-02' }
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
  
  const customerLogin = (email: string, password?: string) => {
    const customer = config.customers.find(x => x.email.toLowerCase() === email.toLowerCase());
    
    if (!customer) {
      return { success: false, message: "Utilizador não encontrado." };
    }

    // Se houver password na conta, validar. Se não houver (contas antigas), permitir login e pedir para definir
    if (customer.password && customer.password !== password) {
      return { success: false, message: "Palavra-passe incorreta." };
    }

    setCurrentCustomer(customer);
    return { success: true, message: "Login efetuado." };
  };

  const customerLogout = () => setCurrentCustomer(null);

  const registerCustomer = (data: any) => {
    const newC: CustomerAccount = { 
      ...data, 
      id: `C-${Date.now()}`, 
      balance: 0, 
      createdAt: new Date().toISOString(),
      password: data.password || '123456' // Default password se não fornecida
    };
    updateConfig({ customers: [...config.customers, newC] });
    setCurrentCustomer(newC);
    return newC;
  };

  const updateCustomerBalance = (id: string, amount: number) => {
    const updated = config.customers.map(c => c.id === id ? { ...c, balance: c.balance + amount } : c);
    updateConfig({ customers: updated });
    if (currentCustomer?.id === id) setCurrentCustomer(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
  };

  const updateCustomerPassword = (id: string, newPassword: string) => {
    const updated = config.customers.map(c => c.id === id ? { ...c, password: newPassword } : c);
    updateConfig({ customers: updated });
    if (currentCustomer?.id === id) setCurrentCustomer(prev => prev ? { ...prev, password: newPassword } : null);
    addAuditLog('Alteração Password Cliente', `Cliente ID: ${id}`);
  };

  return (
    <ConfigContext.Provider value={{ 
      config, orders, auditLogs, updateConfig, addOrder, updateOrder, addAuditLog, isAdmin, login: () => setIsAdmin(true), logout: () => setIsAdmin(false),
      currentCustomer, customerLogin, customerLogout, registerCustomer, updateCustomerBalance, updateCustomerPassword
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

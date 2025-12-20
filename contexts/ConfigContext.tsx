
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreConfig, Order, NavigationLink, ProductBundle, AuditLog, Testimonial, Expense, ThemeConfig, PaymentMethod, StoreMember, CustomerAccount } from '../types';
import { db, auth, storage, isConfigured } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection, onSnapshot, addDoc, updateDoc, query, orderBy, limit } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

interface ConfigContextType {
  config: StoreConfig;
  orders: Order[];
  auditLogs: AuditLog[];
  updateConfig: (newConfig: Partial<StoreConfig>) => void;
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (id: string, status: Order['status']) => void;
  addAuditLog: (action: string, details: string) => void;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  currentCustomer: CustomerAccount | null;
  customerLogin: (email: string, password?: string) => { success: boolean, message: string };
  customerLogout: () => void;
  registerCustomer: (customer: Omit<CustomerAccount, 'id' | 'balance' | 'createdAt'>) => Promise<CustomerAccount>;
  updateCustomerBalance: (customerId: string, amount: number) => void;
  updateCustomerPassword: (customerId: string, newPassword: string) => void;
  isCloudActive: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const defaultStats: StoreConfig = {
  storeName: 'RetroColor AI',
  adminPassword: 'admin',
  heroTitle: 'Dê cor às suas memórias mais queridas',
  heroSubtitle: 'Restaure fotos antigas e colorize imagens a preto e branco em segundos com a nossa tecnologia proprietária RetroColor AI.',
  footerText: 'Recupere o passado com cores vibrantes.',
  mainMenu: [
    { id: '1', label: 'Início', path: '/' },
    { id: '2', label: 'Restaurar', path: '/restore' },
    { id: 'precos', label: 'Preços', path: '/pricing' }
  ],
  footerMenu: [],
  paymentMethods: [
    { id: 'cc_stripe', name: 'Cartão de Crédito', enabled: true, type: 'card', provider: 'stripe' },
    { id: 'internal_balance', name: 'Saldo da Conta', enabled: true, type: 'balance', provider: 'internal' }
  ],
  bundles: [
    { id: 'recolor_1', photos: 1, price: 4, label: 'Individual', active: true },
    { id: 'recolor_5', photos: 5, price: 15, label: 'Pack 5', popular: true, active: true }
  ],
  testimonials: [],
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
  const [config, setConfig] = useState<StoreConfig>(defaultStats);
  const [orders, setOrders] = useState<Order[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [customers, setCustomers] = useState<CustomerAccount[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<CustomerAccount | null>(null);

  // 1. Sincronização Global de Configurações
  useEffect(() => {
    if (!db) return;
    const unsubscribe = onSnapshot(doc(db, 'settings', 'store_config'), (snap) => {
      if (snap.exists()) setConfig(snap.data() as StoreConfig);
    });
    return () => unsubscribe();
  }, []);

  // 2. Sincronização de Encomendas (Fotos e Dados)
  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'orders'), orderBy('date', 'desc'), limit(100));
    return onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ ...d.data(), id: d.id } as Order)));
    });
  }, []);

  // 3. Sincronização de Clientes (Saldo e Contas)
  useEffect(() => {
    if (!db) return;
    const q = collection(db, 'customers');
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as CustomerAccount));
      setCustomers(list);
      // Atualiza o objeto currentCustomer se houver mudanças no Firestore
      if (currentCustomer) {
        const updated = list.find(c => c.id === currentCustomer.id);
        if (updated) setCurrentCustomer(updated);
      }
    });
  }, [currentCustomer?.id]);

  // 4. Sincronização de Logs
  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'logs'), orderBy('date', 'desc'), limit(50));
    return onSnapshot(q, (snap) => {
      setAuditLogs(snap.docs.map(d => ({ ...d.data(), id: d.id } as AuditLog)));
    });
  }, []);

  const updateConfig = async (newConfig: Partial<StoreConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    if (db) await setDoc(doc(db, 'settings', 'store_config'), updated);
  };

  const addOrder = async (order: Order) => {
    let finalImageUrl = order.imageUrl;

    // Se a imagem for base64 (vinda do Gemini), fazemos upload para o Storage
    if (storage && order.imageUrl?.startsWith('data:image')) {
      try {
        const storageRef = ref(storage, `restorations/${order.id}_${Date.now()}.png`);
        const snapshot = await uploadString(storageRef, order.imageUrl, 'data_url');
        finalImageUrl = await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.error("Erro ao fazer upload da foto para o Storage:", err);
      }
    }

    const orderData = { ...order, imageUrl: finalImageUrl };

    if (db) {
      await addDoc(collection(db, 'orders'), orderData);
    } else {
      setOrders(prev => [orderData, ...prev]);
    }
    
    addAuditLog('Nova Encomenda', `ID: ${order.id} - ${order.amount}€`);
  };

  const updateOrder = async (id: string, status: Order['status']) => {
    if (db) await updateDoc(doc(db, 'orders', id), { status });
  };

  const addAuditLog = async (action: string, details: string) => {
    const log = { action, details, date: new Date().toISOString(), user: isAdmin ? 'Admin' : 'Sistema' };
    if (db) await addDoc(collection(db, 'logs'), log);
  };
  
  const customerLogin = (email: string, password?: string) => {
    const customer = customers.find(x => x.email.toLowerCase() === email.toLowerCase());
    if (!customer) return { success: false, message: "Utilizador não encontrado." };
    if (customer.password && customer.password !== password) return { success: false, message: "Senha incorreta." };
    setCurrentCustomer(customer);
    return { success: true, message: "Login efetuado." };
  };

  // Add missing customerLogout implementation
  const customerLogout = () => {
    setCurrentCustomer(null);
  };

  const registerCustomer = async (data: any) => {
    const newC = { 
      ...data, 
      balance: 0, 
      createdAt: new Date().toISOString(),
      password: data.password || '123456'
    };
    
    let created;
    if (db) {
      const docRef = await addDoc(collection(db, 'customers'), newC);
      created = { ...newC, id: docRef.id };
    } else {
      created = { ...newC, id: `C-${Date.now()}` };
    }
    
    setCurrentCustomer(created);
    addAuditLog('Novo Registo', `Cliente: ${created.email}`);
    return created;
  };

  const updateCustomerBalance = async (id: string, amount: number) => {
    const target = customers.find(c => c.id === id);
    if (!target) return;
    const newBalance = target.balance + amount;
    if (db) {
      await updateDoc(doc(db, 'customers', id), { balance: newBalance });
    }
  };

  const updateCustomerPassword = async (id: string, newPassword: string) => {
    if (db) {
      await updateDoc(doc(db, 'customers', id), { password: newPassword });
      addAuditLog('Alteração Segurança', `Senha alterada para Cliente ID: ${id}`);
    }
  };

  return (
    <ConfigContext.Provider value={{ 
      config, orders, auditLogs, updateConfig, addOrder, updateOrder, addAuditLog, isAdmin, login: () => setIsAdmin(true), logout: () => setIsAdmin(false),
      currentCustomer, customerLogin, customerLogout, registerCustomer, updateCustomerBalance, updateCustomerPassword,
      isCloudActive: !!db
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

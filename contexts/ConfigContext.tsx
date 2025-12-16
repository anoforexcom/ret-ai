
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreConfig, Order, NavigationLink, ProductBundle, AuditLog } from '../types';
import { db } from '../firebaseConfig';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';

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
}

const defaultBundles: ProductBundle[] = [
  { id: 'single', photos: 1, price: 4, label: 'Uma Foto', savings: '', active: true },
  { id: 'pack5', photos: 5, price: 10, label: 'Pack Mini', savings: 'Poupe 50%', popular: true, active: true },
  { id: 'pack12', photos: 12, price: 20, label: 'Pack Família', savings: '1.66€ / foto', active: true },
  { id: 'pack25', photos: 25, price: 40, label: 'Pack Álbum', savings: '1.60€ / foto', active: true },
  { id: 'pack100', photos: 100, price: 50, label: 'Pack Estúdio', savings: 'Melhor Valor', active: true },
];

const defaultStats: StoreConfig = {
  storeName: 'RetroColor AI',
  heroTitle: 'Traga as suas memórias antigas de volta à vida',
  heroSubtitle: 'Restaure, repare e colora fotos a preto e branco em segundos. A nossa Inteligência Artificial analisa cada detalhe para preservar a essência do momento.',
  footerText: 'Dê uma nova vida às suas memórias mais preciosas com a nossa tecnologia de restauração por IA de ponta.',
  mainMenu: [
    { id: '1', label: 'Início', path: '/' },
    { id: '2', label: 'Restaurar Agora', path: '/restore' },
    { id: '3', label: 'FAQ', path: '/faq' },
    { id: '4', label: 'Contacto', path: '/contact' },
  ],
  footerMenu: [
    { id: '1', label: 'Política de Privacidade', path: '/privacy' },
    { id: '2', label: 'Termos de Serviço', path: '/terms' },
    { id: '3', label: 'Política de Reembolso', path: '/refund' },
    { id: '4', label: 'Política de Cookies', path: '/cookies' },
  ],
  paymentMethods: [
    { id: 'cc', name: 'Cartão de Crédito', enabled: true, type: 'card' },
    { id: 'mbway', name: 'MB Way', enabled: true, type: 'mbway' },
    { id: 'paypal', name: 'PayPal', enabled: true, type: 'paypal' },
  ],
  bundles: defaultBundles,
  apiKeys: {
    paypalClientId: '', 
  }
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Configuração Local
  const [config, setConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('retro_config');
    // Merge deep para garantir que novos campos (como bundles) apareçam mesmo se o utilizador tiver config antiga
    if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultStats, ...parsed, bundles: parsed.bundles || defaultStats.bundles };
    }
    return defaultStats;
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
      { id: '1', action: 'System Init', user: 'System', date: new Date().toISOString(), details: 'Dashboard initialized' }
  ]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Guardar config localmente quando muda
  useEffect(() => {
    localStorage.setItem('retro_config', JSON.stringify(config));
  }, [config]);

  // Sincronizar Encomendas com o Firebase Firestore (Tempo Real)
  useEffect(() => {
    if (!db) {
        setOrders([
            { id: 'DEMO-001', customerName: 'João Silva', customerEmail: 'joao@exemplo.com', date: new Date(Date.now() - 86400000).toISOString(), amount: 10.00, status: 'completed', paymentMethod: 'MB Way', items: 'Pack Mini' },
            { id: 'DEMO-002', customerName: 'Maria Santos', customerEmail: 'maria@exemplo.com', date: new Date().toISOString(), amount: 4.00, status: 'pending', paymentMethod: 'Cartão', items: 'Uma Foto' }
        ]);
        return;
    }

    try {
        const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const ordersData: Order[] = [];
            querySnapshot.forEach((doc) => {
                ordersData.push({ id: doc.id, ...doc.data() } as Order);
            });
            setOrders(ordersData);
        }, (error) => {
            console.error("Erro ao ler dados do Firebase:", error);
        });
        return () => unsubscribe();
    } catch (e) {
        console.log("Firebase não disponível ou configurado incorretamente.");
    }
  }, []);

  const updateConfig = (newConfig: Partial<StoreConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    addAuditLog("Update Config", `Updated fields: ${Object.keys(newConfig).join(', ')}`);
  };

  const addOrder = async (order: Order) => {
    if (db) {
        try {
            const { id, ...orderData } = order; 
            await addDoc(collection(db, 'orders'), orderData);
            return; 
        } catch (e) {
            console.error("Erro ao adicionar encomenda ao Firebase:", e);
        }
    }
    setOrders(prev => [order, ...prev]);
  };

  const updateOrder = async (id: string, status: Order['status']) => {
    addAuditLog("Update Order", `Order #${id} status changed to ${status}`);
    if (db) {
        try {
            const orderRef = doc(db, 'orders', id);
            await updateDoc(orderRef, { status });
            return;
        } catch (e) {
            console.error("Erro ao atualizar encomenda no Firebase:", e);
        }
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const addAuditLog = (action: string, details: string) => {
      const newLog: AuditLog = {
          id: Date.now().toString(),
          action,
          details,
          date: new Date().toISOString(),
          user: isAdmin ? 'Admin' : 'System/User'
      };
      setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]); // Manter apenas os últimos 50
  };

  const login = () => {
      setIsAdmin(true);
      addAuditLog("Login", "Admin logged in");
  };
  
  const logout = () => {
      setIsAdmin(false);
      addAuditLog("Logout", "Admin logged out");
  };

  return (
    <ConfigContext.Provider value={{ config, orders, auditLogs, updateConfig, addOrder, updateOrder, addAuditLog, isAdmin, login, logout }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

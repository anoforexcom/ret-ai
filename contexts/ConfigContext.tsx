import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreConfig, Order, NavigationLink, PaymentMethod } from '../types';
import { db } from '../firebaseConfig';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';

interface ConfigContextType {
  config: StoreConfig;
  orders: Order[];
  updateConfig: (newConfig: Partial<StoreConfig>) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, status: Order['status']) => void;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
}

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
  apiKeys: {
    paypalClientId: '', // Vazio por defeito
  }
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Configuração Local
  const [config, setConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('retro_config');
    return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Guardar config localmente quando muda
  useEffect(() => {
    localStorage.setItem('retro_config', JSON.stringify(config));
  }, [config]);

  // Sincronizar Encomendas com o Firebase Firestore (Tempo Real)
  useEffect(() => {
    // Se a DB não estiver configurada (Modo Demo/Local), não fazer nada no Firebase
    if (!db) {
        setOrders([
            { id: 'DEMO-001', customerName: 'Modo Local (Sem Firebase)', date: new Date().toISOString(), amount: 0.00, status: 'pending', paymentMethod: 'N/A' }
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
            // Fallback silencioso para não incomodar o utilizador
        });
        return () => unsubscribe();
    } catch (e) {
        console.log("Firebase não disponível ou configurado incorretamente.");
    }
  }, []);

  const updateConfig = (newConfig: Partial<StoreConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const addOrder = async (order: Order) => {
    if (db) {
        try {
            // Remove o ID manual, o Firestore cria um automático
            const { id, ...orderData } = order; 
            await addDoc(collection(db, 'orders'), orderData);
            return; // Sucesso, o onSnapshot atualiza a UI
        } catch (e) {
            console.error("Erro ao adicionar encomenda ao Firebase:", e);
        }
    }
    
    // Fallback: Adicionar localmente se Firebase falhar ou não existir
    setOrders(prev => [order, ...prev]);
  };

  const updateOrder = async (id: string, status: Order['status']) => {
    if (db) {
        try {
            const orderRef = doc(db, 'orders', id);
            await updateDoc(orderRef, { status });
            return;
        } catch (e) {
            console.error("Erro ao atualizar encomenda no Firebase:", e);
        }
    }
    
    // Fallback local
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const login = () => setIsAdmin(true);
  const logout = () => setIsAdmin(false);

  return (
    <ConfigContext.Provider value={{ config, orders, updateConfig, addOrder, updateOrder, isAdmin, login, logout }}>
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
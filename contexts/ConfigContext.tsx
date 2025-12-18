
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreConfig, Order, NavigationLink, ProductBundle, AuditLog, Testimonial, Expense, ThemeConfig, PaymentMethod, StoreMember } from '../types';
import { db } from '../firebaseConfig';

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

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const defaultBundles: ProductBundle[] = [
  { id: 'single', photos: 1, price: 4, label: 'Uma Foto', savings: '', active: true },
  { id: 'pack5', photos: 5, price: 10, label: 'Pack Mini', savings: 'Poupe 50%', popular: true, active: true },
  { id: 'pack12', photos: 12, price: 20, label: 'Pack Família', savings: '1.66€ / foto', active: true },
  { id: 'pack25', photos: 25, price: 40, label: 'Pack Álbum', savings: '1.60€ / foto', active: true },
  { id: 'pack100', photos: 100, price: 50, label: 'Pack Estúdio', savings: 'Melhor Valor', active: true },
];

const defaultTestimonials: Testimonial[] = [
  { id: 't1', name: 'António Ferreira', location: 'Porto, PT', text: 'Recuperei uma foto do meu avô que estava completamente branca. O resultado da colorização deixou a minha mãe em lágrimas. Incrível!', rating: 5, date: '2024-03-15' },
  { id: 't2', name: 'Marta Rodrigues', location: 'Lisboa, PT', text: 'Serviço super rápido. Em menos de 1 minuto tinha a foto do meu casamento (de 1970) restaurada. Recomendo o Pack Família!', rating: 5, date: '2024-04-02' },
  { id: 't3', name: 'Carlos Mendes', location: 'Coimbra, PT', text: 'A IA é realmente impressionante. Conseguiu tirar riscos profundos que eu achei que seriam impossíveis de remover manualmente.', rating: 4, date: '2024-04-10' },
  { id: 't4', name: 'Beatriz Costa', location: 'Funchal, PT', text: 'A colorização da pele é a mais natural que já vi em serviços online. Não fica com aquele aspeto "pintado" artificial.', rating: 5, date: '2024-05-12' },
  { id: 't5', name: 'Ricardo Silva', location: 'Braga, PT', text: 'Usei para um projeto de árvore genealógica e foi a melhor decisão. As fotos ganharam uma vida que eu nem sabia que tinham.', rating: 5, date: '2024-05-20' },
  { id: 't6', name: 'Helena Matos', location: 'Aveiro, PT', text: 'Incrível como recuperou os detalhes do vestido da minha bisavó. Parecia impossível devido ao estado da foto original.', rating: 5, date: '2024-06-01' },
  { id: 't7', name: 'João Pereira', location: 'Faro, PT', text: 'Preço justo e entrega imediata. A funcionalidade de download em HD sem marca de água vale cada cêntimo.', rating: 5, date: '2024-06-15' },
  { id: 't8', name: 'Sofia Alvim', location: 'Évora, PT', text: 'Tive uma dúvida no processo de pagamento e o suporte foi extremamente atencioso e rápido. Cinco estrelas!', rating: 4, date: '2024-07-02' },
  { id: 't9', name: 'Luís Nogueira', location: 'Viseu, PT', text: 'Restaurei as fotos da tropa do meu pai. Ele ficou radiante ao ver as cores originais da farda depois de 50 anos.', rating: 5, date: '2024-07-20' },
  { id: 't10', name: 'Ana Luísa', location: 'São Paulo, BR', text: 'Mesmo estando no Brasil, o pagamento via PayPal foi super simples. O resultado da IA é melhor que muitos estúdios físicos.', rating: 5, date: '2024-08-05' },
  { id: 't11', name: 'Paulo Jorge', location: 'Setúbal, PT', text: 'A ferramenta de remoção de riscos é mágica. Limpou tudo sem borrar a imagem original. Espetacular tecnologia.', rating: 5, date: '2024-08-18' },
  { id: 't12', name: 'Mariana Santos', location: 'Guimarães, PT', text: 'Perfeito para presentes de aniversário. Fiz um quadro com a foto restaurada e foi o sucesso da festa.', rating: 5, date: '2024-09-01' },
  { id: 't13', name: 'Duarte Lima', location: 'Castelo Branco, PT', text: 'Tentei usar filtros de telemóvel mas nada se compara a esta IA profissional. Vale muito a pena o investimento.', rating: 4, date: '2024-09-12' },
  { id: 't14', name: 'Clara Neves', location: 'Angra do Heroísmo, PT', text: 'Uma forma maravilhosa de preservar o nosso património familiar para as próximas gerações. Recomendo a todos.', rating: 5, date: '2024-10-05' },
  { id: 't15', name: 'Vítor Manuel', location: 'Leiria, PT', text: 'Fiquei surpreendido com a textura da pele e a nitidez dos olhos. Não parece de todo uma imagem gerada por computador.', rating: 5, date: '2024-10-22' },
  { id: 't16', name: 'Rita Fonseca', location: 'Cascais, PT', text: 'O Pack Família de 12 fotos é a melhor opção. Conseguiu restaurar o álbum de infância todo da minha mãe por um preço excelente.', rating: 5, date: '2024-11-10' },
  { id: 't17', name: 'Gonçalo Rosa', location: 'Santarém, PT', text: 'Simples, direto e eficaz. Exatamente o que eu procurava para digitalizar o arquivo da nossa freguesia.', rating: 4, date: '2024-11-28' },
  { id: 't18', name: 'Teresa Nobre', location: 'Portimão, PT', text: 'A cor dos olhos foi detetada perfeitamente na foto da minha avó. Foi um momento muito emocionante para toda a família.', rating: 5, date: '2024-12-05' },
  { id: 't19', name: 'Hugo Martins', location: 'Rio de Janeiro, BR', text: 'Excelente tecnologia. Muito superior a qualquer app gratuita que já testei na App Store. Qualidade profissional.', rating: 5, date: '2024-12-15' },
  { id: 't20', name: 'Isabel Rocha', location: 'Beja, PT', text: 'Dei uma nova vida às fotos de casamento dos meus pais. Foi o melhor presente de Natal que poderia ter escolhido.', rating: 5, date: '2024-12-24' },
  { id: 't21', name: 'Fernando Silva', location: 'Viana do Castelo, PT', text: 'A IA conseguiu remover uma mancha de café enorme que estava por cima do rosto. Fiquei boquiaberto com a perfeição.', rating: 5, date: '2025-01-05' },
  { id: 't22', name: 'Catarina Borges', location: 'Ponta Delgada, PT', text: 'Restaurei fotos antigas dos Açores para uma exposição e os visitantes não acreditavam que eram fotos de 1920.', rating: 5, date: '2025-01-12' },
  { id: 't23', name: 'Miguel Veloso', location: 'Covilhã, PT', text: 'Excelente serviço para quem gosta de fotografia e história. A precisão cromática é de facto impressionante.', rating: 4, date: '2025-01-20' },
  { id: 't24', name: 'Patrícia Duarte', location: 'Porto Salvo, PT', text: 'A velocidade de processamento é surreal. Em 10 segundos tinha uma foto nova. Muito bom mesmo.', rating: 5, date: '2025-01-28' },
  { id: 't25', name: 'Joaquim Sousa', location: 'Portalegre, PT', text: 'Gostei muito da facilidade de uso do site. Sem complicações, é só carregar e esperar. Recomendo vivamente.', rating: 5, date: '2025-02-02' }
];

const defaultPaymentMethods: PaymentMethod[] = [
  { id: 'cc_stripe', name: 'Cartão de Crédito', enabled: true, type: 'card', provider: 'stripe', environment: 'sandbox' },
  { id: 'mbway_sibs', name: 'MB Way', enabled: true, type: 'mbway', provider: 'sibs', environment: 'sandbox' },
  { id: 'paypal_std', name: 'PayPal', enabled: true, type: 'paypal', provider: 'paypal', environment: 'sandbox' },
];

const defaultMembers: StoreMember[] = [
  { id: 'm1', name: 'Administrador Principal', email: 'admin@retrocolor.ai', role: 'owner', status: 'active', addedAt: '2024-01-01T00:00:00.000Z' }
];

const defaultStats: StoreConfig = {
  storeName: 'RetroColor AI',
  heroTitle: 'Traga as suas memórias antigas de volta à vida',
  heroSubtitle: 'Restaure, repare e colora fotos a preto e branco em segundos. A nossa Inteligência Artificial analisa cada detalhe para preservar a essência do momento.',
  footerText: 'Dê uma nova vida às suas memórias mais preciosas com a nossa tecnologia de restauração por IA de ponta.',
  mainMenu: [
    { id: '1', label: 'Início', path: '/' },
    { id: '2', label: 'Restaurar', path: '/restore' },
    { id: 'precos', label: 'Preços', path: '/pricing' },
    { id: '5', label: 'Testemunhos', path: '/testimonials' },
    { id: '3', label: 'FAQ', path: '/faq' },
  ],
  footerMenu: [
    { id: '1', label: 'Privacidade', path: '/privacy' },
    { id: '2', label: 'Termos', path: '/terms' },
    { id: '3', label: 'Reembolsos', path: '/refund' },
    { id: 'precos_footer', label: 'Preços', path: '/pricing' },
  ],
  paymentMethods: defaultPaymentMethods,
  bundles: defaultBundles,
  testimonials: defaultTestimonials,
  expenses: [],
  members: defaultMembers,
  apiKeys: {
    paypalClientId: '', 
  },
  theme: {
    primaryColor: '#4f46e5', // Indigo-600
    secondaryColor: '#0891b2', // Cyan-600
    borderRadius: '16px',
    fontFamily: 'Inter'
  }
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('retro_config_v9');
    if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultStats, ...parsed };
    }
    return defaultStats;
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem('retro_config_v9', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    if (!db) return;
    try {
        const unsubscribe = db.collection('orders')
          .orderBy('date', 'desc')
          .onSnapshot((querySnapshot: any) => {
            const ordersData: Order[] = [];
            querySnapshot.forEach((doc: any) => {
                ordersData.push({ id: doc.id, ...doc.data() } as Order);
            });
            setOrders(ordersData);
        });
        return () => unsubscribe();
    } catch (e) { console.log("Firebase Error", e); }
  }, []);

  const updateConfig = (newConfig: Partial<StoreConfig>) => setConfig(prev => ({ ...prev, ...newConfig }));

  const addOrder = async (order: Order) => {
    if (db) {
        try {
            const { id, ...orderData } = order; 
            await db.collection('orders').add(orderData);
        } catch (e) { console.error(e); }
    }
    setOrders(prev => [order, ...prev]);
  };

  const updateOrder = async (id: string, status: Order['status']) => {
    if (db) {
        try {
            const orderRef = db.collection('orders').doc(id);
            await orderRef.update({ status });
        } catch (e) { console.error(e); }
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const addAuditLog = (action: string, details: string) => {
      const newLog: AuditLog = {
          id: Date.now().toString(),
          action,
          details,
          date: new Date().toISOString(),
          user: isAdmin ? 'Admin' : 'User'
      };
      setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]); 
  };

  return (
    <ConfigContext.Provider value={{ config, orders, auditLogs, updateConfig, addOrder, updateOrder, addAuditLog, isAdmin, login: () => setIsAdmin(true), logout: () => setIsAdmin(false) }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within a ConfigProvider');
  return context;
};

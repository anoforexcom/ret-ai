
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
  { id: 't2', name: 'Marta Rodrigues', location: 'Lisboa, PT', text: 'Serviço rápido e de qualidade incrível. Recomendo vivamente para quem quer preservar memórias.', rating: 5, date: '2024-04-02' },
  { id: 't3', name: 'João Silva', location: 'Braga, PT', text: 'Incrível como a IA conseguiu detetar as cores certas da farda militar do meu avô.', rating: 5, date: '2024-01-20' },
  { id: 't4', name: 'Maria Santos', location: 'Coimbra, PT', text: 'As fotos da minha infância ganharam uma vida que eu já nem me lembrava. Muito grata!', rating: 5, date: '2024-02-10' },
  { id: 't5', name: 'Pedro Oliveira', location: 'Faro, PT', text: 'Recuperei uma foto rasgada de 1950. Nem parece a mesma imagem, o restauro é perfeito.', rating: 5, date: '2023-12-05' },
  { id: 't6', name: 'Ana Costa', location: 'Viseu, PT', text: 'Excelente trabalho na nitidez das faces. Consegui ver os olhos da minha bisavó com clareza.', rating: 5, date: '2024-03-22' },
  { id: 't7', name: 'Rui Almeida', location: 'Aveiro, PT', text: 'O processo é tão simples! Carreguei a foto e em segundos tinha a versão colorida.', rating: 5, date: '2024-04-10' },
  { id: 't8', name: 'Sofia Martins', location: 'Sintra, PT', text: 'Usei para um presente de aniversário e foi o sucesso da festa. Toda a gente ficou boquiaberta.', rating: 5, date: '2024-02-28' },
  { id: 't9', name: 'Carlos Pereira', location: 'Setúbal, PT', text: 'A recolorização da pele é muito realista, nada daquelas cores artificiais que se vê por aí.', rating: 5, date: '2024-01-15' },
  { id: 't10', name: 'Luísa Gomes', location: 'Évora, PT', text: 'Memórias de família não têm preço. Pagar este valor por este resultado é quase um presente.', rating: 5, date: '2023-11-30' },
  { id: 't11', name: 'Manuel Neves', location: 'Guarda, PT', text: 'Restaurei fotos da aldeia de 1940. Ajudou muito a documentar a história da nossa freguesia.', rating: 5, date: '2024-03-05' },
  { id: 't12', name: 'Beatriz Sousa', location: 'Funchal, PT', text: 'A luz e o brilho que as fotos ganharam é algo fenomenal. Parecem tiradas ontem.', rating: 5, date: '2024-04-15' },
  { id: 't13', name: 'Tiago Rocha', location: 'Ponta Delgada, PT', text: 'A paisagem dos Açores em 1960 colorida pela RetroColor é simplesmente mágica.', rating: 5, date: '2024-02-12' },
  { id: 't14', name: 'Helena Ribeiro', location: 'Leiria, PT', text: 'Consegui remover manchas de humidade que estavam a destruir a única foto do meu pai.', rating: 5, date: '2024-03-18' },
  { id: 't15', name: 'Ricardo Dias', location: 'Castelo Branco, PT', text: 'Qualidade profissional por uma fração do custo de um estúdio físico. Recomendo!', rating: 5, date: '2024-01-08' },
  { id: 't16', name: 'Inês Carvalho', location: 'Santarém, PT', text: 'Fiquei emocionada ao ver o vestido de noiva da minha mãe com a cor original.', rating: 5, date: '2024-04-05' },
  { id: 't17', name: 'Jorge Fernandes', location: 'Bragança, PT', text: 'Muito fácil de usar. Até para quem não percebe nada de computadores como eu.', rating: 5, date: '2023-12-20' },
  { id: 't18', name: 'Catarina Lopes', location: 'Beja, PT', text: 'As fotos do Alentejo antigo ficam lindas com estas cores quentes e naturais.', rating: 5, date: '2024-02-25' },
  { id: 't19', name: 'Paulo Silva', location: 'Portalegre, PT', text: 'O restauro de texturas é o que mais me impressionou. O detalhe da pedra é incrível.', rating: 5, date: '2024-03-30' },
  { id: 't20', name: 'Fernanda Mota', location: 'Viana do Castelo, PT', text: 'As cores dos trajes tradicionais foram reproduzidas com uma precisão histórica enorme.', rating: 5, date: '2024-01-25' },
  { id: 't21', name: 'Duarte Lima', location: 'Lisboa, PT', text: 'Um serviço indispensável para quem gosta de genealogia e história da família.', rating: 5, date: '2024-04-18' },
  { id: 't22', name: 'Patrícia Bento', location: 'Porto, PT', text: 'Rápido, barato e eficaz. Já restaurei mais de 20 fotos e continuarei a usar.', rating: 5, date: '2024-03-12' },
  { id: 't23', name: 'Hugo Machado', location: 'Chaves, PT', text: 'Excelente para recuperar fotos que estavam esquecidas no sótão e danificadas.', rating: 5, date: '2024-02-05' },
  { id: 't24', name: 'Sílvia Nunes', location: 'Lagos, PT', text: 'O mar parece tão real! Consegui sentir o verão de 1975 nesta foto.', rating: 5, date: '2023-11-15' },
  { id: 't25', name: 'Nuno Gouveia', location: 'Angra do Heroísmo, PT', text: 'A inteligência artificial deste site está noutro nível. Parabéns à equipa.', rating: 5, date: '2024-04-01' },
  { id: 't26', name: 'Cláudia Vieira', location: 'Torres Vedras, PT', text: 'Mandei imprimir as fotos restauradas e ficaram com uma qualidade de galeria.', rating: 5, date: '2024-03-25' },
  { id: 't27', name: 'Vítor Manuel', location: 'Barcelos, PT', text: 'Consegui identificar pessoas em fotos antigas que antes estavam demasiado escuras.', rating: 5, date: '2024-01-10' },
  { id: 't28', name: 'Isabel Aragão', location: 'Almada, PT', text: 'O suporte técnico foi impecável quando tive uma dúvida sobre o download.', rating: 5, date: '2024-02-18' },
  { id: 't29', name: 'André Filipe', location: 'Covilhã, PT', text: 'A neve nas fotos antigas da Serra da Estrela ficou com um contraste perfeito.', rating: 5, date: '2024-03-08' },
  { id: 't30', name: 'Teresa Marques', location: 'Figueira da Foz, PT', text: 'Reviver momentos de família através da cor é uma experiência única.', rating: 5, date: '2023-12-12' },
  { id: 't31', name: 'Filipe Castro', location: 'Esposende, PT', text: 'Melhor investimento que fiz este ano para o meu arquivo pessoal.', rating: 5, date: '2024-04-14' },
  { id: 't32', name: 'Rosário Pinho', location: 'Oliveira de Azeméis, PT', text: 'Consegui restaurar a única foto que tinha da minha avó jovem. Chorei de alegria.', rating: 5, date: '2024-02-01' },
  { id: 't33', name: 'Gonçalo Matos', location: 'Tomar, PT', text: 'As texturas do Convento de Cristo em fotos de 1930 ficaram soberbas.', rating: 5, date: '2024-01-30' },
  { id: 't34', name: 'Margarida Rosa', location: 'Caldas da Rainha, PT', text: 'Serviço cinco estrelas. Simples, intuitivo e com resultados profissionais.', rating: 5, date: '2024-03-14' },
  { id: 't35', name: 'Bruno Meireles', location: 'Penafiel, PT', text: 'A IA removeu todos os vincos da foto que estava dobrada há décadas.', rating: 5, date: '2024-04-20' },
  { id: 't36', name: 'Daniela Cruz', location: 'Ovar, PT', text: 'As cores do Carnaval antigo ganharam uma vibração fantástica.', rating: 5, date: '2024-02-14' },
  { id: 't37', name: 'Samuel Neto', location: 'Vila Real, PT', text: 'O restauro das árvores e vinhas do Douro é muito fiel à realidade.', rating: 5, date: '2023-12-28' },
  { id: 't38', name: 'Alice Guerra', location: 'Sesimbra, PT', text: 'Consegui ver detalhes nos barcos de pesca que nem sabia que existiam.', rating: 5, date: '2024-03-02' },
  { id: 't39', name: 'Luís Trindade', location: 'Mirandela, PT', text: 'Preço justo para a tecnologia avançada que estão a oferecer aqui.', rating: 5, date: '2024-01-05' },
  { id: 't40', name: 'Mónica Paiva', location: 'Ponte de Lima, PT', text: 'As fotos de família na feira antiga ficaram um espetáculo!', rating: 5, date: '2024-04-09' },
  { id: 't41', name: 'Eduardo Vaz', location: 'Silves, PT', text: 'O restauro do castelo ao fundo da foto da minha família ficou muito nítido.', rating: 5, date: '2024-02-22' },
  { id: 't42', name: 'Sónia Garcia', location: 'Espinho, PT', text: 'Adorei como os tons de azul do mar foram captados pela RetroColor.', rating: 5, date: '2024-03-11' },
  { id: 't43', name: 'Rafael Santos', location: 'Abrantes, PT', text: 'Um serviço que honra o passado com a tecnologia do futuro.', rating: 5, date: '2023-11-20' },
  { id: 't44', name: 'Júlia Mendes', location: 'Felgueiras, PT', text: 'Muito satisfeita. As fotos parecem ter sido tiradas com uma câmara moderna.', rating: 5, date: '2024-04-03' },
  { id: 't45', name: 'Gustavo Moreira', location: 'Maia, PT', text: 'A velocidade de processamento é o que mais me surpreendeu. Quase imediato.', rating: 5, date: '2024-01-18' },
  { id: 't46', name: 'Carla Antunes', location: 'Pombal, PT', text: 'Recuperei memórias que achava perdidas para sempre devido ao tempo.', rating: 5, date: '2024-03-29' },
  { id: 't47', name: 'Xavier Pinto', location: 'Lousã, PT', text: 'As cores das aldeias de xisto antigas ficaram muito autênticas.', rating: 5, date: '2024-02-08' },
  { id: 't48', name: 'Patrícia Rocha', location: 'Amadora, PT', text: 'Uma forma maravilhosa de mostrar aos meus filhos como era o mundo dos avós.', rating: 5, date: '2024-04-12' },
  { id: 't49', name: 'Nelson Freitas', location: 'Câmara de Lobos, PT', text: 'O restauro da baía antiga colorida é agora o meu fundo de ecrã favorito.', rating: 5, date: '2023-12-15' },
  { id: 't50', name: 'Rosa Silva', location: 'Albufeira, PT', text: 'Obrigada RetroColor por me devolverem o sorriso do meu avô a cores.', rating: 5, date: '2024-03-20' }
];

const defaultStats: StoreConfig = {
  storeName: 'RetroColor AI',
  adminPassword: 'admin',
  heroTitle: 'Dê cor às suas memórias mais queridas',
  heroSubtitle: 'Restaure fotos antigas e colorize imagens a preto e branco em segundos com a nossa tecnologia proprietária RetroColor AI.',
  heroBeforeImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&sat=-100',
  heroAfterImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200',
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
      password: data.password || '123456'
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
    if (currentCustomer?.id === id) setCurrentCustomer(prev => prev ? { ...prev, balance: prev.balance, password: newPassword } : null);
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

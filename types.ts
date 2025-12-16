export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface NavigationLink {
  id: string;
  label: string;
  path: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RestoredImage {
  originalUrl: string;
  restoredUrl: string;
}

export interface PricingTier {
  id: string;
  photos: number;
  price: number;
  label: string;
  popular?: boolean;
  savings?: string;
}

// Admin & Store Types
export interface Order {
  id: string;
  customerName: string; // Simulação
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
  imageUrl?: string;
  paymentMethod?: string;
  items?: string; // Descrição do que foi comprado (ex: 5 fotos)
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  type: 'card' | 'paypal' | 'mbway';
}

export interface StoreApiKeys {
  paypalClientId?: string;
  stripePublicKey?: string; // Para futuro uso
}

export interface StoreConfig {
  storeName: string;
  heroTitle: string;
  heroSubtitle: string;
  footerText: string;
  mainMenu: NavigationLink[];
  footerMenu: NavigationLink[];
  paymentMethods: PaymentMethod[];
  apiKeys: StoreApiKeys;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  visitorsToday: number; // Simulado
}
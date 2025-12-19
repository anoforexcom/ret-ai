
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

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatarUrl?: string;
  date: string;
}

export interface ProductBundle {
  id: string;
  photos: number;
  price: number;
  label: string;
  description?: string;
  popular?: boolean;
  savings?: string;
  active: boolean;
}

export interface Expense {
  id: string;
  date: string;
  category: 'api' | 'marketing' | 'infra' | 'outro';
  amount: number;
  description: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  borderRadius: '0px' | '4px' | '8px' | '16px' | '24px';
  fontFamily: 'Inter' | 'serif' | 'mono' | 'sans-serif';
}

export type MemberRole = 'owner' | 'admin' | 'manager' | 'viewer';

export interface StoreMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: 'active' | 'invited';
  addedAt: string;
}

export interface CustomerAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
  createdAt: string;
  password?: string;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName: string; 
  customerEmail?: string; 
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
  imageUrl?: string;
  paymentMethod?: string;
  items?: string; 
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  type: 'card' | 'paypal' | 'mbway' | 'stripe' | 'multibanco' | 'apple_pay' | 'balance';
  provider: 'stripe' | 'paypal' | 'sibs' | 'manual' | 'adyen' | 'internal';
  apiKey?: string;
  clientId?: string;
  environment?: 'sandbox' | 'live';
}

export interface StoreApiKeys {
  paypalClientId?: string;
  stripePublicKey?: string; 
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  date: string;
  details: string;
}

export interface StoreConfig {
  storeName: string;
  adminPassword?: string;
  heroTitle: string;
  heroSubtitle: string;
  footerText: string;
  mainMenu: NavigationLink[];
  footerMenu: NavigationLink[];
  paymentMethods: PaymentMethod[];
  bundles: ProductBundle[]; 
  testimonials: Testimonial[];
  expenses: Expense[];
  members: StoreMember[];
  customers: CustomerAccount[];
  apiKeys: StoreApiKeys;
  theme: ThemeConfig;
}

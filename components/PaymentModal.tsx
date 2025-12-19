
import React, { useState, useEffect } from 'react';
import { X, Lock, CreditCard, Smartphone, Wallet, Package, Check, Apple, Box, User, Mail, UserPlus, Coins, AlertCircle } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PaymentMethod } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (method: string, amount: number, itemDescription: string) => void;
  defaultPrice?: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { config, currentCustomer, registerCustomer, updateCustomerBalance } = useConfig();
  
  const activeBundles = config.bundles.filter(b => b.active);
  const enabledMethods = config.paymentMethods.filter(m => {
    // Apenas mostra saldo se o cliente estiver logado
    if (m.type === 'balance') return !!currentCustomer;
    return m.enabled;
  });
  
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  
  // Guest Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [shouldRegister, setShouldRegister] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [mbWayPhone, setMbWayPhone] = useState('');
  const [mbWaySent, setMbWaySent] = useState(false);

  // Inicialização de Tiers
  useEffect(() => {
    if (activeBundles.length > 0 && !selectedTierId) {
        setSelectedTierId(activeBundles[0].id);
    }
  }, [activeBundles, selectedTierId]);

  const selectedTier = activeBundles.find(t => t.id === selectedTierId) || activeBundles[0];
  const activeMethod = config.paymentMethods.find(m => m.id === selectedMethodId);

  // Auto-seleção de método de pagamento (Prioridade ao Saldo)
  useEffect(() => {
    if (isOpen && enabledMethods.length > 0) {
      const balanceMethod = enabledMethods.find(m => m.type === 'balance');
      const hasEnoughBalance = currentCustomer && selectedTier && currentCustomer.balance >= selectedTier.price;
      
      if (hasEnoughBalance && balanceMethod) {
        setSelectedMethodId(balanceMethod.id);
      } else if (!selectedMethodId || !enabledMethods.find(m => m.id === selectedMethodId)) {
        setSelectedMethodId(enabledMethods[0].id);
      }
    }
  }, [isOpen, currentCustomer, selectedTier, enabledMethods, selectedMethodId]);

  useEffect(() => {
    if (isOpen) {
      setMbWaySent(false);
      setIsProcessing(false);
      if (currentCustomer) {
        setFirstName(currentCustomer.firstName);
        setLastName(currentCustomer.lastName);
        setEmail(currentCustomer.email);
      }
    }
  }, [isOpen, currentCustomer]);

  if (!isOpen || !selectedTier) return null;

  const handleCheckoutSuccess = (methodName: string) => {
    if (activeMethod?.type === 'balance' && currentCustomer) {
      updateCustomerBalance(currentCustomer.id, -selectedTier.price);
    } else if (!currentCustomer && shouldRegister && email && firstName) {
      registerCustomer({ firstName, lastName, email });
    }

    onSuccess(methodName, selectedTier.price, selectedTier.label);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeMethod?.type === 'balance') {
      if (!currentCustomer || currentCustomer.balance < selectedTier.price) {
        alert("Saldo insuficiente na conta para realizar esta operação.");
        return;
      }
    }

    if (activeMethod?.type === 'mbway' && !mbWaySent) {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setMbWaySent(true);
        }, 1500);
        return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      handleCheckoutSuccess(activeMethod?.name || 'Pagamento');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-slate-900 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full">
          {/* Header */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-bold text-slate-900 flex items-center gap-2">
               <Lock className="h-5 w-5 text-indigo-600" />
               Finalizar Encomenda
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
                <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left Side: Order & Identity */}
            <div className="bg-slate-50 p-6 md:w-5/12 border-r border-slate-100 flex flex-col">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" /> Seus Dados
                </h4>
                
                <div className="space-y-3 mb-6">
                   {!currentCustomer ? (
                     <>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            placeholder="Nome" 
                            value={firstName} 
                            onChange={e => setFirstName(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <input 
                            type="text" 
                            placeholder="Apelido" 
                            value={lastName} 
                            onChange={e => setLastName(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="relative">
                          <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input 
                            type="email" 
                            placeholder="Seu melhor email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <label className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg cursor-pointer">
                           <input 
                            type="checkbox" 
                            checked={shouldRegister} 
                            onChange={e => setShouldRegister(e.target.checked)}
                            className="rounded text-indigo-600"
                           />
                           <span className="text-[10px] font-bold text-indigo-700 flex items-center gap-1">
                             <UserPlus className="h-3 w-3" /> CRIAR CONTA PARA ACEDER DEPOIS
                           </span>
                        </label>
                     </>
                   ) : (
                     <div className="bg-white p-3 rounded-xl border border-indigo-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          {currentCustomer.firstName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold text-slate-900 truncate">{currentCustomer.firstName} {currentCustomer.lastName}</p>
                           <p className="text-[10px] text-slate-500 truncate">{currentCustomer.email}</p>
                        </div>
                     </div>
                   )}
                </div>

                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Package className="h-4 w-4" /> Seleção
                </h4>
                
                <div className="space-y-2 mb-6 flex-grow overflow-y-auto max-h-[150px] scrollbar-hide">
                    {activeBundles.map(tier => (
                        <div 
                            key={tier.id}
                            onClick={() => setSelectedTierId(tier.id)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                selectedTierId === tier.id 
                                ? 'bg-white border-indigo-600 shadow-sm' 
                                : 'bg-transparent border-slate-200 hover:border-indigo-200'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-bold ${selectedTierId === tier.id ? 'text-indigo-900' : 'text-slate-600'}`}>
                                    {tier.label}
                                </span>
                                <span className="font-bold text-slate-900 text-xs">{tier.price}€</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-slate-200 pt-4 mt-auto">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
                        <span className="text-2xl font-black text-slate-900">{selectedTier.price.toFixed(2)}€</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Payment Methods */}
            <div className="p-6 md:w-7/12">
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Forma de Pagamento</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {enabledMethods.map(method => (
                            <button
                                key={method.id}
                                onClick={() => {
                                    setSelectedMethodId(method.id);
                                    setMbWaySent(false);
                                }}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                    selectedMethodId === method.id 
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-600' 
                                    : 'border-slate-100 hover:border-slate-300 text-slate-500'
                                }`}
                            >
                                {method.type === 'card' && <CreditCard className="h-5 w-5 mb-1" />}
                                {method.type === 'mbway' && <Smartphone className="h-5 w-5 mb-1" />}
                                {method.type === 'paypal' && <Wallet className="h-5 w-5 mb-1" />}
                                {method.type === 'balance' && <Coins className="h-5 w-5 mb-1" />}
                                <span className="text-[10px] font-bold text-center leading-tight">{method.name}</span>
                                {method.type === 'balance' && currentCustomer && (
                                  <span className={`text-[9px] font-bold mt-1 ${currentCustomer.balance >= selectedTier.price ? 'text-green-600' : 'text-red-400'}`}>
                                    {currentCustomer.balance.toFixed(2)}€ disp.
                                  </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {activeMethod && (
                  <div className="animate-fadeIn">
                    {activeMethod.type === 'balance' ? (
                      <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
                         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Coins className="h-10 w-10 text-indigo-600" />
                         </div>
                         <h5 className="font-bold text-slate-900">Pagamento via Saldo Interno</h5>
                         <p className="text-xs text-slate-500 mt-2 mb-6">
                            Ao confirmar, o valor de <b className="text-slate-900">{selectedTier.price.toFixed(2)}€</b> será descontado do seu saldo atual.
                         </p>
                         
                         {currentCustomer && currentCustomer.balance >= selectedTier.price ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isProcessing}
                                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                {isProcessing ? 'A DESCONTAR...' : 'CONFIRMAR E PAGAR AGORA'}
                            </button>
                         ) : (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> Saldo insuficiente. Carregue saldo na sua dashboard.
                            </div>
                         )}
                      </div>
                    ) : activeMethod.type === 'mbway' ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {!mbWaySent ? (
                            <>
                                <input
                                    type="tel"
                                    required
                                    placeholder="Nº Telemóvel MB Way"
                                    value={mbWayPhone}
                                    onChange={(e) => setMbWayPhone(e.target.value)}
                                    className="block w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-bold"
                                />
                                <button
                                    type="submit"
                                    disabled={isProcessing || mbWayPhone.length < 9}
                                    className="w-full flex justify-center py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm"
                                >
                                    {isProcessing ? '...' : `PEDIR ${selectedTier.price.toFixed(2)}€ NO MB WAY`}
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-4 bg-green-50 rounded-2xl">
                                <p className="text-sm font-bold text-slate-900">Confirme no seu telemóvel</p>
                                <button type="submit" className="mt-4 w-full bg-slate-900 text-white py-3 rounded-xl font-bold">JÁ CONFIRMEI</button>
                            </div>
                        )}
                      </form>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="Número do Cartão" required className="block w-full border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="MM/AA" required className="block w-full border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold" />
                          <input type="text" placeholder="CVC" required className="block w-full border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold" />
                        </div>
                        <button type="submit" disabled={isProcessing} className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black">
                            {isProcessing ? 'PROCESSANDO...' : `PAGAR ${selectedTier.price.toFixed(2)}€`}
                        </button>
                      </form>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

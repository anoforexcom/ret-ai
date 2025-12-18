
import React, { useState, useEffect } from 'react';
// Added Box to the list of icons imported from lucide-react
import { X, Lock, CreditCard, Smartphone, Wallet, Package, Check, Apple, Box } from 'lucide-react';
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
  const { config } = useConfig();
  const activeBundles = config.bundles.filter(b => b.active);
  const enabledMethods = config.paymentMethods.filter(m => m.enabled);
  
  const [selectedMethodId, setSelectedMethodId] = useState<string>(enabledMethods[0]?.id || '');
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [mbWayPhone, setMbWayPhone] = useState('');
  const [mbWaySent, setMbWaySent] = useState(false);

  useEffect(() => {
    if (activeBundles.length > 0 && !selectedTierId) {
        setSelectedTierId(activeBundles[0].id);
    }
  }, [activeBundles, selectedTierId]);

  const selectedTier = activeBundles.find(t => t.id === selectedTierId) || activeBundles[0];
  const activeMethod = config.paymentMethods.find(m => m.id === selectedMethodId);

  useEffect(() => {
    if (isOpen) {
      setMbWaySent(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen || !selectedTier) return null;

  const handleSimulationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeMethod?.type === 'mbway' && !mbWaySent) {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setMbWaySent(true);
        }, 1500);
        return;
    }

    if (activeMethod?.type === 'mbway' && mbWaySent) {
         setIsProcessing(true);
         setTimeout(() => {
             setIsProcessing(false);
             onSuccess(activeMethod.name, selectedTier.price, selectedTier.label);
         }, 1500);
         return;
    }

    // Card/Stripe Simulation or real logic would go here
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(activeMethod?.name || 'Pagamento', selectedTier.price, selectedTier.label);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-slate-900 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          {/* Header */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-bold text-slate-900 flex items-center gap-2">
               <Lock className="h-5 w-5 text-indigo-600" />
               Checkout Seguro
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
                <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left Side: Order Summary */}
            <div className="bg-slate-50 p-6 md:w-5/12 border-r border-slate-100 flex flex-col">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Package className="h-4 w-4" /> Resumo
                </h4>
                
                <div className="space-y-3 mb-6 flex-grow pr-1 overflow-y-auto max-h-[300px] scrollbar-hide">
                    {activeBundles.map(tier => (
                        <div 
                            key={tier.id}
                            onClick={() => setSelectedTierId(tier.id)}
                            className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                selectedTierId === tier.id 
                                ? 'bg-white border-indigo-600 shadow-lg shadow-indigo-500/10' 
                                : 'bg-transparent border-slate-200 hover:border-indigo-300'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className={`block font-bold text-sm ${selectedTierId === tier.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                                        {tier.label}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                        {(tier.price / tier.photos).toFixed(2)}€ / foto
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-slate-900">{tier.price}€</span>
                                    {tier.savings && (
                                        <span className="text-[9px] font-black text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full uppercase">
                                            {tier.savings}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-slate-200 pt-4 mt-auto">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
                        <span className="text-3xl font-black text-slate-900">{selectedTier.price.toFixed(2)}€</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Payment Methods */}
            <div className="p-6 md:w-7/12">
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Escolha o pagamento</h4>
                    {enabledMethods.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {enabledMethods.map(method => (
                                <button
                                    key={method.id}
                                    onClick={() => {
                                        setSelectedMethodId(method.id);
                                        setMbWaySent(false);
                                    }}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                                        selectedMethodId === method.id 
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md ring-1 ring-indigo-600' 
                                        : 'border-slate-100 hover:border-slate-300 text-slate-500'
                                    }`}
                                >
                                    {method.type === 'card' && <CreditCard className="h-6 w-6 mb-1" />}
                                    {method.type === 'mbway' && <Smartphone className="h-6 w-6 mb-1" />}
                                    {method.type === 'paypal' && <Wallet className="h-6 w-6 mb-1" />}
                                    {method.type === 'apple_pay' && <Apple className="h-6 w-6 mb-1" />}
                                    {method.type === 'multibanco' && <Box className="h-6 w-6 mb-1" />}
                                    <span className="text-[10px] font-bold text-center leading-tight">{method.name}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-red-500 p-4 bg-red-50 rounded-2xl text-xs font-medium border border-red-100">
                            Nenhum método de pagamento disponível no momento.
                        </div>
                    )}
                </div>

                {/* Dynamic Forms based on Active Method */}
                {activeMethod && (
                  <div className="animate-fadeIn">
                    {activeMethod.provider === 'paypal' && activeMethod.clientId ? (
                      <PayPalScriptProvider options={{ clientId: activeMethod.clientId, currency: "EUR" }}>
                          <PayPalButtons 
                              style={{ layout: "vertical", shape: "rect", borderRadius: 12 }}
                              forceReRender={[selectedTier.price]}
                              createOrder={(data, actions) => {
                                  return actions.order.create({
                                      intent: "CAPTURE",
                                      purchase_units: [{
                                          amount: {
                                              currency_code: "EUR",
                                              value: selectedTier.price.toString()
                                          },
                                          description: `RetroColor AI - ${selectedTier.label}`
                                      }]
                                  });
                              }}
                              onApprove={async (data, actions) => {
                                  if (actions.order) {
                                      await actions.order.capture();
                                      onSuccess(activeMethod.name, selectedTier.price, selectedTier.label);
                                  }
                              }}
                          />
                      </PayPalScriptProvider>
                    ) : activeMethod.type === 'mbway' ? (
                      <form onSubmit={handleSimulationSubmit} className="space-y-4">
                        {!mbWaySent ? (
                            <>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Telemóvel MB Way</label>
                                    <div className="relative">
                                        <input
                                        type="tel"
                                        required
                                        placeholder="9xx xxx xxx"
                                        value={mbWayPhone}
                                        onChange={(e) => setMbWayPhone(e.target.value)}
                                        className="block w-full border border-slate-200 rounded-xl py-3 pl-4 focus:ring-2 focus:ring-red-500 outline-none text-sm font-bold"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <Smartphone className="h-5 w-5 text-red-500" />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isProcessing || mbWayPhone.length < 9}
                                    className={`w-full flex justify-center py-4 px-4 rounded-2xl shadow-lg text-sm font-black text-white transition-all ${
                                    isProcessing ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700 shadow-red-500/30'
                                    }`}
                                >
                                    {isProcessing ? 'PROCESSANDO...' : `PEDIR ${selectedTier.price.toFixed(2)}€`}
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-4 bg-green-50 rounded-2xl border border-green-100">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-sm mb-3 animate-bounce">
                                    <Smartphone className="h-6 w-6 text-green-600" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-900">Confirmar no Telemóvel</h4>
                                <p className="text-[10px] text-slate-500 mt-1 mb-6">Enviámos o pedido para {mbWayPhone}.</p>
                                
                                <div className="px-6 space-y-2">
                                  <button
                                      type="submit"
                                      disabled={isProcessing}
                                      className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all"
                                  >
                                      {isProcessing ? 'VERIFICANDO...' : 'JÁ CONFIRMEI'}
                                  </button>
                                  <button 
                                      type="button"
                                      onClick={() => setMbWaySent(false)}
                                      className="text-[10px] text-slate-400 hover:text-slate-600 font-bold uppercase tracking-tight underline"
                                  >
                                      Alterar número
                                  </button>
                                </div>
                            </div>
                        )}
                      </form>
                    ) : (
                      <form onSubmit={handleSimulationSubmit} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dados do Cartão</label>
                          <div className="relative">
                              <input
                                type="text"
                                required
                                placeholder="0000 0000 0000 0000"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="block w-full border border-slate-200 rounded-xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                              />
                              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <CreditCard className="h-5 w-5 text-slate-300" />
                              </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            required
                            placeholder="MM/AA"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="block w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                          />
                          <input
                            type="text"
                            required
                            placeholder="CVC"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            className="block w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                          />
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full mt-4 flex justify-center py-4 px-4 rounded-2xl shadow-xl text-sm font-black text-white transition-all ${
                            isProcessing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                            }`}
                        >
                            {isProcessing ? 'PROCESSANDO...' : `PAGAR ${selectedTier.price.toFixed(2)}€`}
                        </button>
                      </form>
                    )}
                  </div>
                )}
            </div>
          </div>
          
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
             <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <Lock className="h-3 w-3" />
                <span>Transação 256-bit SSL Segura • Garantia de Satisfação</span>
             </div>
          </div>
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default PaymentModal;

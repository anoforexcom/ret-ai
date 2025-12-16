
import React, { useState, useEffect } from 'react';
import { X, Lock, CreditCard, Smartphone, Wallet, Package, Check } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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
  
  const [selectedMethod, setSelectedMethod] = useState<string>(enabledMethods[0]?.id || '');
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

  useEffect(() => {
    if (isOpen) {
      setMbWaySent(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen || !selectedTier) return null;

  const handleSimulationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMethod === 'mbway' && !mbWaySent) {
        setIsProcessing(true);
        // Simulate sending notification
        setTimeout(() => {
            setIsProcessing(false);
            setMbWaySent(true);
        }, 1500);
        return;
    }

    if (selectedMethod === 'mbway' && mbWaySent) {
         setIsProcessing(true);
         setTimeout(() => {
             setIsProcessing(false);
             onSuccess('MB Way', selectedTier.price, selectedTier.label);
         }, 1500);
         return;
    }

    // Card Simulation
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess('Cartão de Crédito', selectedTier.price, selectedTier.label);
    }, 2000);
  };

  const activeMethod = config.paymentMethods.find(m => m.id === selectedMethod);
  const paypalClientId = config.apiKeys.paypalClientId;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-slate-900 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          {/* Header */}
          <div className="bg-slate-50 px-4 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-bold text-slate-900 flex items-center gap-2">
               <Lock className="h-5 w-5 text-indigo-600" />
               Checkout Seguro
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left Side: Order Summary & Bundle Selection */}
            <div className="bg-slate-50 p-6 md:w-5/12 border-r border-slate-100">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Package className="h-4 w-4" /> Resumo do Pedido
                </h4>
                
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
                    {activeBundles.map(tier => (
                        <div 
                            key={tier.id}
                            onClick={() => setSelectedTierId(tier.id)}
                            className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedTierId === tier.id 
                                ? 'bg-white border-indigo-600 shadow-sm' 
                                : 'bg-transparent border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className={`block font-bold ${selectedTierId === tier.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                                        {tier.label}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {(tier.price / tier.photos).toFixed(2)}€ / foto
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-slate-900">{tier.price} €</span>
                                    {tier.savings && (
                                        <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                                            {tier.savings}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {selectedTierId === tier.id && (
                                <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 -translate-x-full md:block hidden">
                                    <Check className="h-5 w-5 text-indigo-600" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="border-t border-slate-200 pt-4 mt-auto">
                    <div className="flex justify-between items-end">
                        <span className="text-sm text-slate-500">Total a pagar:</span>
                        <span className="text-3xl font-extrabold text-slate-900">{selectedTier.price.toFixed(2)} €</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Payment Form */}
            <div className="p-6 md:w-7/12">
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Escolha o método de pagamento</h4>
                    {enabledMethods.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {enabledMethods.map(method => (
                                <button
                                    key={method.id}
                                    onClick={() => {
                                        setSelectedMethod(method.id);
                                        setMbWaySent(false);
                                    }}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                                        selectedMethod === method.id 
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' 
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                    }`}
                                >
                                    {method.type === 'card' && <CreditCard className="h-5 w-5 mb-1" />}
                                    {method.type === 'mbway' && <Smartphone className="h-5 w-5 mb-1" />}
                                    {method.type === 'paypal' && <Wallet className="h-5 w-5 mb-1" />}
                                    <span className="text-[10px] font-bold">{method.name}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg text-sm">
                            Sem métodos disponíveis.
                        </div>
                    )}
                </div>

                {/* Forms */}
                {activeMethod?.type === 'card' && (
                    <form onSubmit={handleSimulationSubmit} className="space-y-4 animate-fadeIn">
                        <div>
                        <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">Número do Cartão</label>
                        <div className="relative">
                            <input
                            type="text"
                            required
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="block w-full border border-slate-300 rounded-md py-2 pl-3 pr-10 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <CreditCard className="h-4 w-4 text-slate-400" />
                            </div>
                        </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">Validade</label>
                            <input
                            type="text"
                            required
                            placeholder="MM/AA"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="block w-full border border-slate-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">CVC</label>
                            <input
                            type="text"
                            required
                            placeholder="123"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            className="block w-full border border-slate-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white ${
                            isProcessing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {isProcessing ? 'Processando...' : `Pagar ${selectedTier.price.toFixed(2)} €`}
                        </button>
                    </form>
                )}

                {activeMethod?.type === 'mbway' && (
                    <form onSubmit={handleSimulationSubmit} className="space-y-4 animate-fadeIn">
                        {!mbWaySent ? (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">Telemóvel</label>
                                    <div className="relative">
                                        <input
                                        type="tel"
                                        required
                                        placeholder="910 000 000"
                                        value={mbWayPhone}
                                        onChange={(e) => setMbWayPhone(e.target.value)}
                                        className="block w-full border border-slate-300 rounded-md py-2 pl-3 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <Smartphone className="h-5 w-5 text-red-500" />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isProcessing || mbWayPhone.length < 9}
                                    className={`w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white ${
                                    isProcessing ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    {isProcessing ? 'A enviar...' : `Pedir ${selectedTier.price.toFixed(2)} €`}
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-2">
                                <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-100 mb-2 animate-pulse">
                                    <Smartphone className="h-5 w-5 text-green-600" />
                                </div>
                                <h4 className="text-md font-bold text-slate-900">Confirme no MB Way</h4>
                                <p className="text-xs text-slate-500 mt-1 mb-4">Enviado para {mbWayPhone}.</p>
                                
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
                                >
                                    {isProcessing ? 'A verificar...' : 'Já confirmei'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setMbWaySent(false)}
                                    className="mt-2 text-xs text-slate-500 hover:text-slate-800 underline"
                                >
                                    Alterar número
                                </button>
                            </div>
                        )}
                    </form>
                )}

                {activeMethod?.type === 'paypal' && (
                    <div className="mt-4">
                        {paypalClientId ? (
                            <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "EUR" }}>
                                <PayPalButtons 
                                    style={{ layout: "vertical", shape: "rect" }}
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
                                            onSuccess('PayPal', selectedTier.price, selectedTier.label);
                                        }
                                    }}
                                />
                            </PayPalScriptProvider>
                        ) : (
                            <div className="text-center space-y-2">
                                <button
                                    onClick={() => onSuccess('PayPal (Simulado)', selectedTier.price, selectedTier.label)}
                                    className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                                >
                                    <Wallet className="h-5 w-5" />
                                    Pagar {selectedTier.price.toFixed(2)}€ (Simulado)
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>
          
          <div className="bg-slate-100 px-4 py-3 text-center">
             <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Lock className="h-3 w-3" />
                <span>Transação segura e encriptada. Satisfação garantida ou reembolso em 14 dias.</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

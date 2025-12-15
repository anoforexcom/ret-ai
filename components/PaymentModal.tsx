import React, { useState } from 'react';
import { X, Lock, CreditCard, Smartphone, Wallet, CheckCircle2 } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (method: string) => void;
  price: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, price }) => {
  const { config } = useConfig();
  const enabledMethods = config.paymentMethods.filter(m => m.enabled);
  const [selectedMethod, setSelectedMethod] = useState<string>(enabledMethods[0]?.id || '');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [mbWayPhone, setMbWayPhone] = useState('');
  const [mbWaySent, setMbWaySent] = useState(false);

  if (!isOpen) return null;

  // Handle generic simulation (Card or Manual MB Way)
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
         // Simulate checking approval
         setIsProcessing(true);
         setTimeout(() => {
             setIsProcessing(false);
             onSuccess('MB Way');
         }, 1500);
         return;
    }

    // Card Simulation
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess('Cartão de Crédito');
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

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
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

          <div className="px-4 py-6 sm:p-6">
            <div className="mb-6 text-center">
                <p className="text-sm text-slate-500">Total a pagar</p>
                <p className="text-4xl font-extrabold text-slate-900 mt-1">{price}</p>
            </div>

            {/* Method Selection */}
            {enabledMethods.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {enabledMethods.map(method => (
                        <button
                            key={method.id}
                            onClick={() => {
                                setSelectedMethod(method.id);
                                setMbWaySent(false);
                            }}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                                selectedMethod === method.id 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                : 'border-slate-200 hover:border-slate-300 text-slate-600'
                            }`}
                        >
                            {method.type === 'card' && <CreditCard className="h-6 w-6 mb-1" />}
                            {method.type === 'mbway' && <Smartphone className="h-6 w-6 mb-1" />}
                            {method.type === 'paypal' && <Wallet className="h-6 w-6 mb-1" />}
                            <span className="text-xs font-semibold">{method.name}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
                    Não existem métodos de pagamento ativos.
                </div>
            )}

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
                          className="block w-full border border-slate-300 rounded-md py-2.5 pl-3 pr-10 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                          className="block w-full border border-slate-300 rounded-md py-2.5 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                          className="block w-full border border-slate-300 rounded-md py-2.5 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className={`w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white ${
                          isProcessing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {isProcessing ? 'Processando...' : `Pagar ${price}`}
                      </button>
                      <p className="text-xs text-center text-slate-400 mt-2">Ambiente de Simulação Segura</p>
                </form>
            )}

            {activeMethod?.type === 'mbway' && (
                <form onSubmit={handleSimulationSubmit} className="space-y-4 animate-fadeIn">
                     {!mbWaySent ? (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">Número de Telemóvel</label>
                                <div className="relative">
                                    <input
                                    type="tel"
                                    required
                                    placeholder="910 000 000"
                                    value={mbWayPhone}
                                    onChange={(e) => setMbWayPhone(e.target.value)}
                                    className="block w-full border border-slate-300 rounded-md py-3 pl-3 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Smartphone className="h-5 w-5 text-red-500" />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Enviaremos uma notificação para a sua aplicação MB Way.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={isProcessing || mbWayPhone.length < 9}
                                className={`w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white ${
                                isProcessing ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {isProcessing ? 'A enviar...' : 'Enviar Pedido MB Way'}
                            </button>
                        </>
                     ) : (
                        <div className="text-center py-4">
                             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4 animate-pulse">
                                <Smartphone className="h-6 w-6 text-green-600" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900">Confirme no seu telemóvel</h4>
                            <p className="text-sm text-slate-500 mt-2 mb-6">Enviámos um pedido de pagamento para {mbWayPhone}. Por favor aceite na app MB Way.</p>
                            
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-slate-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-slate-800"
                            >
                                {isProcessing ? 'A verificar...' : 'Já confirmei'}
                            </button>
                            <button 
                                type="button"
                                onClick={() => setMbWaySent(false)}
                                className="mt-4 text-xs text-slate-500 hover:text-slate-800 underline"
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
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        intent: "CAPTURE",
                                        purchase_units: [{
                                            amount: {
                                                currency_code: "EUR",
                                                value: "4.00" // Valor fixo para este exemplo
                                            },
                                            description: "Restauração de Foto - RetroColor AI"
                                        }]
                                    });
                                }}
                                onApprove={async (data, actions) => {
                                    if (actions.order) {
                                        await actions.order.capture();
                                        onSuccess('PayPal');
                                    }
                                }}
                             />
                        </PayPalScriptProvider>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                                <strong>Modo de Simulação</strong><br/>
                                O Client ID do PayPal não foi configurado no Admin.
                            </div>
                            <button
                                onClick={() => onSuccess('PayPal (Simulado)')}
                                className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                            >
                                <Wallet className="h-5 w-5" />
                                Pagar com PayPal (Simulado)
                            </button>
                        </div>
                    )}
                </div>
            )}
            
          </div>
          
          <div className="bg-slate-50 px-4 py-3 sm:px-6 flex justify-center">
             <div className="flex items-center gap-2 text-xs text-slate-400">
                <Lock className="h-3 w-3" />
                <span>Encriptação SSL 256-bit</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
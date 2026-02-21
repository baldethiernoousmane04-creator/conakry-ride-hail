import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck, Wallet as WalletIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { PaymentMethods } from './PaymentMethods';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'sonner';

interface ProcessPaymentProps {
  rideId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProcessPayment: React.FC<ProcessPaymentProps> = ({ 
  rideId, 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (methodId: string | 'wallet') => {
    setIsProcessing(true);
    setStep('processing');

    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          action: 'process_ride_payment',
          ride_id: rideId,
          payment_method_id: methodId,
          amount: amount
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (error: any) {
      toast.error(error.message || 'Le paiement a échoué');
      setStep('select');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden"
      >
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'select' && (
              <motion.div 
                key="select"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-gray-900">Finaliser le paiement</h2>
                  <p className="text-gray-500">Montant à régler : <span className="font-bold text-black">{formatCurrency(amount)}</span></p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => handlePayment('wallet')}
                    className="w-full bg-black text-white p-4 rounded-2xl flex items-center gap-4 hover:bg-gray-900 transition-colors"
                  >
                    <div className="p-2 bg-white/10 rounded-lg">
                      <WalletIcon size={24} className="text-yellow-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Portefeuille Wongaye</p>
                      <p className="text-xs text-gray-400">Payer avec votre solde</p>
                    </div>
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-400 font-bold">Ou choisir une carte / Mobile Money</span>
                    </div>
                  </div>

                  <PaymentMethods 
                    selectable 
                    onSelect={(method) => handlePayment(method.id)} 
                  />
                </div>

                <Button 
                  variant="ghost" 
                  onClick={onCancel}
                  className="w-full text-gray-400 font-bold"
                >
                  Payer plus tard
                </Button>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-yellow-100 rounded-full"></div>
                  <div className="w-24 h-24 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin absolute top-0"></div>
                  <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-600 animate-pulse" size={32} />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">Traitement sécurisé...</h3>
                  <p className="text-gray-500 text-sm">Veuillez ne pas fermer l'application</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold bg-gray-50 px-3 py-1 rounded-full">
                  <ShieldCheck size={12} className="text-green-500" />
                  SSL Encrypted
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-20 flex flex-col items-center justify-center space-y-6"
              >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-green-600" size={64} />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-gray-900">Paiement Reçu !</h3>
                  <p className="text-gray-500">Merci d'utiliser Wongaye</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Plus, 
  Wallet as WalletIcon,
  Info,
  History,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'sonner';
import { PaymentMethods } from './PaymentMethods';
import { PaymentHistory } from './PaymentHistory';

interface WalletProps {
  onBack: () => void;
}

export const Wallet: React.FC<WalletProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'main' | 'methods' | 'history'>('main');

  useEffect(() => {
    if (user) fetchWallet();
  }, [user]);

  const fetchWallet = async () => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setBalance(data?.balance || 0);
    } catch (error: any) {
      console.error('Error fetching wallet:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    // For now, redirect to payment methods to select/add one
    setView('methods');
    toast.info("Veuillez sélectionner ou ajouter un mode de paiement pour recharger.");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white p-4 flex items-center gap-4 border-b sticky top-0 z-20">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={view === 'main' ? onBack : () => setView('main')} 
          className="rounded-full"
        >
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-xl font-bold">
          {view === 'main' ? 'Mon Portefeuille' : 
           view === 'methods' ? 'Modes de Paiement' : 'Historique'}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {view === 'main' && (
            <motion.div 
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-6"
            >
              <motion.div 
                className="bg-black rounded-[24px] p-6 text-white shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <WalletIcon size={120} />
                </div>
                
                <div className="relative z-10">
                  <p className="text-gray-400 text-sm font-medium mb-1">Solde actuel</p>
                  <h2 className="text-4xl font-black mb-6">
                    {loading ? '---' : formatCurrency(balance)}
                  </h2>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleTopUp}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 rounded-xl"
                    >
                      <Plus size={20} className="mr-2" />
                      Recharger
                    </Button>
                  </div>
                </div>
              </motion.div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                <Info className="text-blue-500 shrink-0" size={20} />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Utilisez votre solde Wongaye pour payer vos courses et livraisons plus rapidement. 
                  Les paiements par portefeuille bénéficient de 5% de réduction.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setView('methods')}
                  className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <CreditCard size={20} />
                    </div>
                    <span className="font-bold text-gray-900">Modes de paiement</span>
                  </div>
                  <ArrowRight size={20} className="text-gray-300" />
                </button>

                <button 
                  onClick={() => setView('history')}
                  className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <History size={20} />
                    </div>
                    <span className="font-bold text-gray-900">Historique des transactions</span>
                  </div>
                  <ArrowRight size={20} className="text-gray-300" />
                </button>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Activités récentes</h3>
                </div>
                <PaymentHistory />
              </div>
            </motion.div>
          )}

          {view === 'methods' && (
            <motion.div 
              key="methods"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="py-4"
            >
              <PaymentMethods />
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="py-4"
            >
              <PaymentHistory />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-6 text-center">
        <p className="text-gray-400 text-xs">Des questions sur vos transactions ?</p>
        <button className="text-yellow-600 text-xs font-bold mt-1">Contacter le support client</button>
      </div>
    </div>
  );
};
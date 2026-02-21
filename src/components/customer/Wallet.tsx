import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Smartphone, 
  History,
  Info,
  Wallet as WalletIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import { MOCK_WALLET } from '../../lib/data';
import { Transaction } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'sonner';

interface WalletProps {
  onBack: () => void;
}

export const Wallet: React.FC<WalletProps> = ({ onBack }) => {
  const [balance] = useState(MOCK_WALLET.balance);
  const [showTopUpOptions, setShowTopUpOptions] = useState(false);

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'topup':
        return <ArrowDownLeft className="text-green-500" size={20} />;
      case 'ride':
      case 'delivery':
        return <ArrowUpRight className="text-red-500" size={20} />;
      case 'refund':
        return <ArrowDownLeft className="text-blue-500" size={20} />;
      default:
        return <History className="text-gray-500" size={20} />;
    }
  };

  const handleTopUp = (method: string) => {
    toast.success(`Redirection vers ${method}...`);
    setTimeout(() => {
      setShowTopUpOptions(false);
      toast.info("Interface de paiement mobile activée.");
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white p-4 flex items-center gap-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-xl font-bold">Mon Portefeuille</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-black rounded-[24px] p-6 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <WalletIcon size={120} />
          </div>
          
          <div className="relative z-10">
            <p className="text-gray-400 text-sm font-medium mb-1">Solde actuel</p>
            <h2 className="text-4xl font-black mb-6">
              {formatCurrency(balance)}
            </h2>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowTopUpOptions(true)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 rounded-xl"
              >
                <Plus size={20} className="mr-2" />
                Recharger
              </Button>
              <Button 
                variant="outline"
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white font-bold h-12 rounded-xl"
              >
                Transférer
              </Button>
            </div>
          </div>
        </motion.div>

        {showTopUpOptions && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="grid grid-cols-2 gap-3"
          >
            <button 
              onClick={() => handleTopUp('Orange Money')}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 hover:bg-orange-50 transition-colors"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <Smartphone size={24} />
              </div>
              <span className="text-xs font-bold">Orange Money</span>
            </button>
            <button 
              onClick={() => handleTopUp('MTN MoMo')}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 hover:bg-yellow-50 transition-colors"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                <Smartphone size={24} />
              </div>
              <span className="text-xs font-bold">MTN MoMo</span>
            </button>
          </motion.div>
        )}

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <Info className="text-blue-500 shrink-0" size={20} />
          <p className="text-xs text-blue-700 leading-relaxed">
            Utilisez votre solde Wongaye pour payer vos courses et livraisons plus rapidement. 
            Les paiements par portefeuille bénéficient de 5% de réduction.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Historique des transactions</h3>
            <button className="text-xs font-bold text-yellow-600">Tout voir</button>
          </div>

          <div className="space-y-3">
            {MOCK_WALLET.transactions.map((tx) => (
              <motion.div 
                key={tx.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4"
              >
                <div className={`p-3 rounded-xl ${
                  tx.amount > 0 ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  {getTransactionIcon(tx.type)}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-900 leading-tight">
                    {tx.description}
                  </h4>
                  <p className="text-gray-500 text-[10px] mt-1">{tx.date}</p>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold text-sm ${
                    tx.amount > 0 ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-[10px] text-gray-400 capitalize">{tx.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6 text-center">
        <p className="text-gray-400 text-xs">Des questions sur vos transactions ?</p>
        <button className="text-yellow-600 text-xs font-bold mt-1">Contacter le support client</button>
      </div>
    </div>
  );
};
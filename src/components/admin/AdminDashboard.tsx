import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  TrendingUp, 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  CreditCard, 
  History, 
  Plus, 
  CheckCircle2, 
  Settings,
  Banknote,
  Smartphone,
  BarChart3,
  Calendar,
  AlertCircle,
  Tag,
  PieChart
} from 'lucide-react';
import { Button } from '../ui/button';
import { MOCK_ADMIN_WALLET, calculateCommissionBreakdown } from '../../lib/data';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'sonner';
import { SettlementMethod, Transaction } from '../../types';
import { PromotionsManager } from './PromotionsManager';

interface AdminDashboardProps {
  onBack: () => void;
}

type AdminView = 'overview' | 'promotions' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [adminWallet, setAdminWallet] = useState(MOCK_ADMIN_WALLET);
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = () => {
    if (adminWallet.availableForWithdrawal < 50000) {
      toast.error("Le montant minimum pour un retrait est de 50,000 GNF");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const activeMethod = adminWallet.settlementMethods.find(m => m.isActive);
      toast.success(`Transfert de ${formatCurrency(adminWallet.availableForWithdrawal)} initié vers ${activeMethod?.label}`);
      
      const newTransaction: Transaction = {
        id: `set-${Date.now()}`,
        type: 'settlement',
        amount: -adminWallet.availableForWithdrawal,
        date: new Date().toLocaleString('fr-GN'),
        description: `Virement vers ${activeMethod?.label}`,
        status: 'completed'
      };

      setAdminWallet(prev => ({
        ...prev,
        availableForWithdrawal: 0,
        balance: 0,
        transactions: [newTransaction, ...prev.transactions]
      }));
      setIsProcessing(false);
    }, 2000);
  };

  const toggleMethod = (id: string) => {
    setAdminWallet(prev => ({
      ...prev,
      settlementMethods: prev.settlementMethods.map(m => ({
        ...m,
        isActive: m.id === id
      }))
    }));
    toast.success("Mode de règlement par défaut mis à jour");
  };

  const activeMethod = adminWallet.settlementMethods.find(m => m.isActive);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between border-b sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-xl font-black tracking-tight text-slate-900">Console Admin</h1>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentView('promotions')} 
            className={`rounded-full ${currentView === 'promotions' ? 'bg-yellow-50 text-yellow-600' : 'text-slate-500'}`}
          >
            <Tag size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentView('settings')} 
            className={`rounded-full ${currentView === 'settings' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}
          >
            <Settings size={20} />
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b px-4 flex gap-6">
        <button 
          onClick={() => setCurrentView('overview')}
          className={`py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
            currentView === 'overview' ? 'text-slate-900' : 'text-slate-400'
          }`}
        >
          Vue d'ensemble
          {currentView === 'overview' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setCurrentView('promotions')}
          className={`py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
            currentView === 'promotions' ? 'text-slate-900' : 'text-slate-400'
          }`}
        >
          Marketing
          {currentView === 'promotions' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500 rounded-t-full" />}
        </button>
      </div>

      <div className="flex-grow overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          {currentView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-4 space-y-6"
            >
              {/* Main Stats Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Commissions Cumulées</p>
                    <h2 className="text-3xl font-black">
                      {formatCurrency(adminWallet.totalCommissions)}
                    </h2>
                  </div>
                  <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md">
                    <TrendingUp size={20} className="text-yellow-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-[24px]">
                    <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Disponible</p>
                    <p className="text-xl font-black text-yellow-500">{formatCurrency(adminWallet.availableForWithdrawal)}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-[24px]">
                    <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Règlement via</p>
                    <div className="flex items-center gap-2">
                      {activeMethod?.type === 'orange_money' ? (
                        <Smartphone size={14} className="text-orange-500" />
                      ) : (
                        <Banknote size={14} className="text-blue-500" />
                      )}
                      <p className="text-[11px] font-bold truncate">{activeMethod?.label}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleWithdraw}
                  disabled={isProcessing || adminWallet.availableForWithdrawal <= 0}
                  className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-black h-14 rounded-2xl shadow-lg shadow-yellow-500/20"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Transfert en cours...
                    </div>
                  ) : (
                    "Demander le règlement immédiat"
                  )}
                </Button>
              </motion.div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Taux de Split</span>
                  </div>
                  <p className="text-xl font-black text-slate-900">15%</p>
                  <p className="text-[9px] text-slate-500 mt-1">Configuré par défaut</p>
                </div>
                <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-yellow-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Drivers Bloqués</span>
                  </div>
                  <p className="text-xl font-black text-slate-900">12</p>
                  <p className="text-[9px] text-slate-500 mt-1">Solde inférieur à 10k</p>
                </div>
              </div>

              {/* Transactions History */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-slate-900 flex items-center gap-2">
                    <History size={18} className="text-slate-400" />
                    Flux Financiers
                  </h3>
                  <button className="text-[10px] font-black uppercase text-yellow-600 tracking-wider">Télécharger PDF</button>
                </div>

                <div className="space-y-3">
                  {adminWallet.transactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="bg-white p-4 rounded-[24px] border border-slate-200 flex items-center gap-4"
                    >
                      <div className={`p-3 rounded-xl ${
                        tx.type === 'commission' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {tx.type === 'commission' ? <TrendingUp size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate leading-tight">
                          {tx.description}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium mt-1">{tx.date}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className={`text-sm font-black ${
                          tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                        }`}>
                          {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{tx.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'promotions' && (
            <motion.div
              key="promos"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <PromotionsManager />
            </motion.div>
          )}

          {currentView === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 space-y-4"
            >
              <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-yellow-600" />
                  Modes de Règlement
                </h3>
                
                <div className="space-y-3">
                  {adminWallet.settlementMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => toggleMethod(method.id)}
                      className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                        method.isActive 
                          ? 'border-yellow-500 bg-yellow-50/50' 
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className={`p-2 rounded-xl ${
                          method.type === 'orange_money' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {method.type === 'orange_money' ? <Smartphone size={20} /> : <CreditCard size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{method.label}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{method.accountNumber}</p>
                        </div>
                      </div>
                      {method.isActive && <CheckCircle2 size={18} className="text-yellow-600" />}
                    </button>
                  ))}
                  <Button variant="outline" className="w-full h-12 rounded-2xl border-dashed border-slate-300 text-slate-500">
                    <Plus size={18} className="mr-2" />
                    Ajouter un mode de règlement
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
                  <Calendar size={20} className="text-blue-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-blue-900">Transfert Automatique</p>
                    <p className="text-[10px] text-blue-700 mt-0.5 leading-relaxed">
                      Vos fonds seront automatiquement transférés chaque Dimanche à 23:59 vers votre compte par défaut.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Plateforme de Gestion Wongaye v1.4</p>
      </div>
    </div>
  );
};
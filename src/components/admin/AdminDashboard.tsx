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
  PieChart,
  ShieldAlert,
  Map as MapIcon,
  Phone,
  User,
  Navigation,
  FileText,
  LifeBuoy
} from 'lucide-react';
import { Button } from '../ui/button';
import { MOCK_ADMIN_WALLET, calculateCommissionBreakdown } from '../../lib/data';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'sonner';
import { SettlementMethod, Transaction } from '../../types';
import { PromotionsManager } from './PromotionsManager';
import { MapView } from '../MapView';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { DisputeCenter } from './DisputeCenter';
import { FinancialReports } from './FinancialReports';

interface AdminDashboardProps {
  onBack: () => void;
}

type AdminView = 'overview' | 'live' | 'sos' | 'promotions' | 'settings' | 'analytics' | 'disputes' | 'reports';

interface EmergencyAlert {
  id: string;
  type: 'customer' | 'driver';
  userName: string;
  phone: string;
  location: string;
  time: string;
  status: 'active' | 'resolved' | 'dispatched';
  tripId: string;
}

const MOCK_ALERTS: EmergencyAlert[] = [
  {
    id: 'sos-1',
    type: 'customer',
    userName: 'Aissatou Barry',
    phone: '+224 621 44 55 66',
    location: 'Madina Marché, Secteur 3',
    time: 'Il y a 2 min',
    status: 'active',
    tripId: 'trip-9021'
  },
  {
    id: 'sos-2',
    type: 'driver',
    userName: 'Mamadou Diallo',
    phone: '+224 628 11 22 33',
    location: 'Kipé, Centre Emetteur',
    time: 'Il y a 15 min',
    status: 'dispatched',
    tripId: 'trip-8842'
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [adminWallet, setAdminWallet] = useState(MOCK_ADMIN_WALLET);
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(MOCK_ALERTS);

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

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
    toast.success("Alerte marquée comme résolue");
  };

  const activeMethod = adminWallet.settlementMethods.find(m => m.isActive);

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans text-left overflow-hidden">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between border-b sticky top-0 z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ChevronLeft size={24} />
          </Button>
          <div className="flex flex-col items-start leading-none">
            <h1 className="text-xl font-black tracking-tighter text-slate-900">ADMIN CENTER</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Wongaye Logistics</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentView('sos')} 
            className={`rounded-full relative ${currentView === 'sos' ? 'bg-red-50 text-red-600' : 'text-slate-500 hover:bg-red-50 hover:text-red-500'}`}
          >
            <ShieldAlert size={20} />
            {alerts.filter(a => a.status === 'active').length > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full border-2 border-white animate-pulse" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentView('live')} 
            className={`rounded-full ${currentView === 'live' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}
          >
            <MapIcon size={20} />
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white border-b px-4 flex gap-4 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 'overview', label: 'Finance', icon: <TrendingUp size={14} /> },
          { id: 'analytics', label: 'Analyse', icon: <BarChart3 size={14} /> },
          { id: 'live', label: 'Live', icon: <Navigation size={14} /> },
          { id: 'disputes', label: 'Litiges', icon: <LifeBuoy size={14} /> },
          { id: 'sos', label: 'Urgence', icon: <ShieldAlert size={14} /> },
          { id: 'promotions', label: 'Marketing', icon: <Tag size={14} /> },
          { id: 'reports', label: 'Rapports', icon: <FileText size={14} /> },
          { id: 'settings', label: 'Réglages', icon: <Settings size={14} /> },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setCurrentView(tab.id as AdminView)}
            className={`py-4 text-[11px] font-black uppercase tracking-wider transition-all relative flex items-center gap-2 shrink-0 ${
              currentView === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.icon}
            {tab.label}
            {currentView === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500 rounded-t-full" />}
          </button>
        ))}
      </div>

      <div className="flex-grow overflow-y-auto pb-20 scroll-smooth">
        <AnimatePresence mode="wait">
          {currentView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 space-y-6"
            >
              {/* Financial Dashboard */}
              <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Commissions</p>
                    <h2 className="text-3xl font-black">{formatCurrency(adminWallet.totalCommissions)}</h2>
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
                    <p className="text-[11px] font-bold truncate">{activeMethod?.label}</p>
                  </div>
                </div>
                <Button 
                  onClick={handleWithdraw}
                  disabled={isProcessing || adminWallet.availableForWithdrawal <= 0}
                  className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-black h-14 rounded-2xl shadow-lg"
                >
                  {isProcessing ? "Traitement..." : "Demander le règlement"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm" onClick={() => setCurrentView('analytics')}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Taux de Split</span>
                  <p className="text-xl font-black text-slate-900">15%</p>
                </div>
                <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Alertes Solde</span>
                  <p className="text-xl font-black text-slate-900">12</p>
                </div>
              </div>

              {/* Recent Finance Flux */}
              <div className="space-y-4 pt-2 text-left">
                <h3 className="font-black text-slate-900 px-1">Flux Financiers</h3>
                <div className="space-y-3">
                  {adminWallet.transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="bg-white p-4 rounded-[24px] border border-slate-200 flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${tx.type === 'commission' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                        {tx.type === 'commission' ? <TrendingUp size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate leading-tight">{tx.description}</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-1">{tx.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>{tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AnalyticsDashboard />
            </motion.div>
          )}

          {currentView === 'disputes' && (
            <motion.div key="disputes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DisputeCenter />
            </motion.div>
          )}

          {currentView === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FinancialReports />
            </motion.div>
          )}

          {currentView === 'live' && (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full relative min-h-[500px]"
            >
              <div className="absolute inset-0 z-0">
                <MapView />
              </div>
              <div className="absolute bottom-4 inset-x-4 z-10 bg-white/90 backdrop-blur-md rounded-[24px] p-4 shadow-xl border border-white/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-sm tracking-tight text-slate-900 uppercase">Surveillance Flotte</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500">24 CHAUFFEURS ACTIFS</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-100 p-2 rounded-xl text-center">
                    <span className="text-[8px] font-bold text-slate-500 uppercase block">En Course</span>
                    <span className="text-sm font-black">18</span>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-xl text-center">
                    <span className="text-[8px] font-bold text-slate-500 uppercase block">Disponibles</span>
                    <span className="text-sm font-black">6</span>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-xl text-center">
                    <span className="text-[8px] font-bold text-slate-500 uppercase block">Livreurs</span>
                    <span className="text-sm font-black">4</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'sos' && (
            <motion.div
              key="sos"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 space-y-4"
            >
              <div className="bg-red-50 border border-red-100 p-4 rounded-3xl mb-4 flex items-center gap-3">
                <ShieldAlert size={24} className="text-red-500 shrink-0" />
                <p className="text-xs font-bold text-red-700">
                  {alerts.filter(a => a.status !== 'resolved').length} ALERTES DE SÉCURITÉ EN ATTENTE
                </p>
              </div>

              <div className="space-y-4 text-left">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`bg-white rounded-[28px] border-2 shadow-sm overflow-hidden transition-all ${
                      alert.status === 'active' ? 'border-red-500 shadow-red-50' : 'border-slate-100 opacity-80'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                            alert.type === 'customer' ? 'bg-slate-900' : 'bg-yellow-500'
                          }`}>
                            {alert.type === 'customer' ? <User size={24} /> : <Smartphone size={24} />}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900">{alert.userName}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {alert.type === 'customer' ? 'PASSAGER' : 'CHAUFFEUR'} • #{alert.tripId}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          alert.status === 'active' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {alert.status === 'active' ? 'ALERTE SOS' : alert.status === 'dispatched' ? 'SECOURS EN ROUTE' : 'RÉSOLU'}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapIcon size={14} className="text-red-500" />
                          <span className="text-xs font-medium">{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone size={14} className="text-slate-400" />
                          <span className="text-xs font-bold">{alert.phone}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="rounded-2xl border-slate-200 text-slate-600 h-12 font-bold text-xs"
                          onClick={() => window.open(`tel:${alert.phone}`)}
                        >
                          Appeler
                        </Button>
                        {alert.status !== 'resolved' ? (
                          <Button 
                            className="rounded-2xl bg-slate-900 text-white hover:bg-slate-800 h-12 font-bold text-xs"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            Résoudre
                          </Button>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-emerald-600">
                            <CheckCircle2 size={16} />
                            <span className="text-xs font-bold">RÉSOLU</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentView === 'promotions' && (
            <motion.div key="promos" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <PromotionsManager />
            </motion.div>
          )}

          {currentView === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-4 space-y-4">
              <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm text-left">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><CreditCard size={18} className="text-yellow-600" />Modes de Règlement</h3>
                <div className="space-y-3">
                  {adminWallet.settlementMethods.map((method) => (
                    <div key={method.id} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between ${method.isActive ? 'border-yellow-500 bg-yellow-50/50' : 'border-slate-100 bg-white'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${method.type === 'orange_money' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                          {method.type === 'orange_money' ? <Smartphone size={20} /> : <CreditCard size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{method.label}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{method.accountNumber}</p>
                        </div>
                      </div>
                      {method.isActive && <CheckCircle2 size={18} className="text-yellow-600" />}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200 text-center shrink-0">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Console de Commandement Wongaye Security</p>
      </div>
    </div>
  );
};
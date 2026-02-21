import React, { useState, useEffect } from 'react';
import { MapView } from '../MapView';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, Bell, Wallet as WalletIcon, Star, Navigation, 
  MapPin, Phone, X, Check, Activity, LogOut, LayoutDashboard,
  Settings, HelpCircle, UserCircle, ShieldAlert, History, AlertTriangle, Landmark, Plus, ArrowUpRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { DriverStats, RideRequest, Transaction, Wallet, DriverStatus, DriverApplication } from '../../types';
import { MOCK_WALLET, calculateCommissionBreakdown } from '../../lib/data';
import { formatCurrency } from '../../lib/utils';
import { DriverOnboarding } from './DriverOnboarding';

interface DriverInterfaceProps {
  onSwitchToCustomer: () => void;
  onSwitchToAdmin: () => void;
}

type TripPhase = 'idle' | 'approaching' | 'arrived' | 'riding' | 'completed';

export const DriverInterface: React.FC<DriverInterfaceProps> = ({ onSwitchToCustomer, onSwitchToAdmin }) => {
  const [verificationStatus, setVerificationStatus] = useState<DriverStatus>('not_started');
  const [driverApplication, setDriverApplication] = useState<DriverApplication | null>(null);
  
  const [isOnline, setIsOnline] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<RideRequest | null>(null);
  const [activeTrip, setActiveTrip] = useState<RideRequest | null>(null);
  const [tripPhase, setTripPhase] = useState<TripPhase>('idle');
  const [showWallet, setShowWallet] = useState(false);
  
  const [driverWallet, setDriverWallet] = useState<Wallet>({
    id: 'wallet-driver-1',
    userId: 'driver-1',
    balance: 15000, // Starting balance for demo
    currency: "GNF",
    transactions: MOCK_WALLET.transactions
  });

  const [stats, setStats] = useState<DriverStats>({
    todayEarnings: 145000,
    totalTrips: 12,
    rating: 4.9,
    isOnline: false,
    walletBalance: 15000,
    verificationStatus: 'not_started'
  });

  const LOW_BALANCE_THRESHOLD = 10000;

  useEffect(() => {
    // Load persisted status if any
    const savedStatus = localStorage.getItem('wongaye_driver_status');
    if (savedStatus) {
      setVerificationStatus(savedStatus as DriverStatus);
    }
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (verificationStatus === 'approved' && isOnline && !currentRequest && !activeTrip) {
      // Check for low balance before allowing new requests
      if (driverWallet.balance < LOW_BALANCE_THRESHOLD) {
        toast.error("Votre solde est trop bas pour recevoir des courses (Seuil: 10,000 GNF). Veuillez recharger.");
        setIsOnline(false);
        return;
      }

      timeout = setTimeout(() => {
        setCurrentRequest({
          id: 'REQ-' + Math.random().toString(36).substr(2, 9),
          customerName: 'Aissatou Barry',
          pickup: 'Marché de Madina',
          destination: 'Kipé Centre',
          price: 25000,
          category: 'moto',
          paymentMethod: Math.random() > 0.5 ? 'cash' : 'digital'
        });
        toast.info("Nouvelle demande de course !");
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [isOnline, currentRequest, activeTrip, driverWallet.balance, verificationStatus]);

  const handleOnboardingComplete = (application: DriverApplication) => {
    setDriverApplication(application);
    setVerificationStatus(application.status);
    localStorage.setItem('wongaye_driver_status', application.status);
    
    // For demo purposes, let's simulate approval after 30 seconds
    setTimeout(() => {
      setVerificationStatus('approved');
      localStorage.setItem('wongaye_driver_status', 'approved');
      toast.success("Félicitations ! Votre compte chauffeur a été approuvé.");
    }, 30000);
  };

  const handleAcceptRequest = () => {
    setActiveTrip(currentRequest);
    setCurrentRequest(null);
    setTripPhase('approaching');
    toast.success("Course acceptée ! En route vers le passager.");
  };

  const handleRejectRequest = () => {
    setCurrentRequest(null);
    toast.error("Course refusée.");
  };

  const handleArrivedAtPickup = () => {
    setTripPhase('arrived');
    toast.success("Vous êtes arrivé au point de ramassage. Patientez pour le passager.");
  };

  const handleStartTrip = () => {
    setTripPhase('riding');
    toast.success("Course démarrée ! En route vers la destination.");
  };

  const handleCompleteTrip = () => {
    if (!activeTrip) return;

    const { fare, commission, driverNet } = calculateCommissionBreakdown(activeTrip.price);
    
    // Logic for digital vs cash
    let finalDriverNet = 0;
    let balanceChange = 0;
    
    if (activeTrip.paymentMethod === 'digital') {
      // Split payment: driver gets 85% in wallet
      finalDriverNet = driverNet;
      balanceChange = driverNet;
      toast.success(`Course Digital : ${formatCurrency(fare)} payé. +${formatCurrency(driverNet)} ajoutés à votre solde.`);
    } else {
      // Cash payment: driver gets 100% in hand, 15% deducted from wallet
      finalDriverNet = fare;
      balanceChange = -commission;
      toast.success(`Course Espèces : ${formatCurrency(fare)} encaissés. -${formatCurrency(commission)} (commission) déduits de votre solde.`);
    }

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'ride',
      amount: balanceChange,
      date: new Date().toLocaleString('fr-GN'),
      description: `Course #${activeTrip.id.substring(0,6)} (${activeTrip.paymentMethod})`,
      status: 'completed',
      paymentMethod: activeTrip.paymentMethod
    };

    setDriverWallet(prev => ({
      ...prev,
      balance: prev.balance + balanceChange,
      transactions: [newTransaction, ...prev.transactions]
    }));

    setStats(prev => ({
      ...prev,
      todayEarnings: prev.todayEarnings + finalDriverNet,
      totalTrips: prev.totalTrips + 1,
      walletBalance: prev.walletBalance + balanceChange
    }));

    // Check for low balance after trip
    if (driverWallet.balance + balanceChange < LOW_BALANCE_THRESHOLD) {
      toast.warning("Attention: Votre solde est passé sous les 10,000 GNF. Rechargez pour continuer à travailler.");
    }

    setActiveTrip(null);
    setTripPhase('idle');
  };

  const passengerAvatar = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/passenger-avatar-779144de-1771684374818.webp";

  // If not approved, show onboarding
  if (verificationStatus !== 'approved') {
    return (
      <div className="relative h-full w-full bg-white overflow-y-auto">
        <nav className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-3">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setIsMenuOpen(true)}
              className="rounded-full hover:bg-slate-100"
            >
              <Menu size={24} />
            </Button>
            <span className="font-black text-slate-900 tracking-tighter text-xl">WONGAYE</span>
          </div>
          <Button variant="outline" size="sm" onClick={onSwitchToCustomer} className="rounded-full text-xs font-bold">
            Retour Passager
          </Button>
        </nav>

        <DriverOnboarding 
          onComplete={handleOnboardingComplete}
          initialStatus={verificationStatus}
          existingApplication={driverApplication}
        />

        {/* Simplified Side Menu for Onboarding */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[110]"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white z-[120] p-6 flex flex-col shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <UserCircle size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold">Mon Compte</h3>
                    <p className="text-xs text-slate-500">Mode Chauffeur</p>
                  </div>
                </div>

                <div className="space-y-2 flex-grow">
                  <button onClick={() => { onSwitchToCustomer(); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-left">
                    <UserCircle size={20} />
                    <span className="font-bold">Passer en mode Passager</span>
                  </button>
                  <button onClick={() => { onSwitchToAdmin(); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors text-left text-slate-700">
                    <ShieldAlert size={20} />
                    <span className="font-bold">Administration</span>
                  </button>
                </div>

                <div className="mt-auto border-t pt-6">
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-red-500 transition-colors text-left font-bold">
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Secret Toggle for Devs (to quickly approve) */}
        <div className="fixed bottom-4 left-4 opacity-10 hover:opacity-100 transition-opacity">
          <Button size="sm" variant="outline" onClick={() => {
            setVerificationStatus('approved');
            localStorage.setItem('wongaye_driver_status', 'approved');
            toast.info("DEV: Compte approuvé manuellement");
          }}>
            Skip Onboarding
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-slate-50 overflow-hidden font-sans">
      {/* Driver Header */}
      <nav className={`absolute top-0 inset-x-0 z-50 p-4 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm transition-opacity ${tripPhase !== 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-3">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setIsMenuOpen(true)}
            className="rounded-full hover:bg-slate-100"
          >
            <Menu size={24} />
          </Button>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mode Chauffeur</span>
            <span className="font-black text-slate-900 tracking-tighter text-xl">WONGAYE</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Solde Prépaiement</span>
            <span className={`font-black ${driverWallet.balance < LOW_BALANCE_THRESHOLD ? 'text-red-500' : 'text-slate-900'}`}>
              {formatCurrency(driverWallet.balance)}
            </span>
          </div>
          <Button size="icon" variant="outline" className="rounded-full relative border-slate-200" onClick={() => setShowWallet(true)}>
            <WalletIcon size={20} className="text-slate-700" />
            {driverWallet.balance < LOW_BALANCE_THRESHOLD && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            )}
          </Button>
        </div>
      </nav>

      {/* Side Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white z-[120] p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500 shadow-md">
                  <img src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/driver-avatar-89cba9d9-1771684374426.webp" alt="Driver" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Mamadou Diallo</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold">4.9</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 flex-grow">
                <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50 text-slate-900 transition-colors text-left">
                  <LayoutDashboard size={20} />
                  <span className="font-bold">Tableau de bord</span>
                </button>
                <button onClick={() => { setShowWallet(true); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors text-left text-slate-700">
                  <WalletIcon size={20} />
                  <span className="font-bold">Portefeuille</span>
                </button>
                <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors text-left text-slate-700">
                  <Activity size={20} />
                  <span className="font-bold">Historique</span>
                </button>
                <button onClick={() => { onSwitchToAdmin(); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors text-left mt-4 shadow-lg shadow-slate-200">
                  <ShieldAlert size={20} className="text-yellow-500" />
                  <span className="font-bold">Administration Centrale</span>
                </button>
                
                <div className="h-px bg-slate-100 my-4" />

                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    onSwitchToCustomer();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-left"
                >
                  <div className="p-2 bg-blue-500 rounded-lg text-white"><UserCircle size={20} /></div>
                  <span className="font-bold">Passer en mode Passager</span>
                </button>
              </div>

              <div className="mt-auto border-t pt-6">
                <button 
                  onClick={() => {
                    localStorage.removeItem('wongaye_driver_status');
                    window.location.reload();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-red-500 transition-colors text-left font-bold"
                >
                  <LogOut size={20} />
                  <span>Réinitialiser Onboarding</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Map Content */}
      <div className="absolute inset-0 z-0">
        <MapView />
      </div>

      {/* Driver Wallet View */}
      <AnimatePresence>
        {showWallet && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute inset-0 bg-white z-[150] flex flex-col"
          >
            <div className="bg-white p-4 flex items-center gap-4 border-b">
              <Button variant="ghost" size="icon" onClick={() => setShowWallet(false)} className="rounded-full">
                <ChevronLeft size={24} />
              </Button>
              <h1 className="text-xl font-bold">Mon Portefeuille Driver</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className={`p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden ${driverWallet.balance < LOW_BALANCE_THRESHOLD ? 'bg-red-600' : 'bg-slate-900'}`}>
                <div className="relative z-10">
                  <p className="text-white/60 text-xs font-bold uppercase mb-1">Solde Commission</p>
                  <h2 className="text-4xl font-black mb-6">{formatCurrency(driverWallet.balance)}</h2>
                  
                  <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold h-12 rounded-2xl">
                    <Plus size={20} className="mr-2" />
                    Recharger maintenant
                  </Button>
                </div>
                {driverWallet.balance < LOW_BALANCE_THRESHOLD && (
                  <div className="absolute -bottom-2 -right-2 p-4 opacity-20">
                    <AlertTriangle size={120} />
                  </div>
                )}
              </div>

              {driverWallet.balance < LOW_BALANCE_THRESHOLD && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3">
                  <AlertTriangle className="text-red-500 shrink-0" size={20} />
                  <p className="text-xs text-red-700 leading-relaxed font-medium">
                    Votre solde est inférieur au seuil de {formatCurrency(LOW_BALANCE_THRESHOLD)}. 
                    Vous ne recevrez plus de courses tant que vous n'aurez pas rechargé.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <History size={18} className="text-slate-400" />
                  Dernières Activités
                </h3>
                {driverWallet.transactions.map((tx) => (
                  <div key={tx.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                    <div className={`p-3 rounded-xl ${tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {tx.amount > 0 ? <Plus size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{tx.description}</p>
                      <p className="text-[10px] text-slate-500">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                      </p>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{tx.paymentMethod === 'cash' ? 'Déduction' : 'Crédit'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Driver Controls Bottom Sheet */}
      <div className="absolute inset-x-0 bottom-0 z-40 max-w-lg mx-auto p-4 flex flex-col gap-4 pointer-events-auto">
        
        {/* Status Toggle Card (Hidden on trip) */}
        {!activeTrip && (
          <motion.div 
            layout
            className="bg-white rounded-[24px] shadow-xl p-4 border border-slate-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`} />
                <span className="font-bold text-slate-700">
                  {isOnline ? 'Vous êtes en ligne' : 'Vous êtes hors ligne'}
                </span>
              </div>
              <button 
                onClick={() => {
                  if (driverWallet.balance < LOW_BALANCE_THRESHOLD) {
                    toast.error("Solde insuffisant pour se connecter");
                    return;
                  }
                  setIsOnline(!isOnline);
                  toast.success(isOnline ? "Mode hors-ligne activé" : "Vous êtes maintenant prêt à recevoir des courses !");
                }}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Dashboard Quick Stats (only shown when not on trip) */}
        {!activeTrip && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="grid grid-cols-3 gap-2"
          >
            <div className="bg-white p-3 rounded-2xl shadow-lg text-center border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Courses</span>
              <span className="text-lg font-black text-slate-900">{stats.totalTrips}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-lg text-center border-b-4 border-yellow-500">
              <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">Note</span>
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg font-black text-slate-900">{stats.rating}</span>
                <Star size={12} fill="#EAB308" stroke="none" />
              </div>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-lg text-center border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase tracking-tighter">Aujourd'hui</span>
              <span className="text-sm font-black text-emerald-600">{formatCurrency(stats.todayEarnings)}</span>
            </div>
          </motion.div>
        )}

        {/* Active Trip Info (Enhanced On-Trip Interface) */}
        <AnimatePresence>
          {activeTrip && (
            <motion.div 
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
            >
              {/* Trip Phase Indicator */}
              <div className={`h-1.5 w-full bg-slate-100 relative`}>
                <motion.div 
                  className={`absolute top-0 left-0 h-full ${tripPhase === 'approaching' ? 'bg-blue-500' : 'bg-yellow-500'}`}
                  animate={{ width: tripPhase === 'approaching' ? '30%' : tripPhase === 'arrived' ? '50%' : '80%' }}
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md">
                      <img src={passengerAvatar} alt="Passenger" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 inline-block ${
                        tripPhase === 'approaching' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {tripPhase === 'approaching' ? "Vers le client" : tripPhase === 'arrived' ? "Arrivé au client" : "Course en cours"}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">{activeTrip.customerName}</h3>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="secondary" className="rounded-full bg-slate-50">
                      <Phone size={20} className="text-green-600" />
                    </Button>
                    <div className="flex flex-col items-end px-3 py-1 bg-slate-100 rounded-xl">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Paiement</span>
                      <span className="text-[10px] font-black text-slate-800">{activeTrip.paymentMethod === 'cash' ? 'ESPÈCES' : 'SOLDE'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tripPhase === 'approaching' || tripPhase === 'arrived' ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-200 text-slate-400'}`}>
                      <MapPin size={18} />
                    </div>
                    <div className="flex-grow">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Ramassage</span>
                      <span className="text-sm font-bold text-slate-800 line-clamp-1">{activeTrip.pickup}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tripPhase === 'riding' ? 'bg-yellow-100 text-yellow-600 animate-pulse' : 'bg-slate-200 text-slate-400'}`}>
                      <Navigation size={18} />
                    </div>
                    <div className="flex-grow">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Destination</span>
                      <span className="text-sm font-bold text-slate-800 line-clamp-1">{activeTrip.destination}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Prix</span>
                      <span className="text-sm font-black text-slate-900">{activeTrip.price.toLocaleString()} GNF</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-14 rounded-2xl border-2 font-bold flex items-center gap-2 border-slate-200">
                    <Navigation size={18} />
                    GPS
                  </Button>
                  
                  {tripPhase === 'approaching' && (
                    <Button onClick={handleArrivedAtPickup} className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-100">
                      Je suis arrivé
                    </Button>
                  )}
                  
                  {tripPhase === 'arrived' && (
                    <Button onClick={handleStartTrip} className="h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold shadow-lg shadow-yellow-100">
                      Démarrer course
                    </Button>
                  )}
                  
                  {tripPhase === 'riding' && (
                    <Button onClick={handleCompleteTrip} className="h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-100">
                      Terminer course
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Incoming Request Modal */}
      <AnimatePresence>
        {currentRequest && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="bg-yellow-500 p-6 flex items-center justify-between text-white">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">Nouvelle Course</span>
                  <h2 className="text-2xl font-black">{currentRequest.price.toLocaleString()} GNF</h2>
                  <div className="mt-1 inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    <Landmark size={10} />
                    Payé par: {currentRequest.paymentMethod === 'cash' ? 'Espèces' : 'Digital'}
                  </div>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Navigation size={28} />
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                    <img src={passengerAvatar} alt="Passenger" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{currentRequest.customerName}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <Star size={14} fill="#EAB308" stroke="none" />
                      <span>4.8</span>
                      <span className="mx-2">·</span>
                      <span>200m de vous</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-8 relative">
                  <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-slate-100" />
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center z-10">
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">DE</span>
                      <p className="font-bold text-slate-800">{currentRequest.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center z-10 text-yellow-600">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">À</span>
                      <p className="font-bold text-slate-800">{currentRequest.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={handleRejectRequest}
                    variant="outline" 
                    className="h-16 rounded-2xl border-2 text-slate-500 font-bold hover:bg-slate-50 border-slate-100"
                  >
                    <X size={20} className="mr-2" />
                    Refuser
                  </Button>
                  <Button 
                    onClick={handleAcceptRequest}
                    className="h-16 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-black text-lg shadow-xl shadow-yellow-100"
                  >
                    <Check size={24} className="mr-2" />
                    ACCEPTER
                  </Button>
                </div>
              </div>
              
              <div className="h-2 bg-slate-100 w-full">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 15, ease: 'linear' }}
                  className="h-full bg-yellow-500"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
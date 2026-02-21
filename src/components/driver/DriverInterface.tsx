import React, { useState, useEffect } from 'react';
import { MapView } from '../MapView';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, Bell, Wallet as WalletIcon, Star, Navigation, 
  MapPin, Phone, X, Check, Activity, LogOut, LayoutDashboard,
  ShieldAlert, History, AlertTriangle, Landmark, Plus, ArrowUpRight,
  ChevronLeft, MessageSquare, UserCircle, Target, Clock, ShieldCheck,
  Zap, Settings, BarChart3, HelpCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { DriverStats, RideRequest, Transaction, Wallet, DriverStatus, DriverApplication } from '../../types';
import { MOCK_WALLET, calculateCommissionBreakdown, getUserAverageRating, createRating } from '../../lib/data';
import { formatCurrency } from '../../lib/utils';
import { DriverOnboarding } from './DriverOnboarding';
import { RatingDialog } from '../RatingDialog';
import { Chat } from '../Chat';
import { DriverStatsCard } from './DriverStatsCard';

interface DriverInterfaceProps {
  onSwitchToCustomer: () => void;
  onSwitchToAdmin: () => void;
}

type TripPhase = 'idle' | 'approaching' | 'arrived' | 'riding' | 'completed';
type DriverView = 'map' | 'stats' | 'wallet' | 'history';

export const DriverInterface: React.FC<DriverInterfaceProps> = ({ onSwitchToCustomer, onSwitchToAdmin }) => {
  const [verificationStatus, setVerificationStatus] = useState<DriverStatus>('not_started');
  const [driverApplication, setDriverApplication] = useState<DriverApplication | null>(null);
  
  const [isOnline, setIsOnline] = useState(false);
  const [isAutoAccept, setIsAutoAccept] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<RideRequest | null>(null);
  const [activeTrip, setActiveTrip] = useState<RideRequest | null>(null);
  const [tripPhase, setTripPhase] = useState<TripPhase>('idle');
  const [currentView, setCurrentView] = useState<DriverView>('map');
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [driverWallet, setDriverWallet] = useState<Wallet>({
    id: 'wallet-driver-1',
    userId: 'driver-1',
    balance: 15000, 
    currency: "GNF",
    transactions: MOCK_WALLET.transactions
  });

  const [stats, setStats] = useState<DriverStats>(( {
    todayEarnings: 145000,
    totalTrips: 12,
    rating: getUserAverageRating('driver-1'),
    isOnline: false,
    walletBalance: 15000,
    verificationStatus: 'not_started',
    acceptanceRate: 94,
    onlineHours: 6.5
  } as DriverStats));

  const LOW_BALANCE_THRESHOLD = 10000;

  useEffect(() => {
    const savedStatus = localStorage.getItem('wongaye_driver_status');
    if (savedStatus) {
      setVerificationStatus(savedStatus as DriverStatus);
    }
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (verificationStatus === 'approved' && isOnline && !currentRequest && !activeTrip) {
      if (driverWallet.balance < LOW_BALANCE_THRESHOLD) {
        toast.error("Votre solde est trop bas pour recevoir des courses. Veuillez recharger.");
        setIsOnline(false);
        return;
      }

      timeout = setTimeout(() => {
        const newReq: RideRequest = {
          id: 'REQ-' + Math.random().toString(36).substr(2, 9),
          customerName: 'Aissatou Barry',
          pickup: 'Marché de Madina',
          destination: 'Kipé Centre',
          price: 25000,
          category: 'moto',
          paymentMethod: Math.random() > 0.5 ? 'cash' : 'digital',
          distance: '2.4 km',
          duration: '12 min'
        };

        if (isAutoAccept) {
          handleAcceptRequest(newReq);
          toast.success("Nouvelle course acceptée automatiquement !");
        } else {
          setCurrentRequest(newReq);
          toast.info("Nouvelle demande de course !");
        }
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [isOnline, currentRequest, activeTrip, driverWallet.balance, verificationStatus, isAutoAccept]);

  const handleOnboardingComplete = (application: DriverApplication) => {
    setDriverApplication(application);
    setVerificationStatus(application.status);
    localStorage.setItem('wongaye_driver_status', application.status);
    
    setTimeout(() => {
      setVerificationStatus('approved');
      localStorage.setItem('wongaye_driver_status', 'approved');
      toast.success("Félicitations ! Votre compte chauffeur a été approuvé.");
    }, 15000);
  };

  const handleAcceptRequest = (req?: RideRequest) => {
    const targetReq = req || currentRequest;
    if (!targetReq) return;
    
    setActiveTrip(targetReq);
    setCurrentRequest(null);
    setTripPhase('approaching');
    setCurrentView('map');
    toast.success("Course acceptée ! En route vers le passager.");
  };

  const handleRejectRequest = () => {
    setCurrentRequest(null);
    toast.error("Course refusée.");
  };

  const handleArrivedAtPickup = () => {
    setTripPhase('arrived');
    toast.success("Vous êtes arrivé au point de ramassage.");
  };

  const handleStartTrip = () => {
    setTripPhase('riding');
    toast.success("Course démarrée !");
  };

  const handleCompleteTrip = () => {
    if (!activeTrip) return;
    const { fare, commission, driverNet } = calculateCommissionBreakdown(activeTrip.price);
    let balanceChange = activeTrip.paymentMethod === 'digital' ? driverNet : -commission;
    
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'ride',
      amount: balanceChange,
      date: new Date().toLocaleString('fr-GN'),
      description: `Course #${activeTrip.id.substring(0,6)}`,
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
      todayEarnings: prev.todayEarnings + (activeTrip.paymentMethod === 'digital' ? driverNet : fare),
      totalTrips: prev.totalTrips + 1,
      walletBalance: prev.walletBalance + balanceChange
    }));

    setIsRatingOpen(true);
    setTripPhase('completed');
  };

  const openNavigation = () => {
    const destination = activeTrip?.destination || "";
    toast.info(`Ouverture de la navigation vers ${destination}...`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`, '_blank');
  };

  const passengerAvatar = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/passenger-avatar-779144de-1771684374818.webp";

  if (verificationStatus !== 'approved') {
    return (
      <div className="relative h-full w-full bg-white overflow-y-auto">
        <nav className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => setIsMenuOpen(true)} className="rounded-full">
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
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[110]" />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white z-[120] p-6 flex flex-col shadow-2xl text-left">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <UserCircle size={32} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold">Mon Compte</h3>
                    <p className="text-xs text-slate-500">Mode Chauffeur</p>
                  </div>
                </div>
                <div className="space-y-2 flex-grow">
                  <button onClick={() => { onSwitchToCustomer(); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-left font-bold">
                    <UserCircle size={20} />
                    <span>Mode Passager</span>
                  </button>
                  {stats.verificationStatus === 'not_started' && (
                    <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 text-left font-bold text-slate-600">
                      <ShieldCheck size={20} />
                      <span>Devenir Chauffeur</span>
                    </button>
                  )}
                </div>
                <div className="pt-6 border-t border-slate-100">
                   <button onClick={onSwitchToAdmin} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-red-600 text-left font-bold">
                    <ShieldAlert size={20} />
                    <span>Console Admin</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-slate-50 overflow-hidden font-sans">
      {/* Header - Hidden when on trip but only if on map view */}
      <nav className={`absolute top-0 inset-x-0 z-50 p-4 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 ${activeTrip && currentView === 'map' ? '-translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={() => setIsMenuOpen(true)} className="rounded-full"><Menu size={24} /></Button>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Mode Chauffeur</span>
            <span className="font-black text-slate-900 tracking-tighter text-xl">WONGAYE</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Solde</span>
            <span className={`font-black ${driverWallet.balance < LOW_BALANCE_THRESHOLD ? 'text-red-500' : 'text-slate-900'}`}>{formatCurrency(driverWallet.balance)}</span>
          </div>
          <Button size="icon" variant="outline" className="rounded-full relative border-slate-200" onClick={() => setCurrentView('wallet')}>
            <WalletIcon size={20} className="text-slate-700" />
            {driverWallet.balance < LOW_BALANCE_THRESHOLD && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}
          </Button>
        </div>
      </nav>

      <div className="h-full w-full relative pt-20">
        <AnimatePresence mode="wait">
          {currentView === 'map' && (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-0">
              <MapView />
            </motion.div>
          )}

          {currentView === 'stats' && (
            <motion.div key="stats" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="absolute inset-0 bg-slate-50 z-10 overflow-y-auto p-4 pb-32">
              <DriverStatsCard stats={stats} />
            </motion.div>
          )}

          {currentView === 'wallet' && (
             <motion.div key="wallet" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="absolute inset-0 bg-white z-10 overflow-y-auto text-left">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => setCurrentView('map')} className="rounded-full"><ChevronLeft size={24} /></Button>
                    <h2 className="text-2xl font-black text-slate-900">Portefeuille</h2>
                  </div>
                  
                  <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl mb-8">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Solde Disponible</p>
                    <h3 className="text-4xl font-black mb-6">{formatCurrency(driverWallet.balance)}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="bg-yellow-500 text-black font-black h-12 rounded-2xl">Retirer</Button>
                      <Button variant="outline" className="border-white/20 text-white font-black h-12 rounded-2xl">Recharger</Button>
                    </div>
                  </div>

                  <h3 className="font-black text-slate-900 mb-4 px-1">Transactions Récentes</h3>
                  <div className="space-y-3">
                    {driverWallet.transactions.map((tx) => (
                      <div key={tx.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${tx.amount > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            {tx.amount > 0 ? <Plus size={18} /> : <Activity size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{tx.description}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{tx.date}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-black ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating UI elements for Map View */}
      {currentView === 'map' && (
        <>
          {/* Online Toggle */}
          {!activeTrip && (
            <div className="absolute top-24 left-4 right-4 z-40 pointer-events-none">
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-between pointer-events-auto">
                 <div className="bg-white rounded-2xl shadow-xl p-3 border border-slate-100 flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <span className="font-black text-xs text-slate-700 uppercase">{isOnline ? 'En ligne' : 'Hors ligne'}</span>
                    <button onClick={() => { if (driverWallet.balance < LOW_BALANCE_THRESHOLD) { toast.error("Solde insuffisant"); return; } setIsOnline(!isOnline); }} className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                 </div>

                 {isOnline && (
                   <button 
                     onClick={() => { setIsAutoAccept(!isAutoAccept); toast.success(`Mode Auto-Accept : ${!isAutoAccept ? 'Activé' : 'Désactivé'}`); }} 
                     className={`p-3 rounded-2xl shadow-xl border transition-all ${isAutoAccept ? 'bg-slate-900 text-yellow-500 border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
                   >
                     <Zap size={20} className={isAutoAccept ? "fill-yellow-500" : ""} />
                   </button>
                 )}
              </motion.div>
            </div>
          )}

          {/* Active Trip Dashboard */}
          {activeTrip && (
            <div className="absolute bottom-4 inset-x-4 z-[60] max-w-lg mx-auto pointer-events-auto">
              <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 text-left">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md"><img src={passengerAvatar} alt="Passenger" className="w-full h-full object-cover" /></div>
                      <div className="text-left">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 inline-block ${tripPhase === 'riding' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>{tripPhase === 'riding' ? "En cours" : "Vers passager"}</span>
                        <h3 className="text-xl font-bold text-slate-900">{activeTrip.customerName}</h3>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="secondary" className="rounded-full bg-slate-50" onClick={() => setIsChatOpen(true)}>
                        <MessageSquare size={20} className="text-yellow-600" />
                      </Button>
                      <Button size="icon" variant="secondary" className="rounded-full bg-slate-50" onClick={() => window.open(`tel:+224620000000`)}><Phone size={20} className="text-green-600" /></Button>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-xl text-blue-500 mt-0.5"><MapPin size={16} /></div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Destination</p>
                        <p className="text-sm font-bold text-slate-900">{activeTrip.destination}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2">
                       <div className="flex items-center gap-1.5 text-slate-500"><Navigation size={14} /><span className="text-xs font-bold">{activeTrip.distance}</span></div>
                       <div className="flex items-center gap-1.5 text-slate-500"><Clock size={14} /><span className="text-xs font-bold">{activeTrip.duration}</span></div>
                       <div className="flex items-center gap-1.5 text-slate-500"><WalletIcon size={14} /><span className="text-xs font-bold">{formatCurrency(activeTrip.price)}</span></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={openNavigation} variant="outline" className="h-14 rounded-2xl border-slate-200 text-slate-600 font-black flex items-center gap-2">
                      <Navigation size={18} />
                      Naviguer
                    </Button>
                    {tripPhase === 'approaching' && <Button onClick={handleArrivedAtPickup} className="h-14 rounded-2xl bg-blue-600 text-white font-black">Je suis arrivé</Button>}
                    {tripPhase === 'arrived' && <Button onClick={handleStartTrip} className="h-14 rounded-2xl bg-yellow-500 text-white font-black">Démarrer</Button>}
                    {tripPhase === 'riding' && <Button onClick={handleCompleteTrip} className="h-14 rounded-2xl bg-green-600 text-white font-black">Terminer</Button>}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}

      {/* Bottom Navigation */}
      <div className={`absolute bottom-0 inset-x-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center z-50 transition-all duration-300 ${activeTrip && currentView === 'map' ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}>
        {[
          { id: 'map', icon: <Navigation size={22} />, label: 'Carte' },
          { id: 'stats', icon: <BarChart3 size={22} />, label: 'Stats' },
          { id: 'wallet', icon: <WalletIcon size={22} />, label: 'Portefeuille' },
          { id: 'history', icon: <History size={22} />, label: 'Courses' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as DriverView)}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentView === item.id ? 'text-slate-900 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl ${currentView === item.id ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-200' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Request Notification Panel */}
      <AnimatePresence>
        {currentRequest && (
          <div className="absolute inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden text-left p-8">
              <div className="absolute top-0 right-0 p-6">
                <div className="w-14 h-14 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
                   <svg className="w-full h-full -rotate-90">
                      <motion.circle 
                        initial={{ pathLength: 1 }}
                        animate={{ pathLength: 0 }}
                        transition={{ duration: 15, ease: "linear" }}
                        cx="24" cy="24" r="20" 
                        fill="transparent" 
                        stroke="#EAB308" 
                        strokeWidth="4"
                      />
                   </svg>
                   <span className="absolute font-black text-slate-400 text-xs">15s</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                 <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl"><img src={passengerAvatar} alt="Passenger" className="w-full h-full object-cover" /></div>
                 <div>
                    <div className="flex items-center gap-1 mb-1 text-yellow-500"><Star size={14} fill="currentColor" stroke="none" /><span className="text-sm font-black text-slate-900">4.9</span></div>
                    <h3 className="text-xl font-black text-slate-900">{currentRequest.customerName}</h3>
                 </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 mb-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Départ</p>
                    <p className="font-bold text-slate-900">{currentRequest.pickup}</p>
                  </div>
                </div>
                <div className="h-6 border-l-2 border-dashed border-slate-200 ml-[5px]" />
                <div className="flex items-start gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-2 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Arrivée</p>
                    <p className="font-bold text-slate-900">{currentRequest.destination}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8 px-2">
                 <div className="text-left"><p className="text-[10px] font-black text-slate-400 uppercase">Prix estimé</p><p className="text-2xl font-black text-emerald-600">{formatCurrency(currentRequest.price)}</p></div>
                 <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase">Distance</p><p className="text-xl font-black text-slate-900">{currentRequest.distance}</p></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <Button onClick={handleRejectRequest} variant="outline" className="h-16 rounded-2xl font-black border-slate-200 text-slate-400 hover:bg-slate-50">IGNORER</Button>
                 <Button onClick={() => handleAcceptRequest()} className="h-16 rounded-2xl bg-yellow-500 text-black font-black text-lg shadow-lg shadow-yellow-200 hover:bg-yellow-600">ACCEPTER</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Chat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        tripId={activeTrip?.id || ""} 
        currentUserId="driver-1" 
        otherUserName={activeTrip?.customerName || "Passager"} 
        otherUserAvatar={passengerAvatar} 
      />

      {activeTrip && (
        <RatingDialog
          isOpen={isRatingOpen}
          onClose={() => { setIsRatingOpen(false); setActiveTrip(null); setTripPhase('idle'); }}
          tripId={activeTrip.id}
          raterUserId="driver-1"
          ratedUserId="user-123"
          ratedUserName={activeTrip.customerName}
          ratedUserAvatar={passengerAvatar}
          onRatingSubmitted={() => toast.success("Merci d'avoir noté le passager")}
        />
      )}

      {/* Side Menu backdrop logic */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[110]" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white z-[120] p-6 flex flex-col shadow-2xl text-left">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                  <UserCircle size={32} />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-slate-900">Abdoulaye Barry</h3>
                  <div className="flex items-center gap-1.5 text-yellow-500 mt-1">
                    <Star size={12} fill="currentColor" stroke="none" />
                    <span className="text-xs font-black">4.9</span>
                    <span className="text-slate-300 mx-1">•</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Top Chauffeur</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 flex-grow">
                <button onClick={() => { onSwitchToCustomer(); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-left font-bold">
                  <UserCircle size={20} />
                  <span>Passer en Mode Passager</span>
                </button>
                <div className="py-2" />
                <button onClick={() => { setCurrentView('stats'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 text-slate-600 text-left font-bold transition-all">
                  <BarChart3 size={20} />
                  <span>Mes Performances</span>
                </button>
                <button onClick={() => { setCurrentView('wallet'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 text-slate-600 text-left font-bold transition-all">
                  <WalletIcon size={20} />
                  <span>Portefeuille</span>
                </button>
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 text-slate-600 text-left font-bold transition-all">
                  <Settings size={20} />
                  <span>Paramètres Véhicule</span>
                </button>
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 text-slate-600 text-left font-bold transition-all">
                  <HelpCircle size={20} />
                  <span>Centre d'Aide</span>
                </button>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button onClick={onSwitchToAdmin} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 text-red-600 text-left font-bold mb-2">
                  <ShieldAlert size={20} />
                  <span>Console Admin</span>
                </button>
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100 text-slate-400 text-left font-bold">
                  <LogOut size={20} />
                  <span>Déconnexion</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
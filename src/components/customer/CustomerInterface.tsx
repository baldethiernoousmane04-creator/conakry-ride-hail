import React, { useState, useEffect, useMemo } from 'react';
import { MapView } from '../MapView';
import { DestinationInput } from '../DestinationInput';
import { RideSelector } from '../RideSelector';
import { DriverCard } from '../DriverCard';
import { OnTripView } from './OnTripView';
import { RatingDialog } from '../RatingDialog';
import { ProfileAndHistory } from './ProfileAndHistory';
import { Wallet as WalletView } from './Wallet';
import { NotificationCenter } from './NotificationCenter';
import { ProcessPayment } from './ProcessPayment';
import { AppState, RideOption } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Menu, 
  Bell, 
  Wallet as WalletIcon, 
  MapPin, 
  LogOut, 
  UserCircle,
  Trophy
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useAuth } from '../auth/AuthContext';
import { MOCK_USER, getUserAverageRating, MOCK_NOTIFICATIONS, bookRide } from '../../lib/data';
import { sendLocalNotification } from '../../lib/utils';

interface CustomerInterfaceProps {
  onSwitchToDriver: () => void;
}

type SelectedRideInfo = RideOption & { originalPrice?: number; discount?: number };

export const CustomerInterface: React.FC<CustomerInterfaceProps> = ({ onSwitchToDriver }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<AppState>('idle');
  const [isSearching, setIsSearching] = useState(false);
  const [pickup, setPickup] = useState<string>('Position actuelle');
  const [destination, setDestination] = useState<string>('');
  const [selectedRide, setSelectedRide] = useState<SelectedRideInfo | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const driverData = {
    id: 'driver-1',
    name: 'Mamadou Diallo',
    avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/driver-avatar-89cba9d9-1771684374426.webp",
    rating: getUserAverageRating('driver-1')
  };

  const handleDestinationSet = (dest: string) => {
    setDestination(dest);
    setIsSearching(false);
    setStep('selecting');
    toast.success(`Destination définie: ${dest}`);
  };

  const handleRideSelect = (ride: SelectedRideInfo) => {
    setSelectedRide(ride);
  };

  const handleConfirmRide = async () => {
    if (!selectedRide || !destination) return;
    
    setStep('searching');
    
    const isDelivery = selectedRide.category === 'cargo' || selectedRide.category === 'courier';
    const loadingMessage = isDelivery 
      ? "Recherche d'un livreur à proximité..." 
      : "Recherche d'un chauffeur à proximité...";
    
    const loadingToast = toast.loading(loadingMessage);
    
    try {
      const response = await bookRide(pickup, destination, selectedRide);
      
      if (response.success) {
        setActiveTripId(response.tripId);
        
        setTimeout(() => {
          setStep('confirmed');
          toast.dismiss(loadingToast);
          toast.success(isDelivery ? "Livreur trouvé !" : "Chauffeur trouvé !");
          
          sendLocalNotification("Chauffeur en route", {
            body: `${driverData.name} arrive dans 5 minutes.`,
          });
          
          setTimeout(() => {
            setStep('on_trip');
          }, 3000);
        }, 2000);
      } else {
        toast.dismiss(loadingToast);
        toast.error("Une erreur est survenue lors de la réservation.");
        setStep('selecting');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erreur de connexion. Veuillez réessayer.");
      setStep('selecting');
    }
  };

  const resetFlow = () => {
    setStep('idle');
    setDestination('');
    setSelectedRide(null);
    setIsSearching(false);
    setActiveTripId(null);
    setPickup('Position actuelle');
    setPointsEarned(0);
  };

  const handleOpenSearch = () => {
    setIsSearching(true);
  };

  const handleOpenProfile = () => {
    setStep('profile');
    setIsMenuOpen(false);
  };

  const handleOpenHistory = () => {
    setStep('history');
    setIsMenuOpen(false);
  };

  const handleOpenWallet = () => {
    setStep('wallet');
    setIsMenuOpen(false);
  };

  const handleOpenNotifications = () => {
    setStep('notifications');
    setIsMenuOpen(false);
  };

  const handleTripArrived = () => {
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    const earned = Math.floor((selectedRide?.price || 0) / 1000);
    setPointsEarned(earned);
    
    toast.success(`Paiement réussi ! +${earned} points Wongaye Club`, {
      icon: <Trophy className="text-yellow-500" />
    });

    setIsRatingOpen(true);
  };

  const isFullScreenView = useMemo(() => 
    step === 'profile' || step === 'history' || step === 'wallet' || step === 'notifications' || step === 'on_trip' || isSearching
  , [step, isSearching]);

  const unreadNotifs = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden font-sans text-left">
      <nav className={`absolute top-0 inset-x-0 z-50 p-4 flex justify-between items-center transition-all duration-300 ${isFullScreenView ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        <div className="flex gap-2">
          {step !== 'idle' ? (
            <Button 
              size="icon" 
              variant="secondary" 
              onClick={resetFlow}
              className="rounded-full shadow-lg bg-white hover:bg-gray-50 text-black border-none"
            >
              <ChevronLeft size={24} />
            </Button>
          ) : (
            <Button 
              size="icon" 
              variant="secondary" 
              onClick={() => setIsMenuOpen(true)}
              className="rounded-full shadow-lg bg-white hover:bg-gray-50 text-black border-none"
            >
              <Menu size={24} />
            </Button>
          )}
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2">
          <span className="font-black text-black tracking-tighter text-xl uppercase">Wongaye</span>
        </div>

        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="secondary" 
            onClick={handleOpenNotifications}
            className="rounded-full shadow-lg bg-white hover:bg-gray-50 text-black border-none relative"
          >
            <Bell size={20} />
            {unreadNotifs > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white" />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <div key="side-menu-container" className="fixed inset-0 z-[110]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 w-4/5 max-sm:w-full max-w-sm bg-white p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500 shadow-md bg-gray-100">
                  <img 
                    src={user?.user_metadata?.avatar_url || MOCK_USER.avatar} 
                    alt="User" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div onClick={handleOpenProfile} className="cursor-pointer text-left">
                  <h3 className="text-xl font-bold">{user?.user_metadata?.full_name || MOCK_USER.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <span>Mon compte</span>
                    <ChevronLeft size={14} className="rotate-180" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 flex-grow">
                <button onClick={handleOpenWallet} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left font-bold text-gray-700">
                  <div className="p-2 bg-gray-100 rounded-lg text-black"><WalletIcon size={20} /></div>
                  <span>Portefeuille</span>
                </button>
                <button onClick={handleOpenHistory} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left font-bold text-gray-700">
                  <div className="p-2 bg-gray-100 rounded-lg text-black"><MapPin size={20} /></div>
                  <span>Mes Trajets</span>
                </button>
                <button onClick={handleOpenNotifications} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left font-bold text-gray-700">
                  <div className="p-2 bg-gray-100 rounded-lg text-black"><Bell size={20} /></div>
                  <span>Notifications</span>
                </button>
                
                <div className="border-t border-gray-100 my-4" />
                
                <div className="bg-yellow-50 p-4 rounded-2xl mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-yellow-600 tracking-wider">Wongaye Club</span>
                    <Trophy size={14} className="text-yellow-500" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-black">{MOCK_USER.loyaltyPoints} PTS</p>
                      <p className="text-[10px] text-yellow-700">Niveau Or</p>
                    </div>
                    <Button size="sm" onClick={() => setStep('profile')} className="h-7 rounded-lg bg-yellow-500 text-white text-[10px] font-black">
                      VOIR
                    </Button>
                  </div>
                </div>

                <button onClick={() => { setIsMenuOpen(false); onSwitchToDriver(); }} className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors text-left font-bold">
                  <div className="p-2 bg-slate-800 rounded-lg text-yellow-500"><UserCircle size={20} /></div>
                  <span>Mode Chauffeur</span>
                </button>
              </div>

              <div className="mt-auto border-t pt-6 text-left">
                <button onClick={() => toast.info("Déconnexion...")} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-red-500 transition-colors font-bold">
                  <LogOut size={20} />
                  <span>Déconnexion</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0"><MapView /></div>

      <AnimatePresence mode="wait">
        {step === 'wallet' && <motion.div key="wallet" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute inset-0 z-[200] bg-white"><WalletView onBack={() => setStep('idle')} /></motion.div>}
        {step === 'notifications' && <motion.div key="notifs" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute inset-0 z-[200] bg-white"><NotificationCenter onBack={() => setStep('idle')} /></motion.div>}
        {(step === 'profile' || step === 'history') && <motion.div key="profile" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute inset-0 z-[200] bg-white"><ProfileAndHistory onBack={() => setStep('idle')} onLogout={resetFlow} /></motion.div>}
        
        {isSearching && (
          <motion.div 
            key="search" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }} 
            className="absolute inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="p-2 flex items-center gap-2 text-left">
              <Button variant="ghost" size="icon" onClick={() => setIsSearching(false)}>
                <ChevronLeft size={24} />
              </Button>
              <span className="font-bold text-lg text-black uppercase tracking-tighter">DÉFINIR L'ITINÉRAIRE</span>
            </div>
            <div className="flex-grow">
              <DestinationInput 
                onDestinationSet={handleDestinationSet} 
                onSelectOnMap={() => setIsSearching(false)} 
              />
            </div>
          </motion.div>
        )}
        
        {step === 'on_trip' && selectedRide && (
          <OnTripView 
            key="trip" 
            ride={selectedRide} 
            onArrived={handleTripArrived} 
            onCancel={resetFlow} 
          />
        )}
      </AnimatePresence>

      {!isFullScreenView && (
        <div className="absolute inset-x-0 bottom-0 z-40 max-w-lg mx-auto p-4 pointer-events-none text-left">
          <motion.div layout className="bg-white rounded-[40px] shadow-2xl p-7 pointer-events-auto border border-gray-100">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-8" />
            <AnimatePresence mode="wait">
              {step === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight uppercase">
                      Bonjour {(user?.user_metadata?.full_name || MOCK_USER.name).split(' ')[0]} !
                    </h1>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Prêt pour votre prochain déplacement ?</p>
                  </div>
                  <div 
                    onClick={handleOpenSearch} 
                    className="flex items-center gap-4 bg-slate-900 p-6 rounded-[28px] border border-slate-800 cursor-pointer hover:bg-slate-800 transition-all group shadow-xl shadow-slate-200"
                  >
                    <div className="p-2.5 bg-yellow-500 rounded-2xl text-white group-hover:scale-110 transition-transform">
                      <MapPin size={24} />
                    </div>
                    <span className="text-white font-black text-lg tracking-tight uppercase">OÙ ALLEZ-VOUS ?</span>
                  </div>
                </motion.div>
              )}
              
              {step === 'selecting' && (
                <motion.div key="selecting" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">CHOIX DU SERVICE</h2>
                      <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">Vers: {destination}</p>
                    </div>
                  </div>
                  
                  <RideSelector 
                    selectedId={selectedRide?.id || null} 
                    onSelect={handleRideSelect} 
                    destination={destination}
                  />
                  
                  <Button 
                    className={`w-full h-16 rounded-[24px] text-lg font-black transition-all shadow-2xl ${selectedRide ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} 
                    disabled={!selectedRide} 
                    onClick={handleConfirmRide}
                  >
                    {selectedRide ? `CONFIRMER ${selectedRide.name.toUpperCase()}` : 'CHOISIR UNE OPTION'}
                  </Button>
                </motion.div>
              )}
              
              {step === 'searching' && (
                <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-14 flex flex-col items-center justify-center space-y-8 text-center">
                  <div className="relative mx-auto">
                    <div className="w-28 h-28 border-4 border-yellow-100 border-t-yellow-500 rounded-full animate-spin mx-auto shadow-inner" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">RECHERCHE...</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Partenaire Wongaye le plus proche</p>
                  </div>
                  <Button variant="ghost" className="text-red-500 font-black uppercase text-xs tracking-widest" onClick={() => setStep('selecting')}>Annuler</Button>
                </motion.div>
              )}
              
              {step === 'confirmed' && selectedRide && (
                <DriverCard 
                  rideName={selectedRide.name} 
                  category={selectedRide.category} 
                  driverRating={driverData.rating} 
                  onCancel={resetFlow} 
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {isPaymentOpen && activeTripId && selectedRide && (
        <ProcessPayment 
          rideId={activeTripId}
          amount={selectedRide.price}
          onSuccess={handlePaymentSuccess}
          onCancel={() => { setIsPaymentOpen(false); resetFlow(); }}
        />
      )}

      {activeTripId && (
        <RatingDialog
          isOpen={isRatingOpen}
          onClose={() => { setIsRatingOpen(false); resetFlow(); }}
          tripId={activeTripId}
          raterUserId={user?.id || MOCK_USER.id}
          ratedUserId={driverData.id}
          ratedUserName={driverData.name}
          ratedUserAvatar={driverData.avatar}
          onRatingSubmitted={() => toast.success("Note enregistrée !")}
        />
      )}
    </div>
  );
};
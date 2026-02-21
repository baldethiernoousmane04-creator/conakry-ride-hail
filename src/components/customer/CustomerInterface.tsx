import React, { useState, useEffect, useMemo } from 'react';
import { MapView } from '../MapView';
import { DestinationInput } from '../DestinationInput';
import { RideSelector } from '../RideSelector';
import { DriverCard } from '../DriverCard';
import { ProfileAndHistory } from './ProfileAndHistory';
import { Wallet as WalletView } from './Wallet';
import { AppState, RideOption } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Menu, 
  Bell, 
  Wallet as WalletIcon, 
  MapPin, 
  LogOut, 
  UserCircle 
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { MOCK_USER } from '../../lib/data';

interface CustomerInterfaceProps {
  onSwitchToDriver: () => void;
}

export const CustomerInterface: React.FC<CustomerInterfaceProps> = ({ onSwitchToDriver }) => {
  const [step, setStep] = useState<AppState>('idle');
  const [isSearching, setIsSearching] = useState(false);
  const [destination, setDestination] = useState<string>('');
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDestinationSet = (dest: string) => {
    setDestination(dest);
    setIsSearching(false);
    setStep('selecting');
    toast.success(`Destination définie: ${dest}`);
  };

  const handleRideSelect = (ride: RideOption) => {
    setSelectedRide(ride);
  };

  const handleConfirmRide = () => {
    if (!selectedRide) return;
    setStep('searching');
    
    const isDelivery = selectedRide.category === 'cargo' || selectedRide.category === 'courier';
    const loadingMessage = isDelivery 
      ? "Recherche d'un livreur à proximité..." 
      : "Recherche d'un chauffeur à proximité...";
    
    const loadingToast = toast.loading(loadingMessage);
    
    setTimeout(() => {
      setStep('confirmed');
      toast.dismiss(loadingToast);
      toast.success(isDelivery ? "Livreur trouvé !" : "Chauffeur trouvé !");
    }, 3000);
  };

  const resetFlow = () => {
    setStep('idle');
    setDestination('');
    setSelectedRide(null);
    setIsSearching(false);
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

  const isFullScreenView = useMemo(() => 
    step === 'profile' || step === 'history' || step === 'wallet' || isSearching
  , [step, isSearching]);

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden font-sans">
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
          <span className="font-black text-black tracking-tighter text-xl">WONGAYE</span>
        </div>

        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full shadow-lg bg-white hover:bg-gray-50 text-black border-none"
          >
            <Bell size={20} />
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
              className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500 shadow-md bg-gray-100">
                  {MOCK_USER.avatar && <img src={MOCK_USER.avatar} alt="User" className="w-full h-full object-cover" />}
                </div>
                <div onClick={handleOpenProfile} className="cursor-pointer">
                  <h3 className="text-xl font-bold">{MOCK_USER.name}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <span>Modifier le profil</span>
                    <ChevronLeft size={14} className="rotate-180" />
                  </p>
                </div>
              </div>

              <div className="space-y-2 flex-grow">
                <button 
                  onClick={handleOpenWallet}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="p-2 bg-gray-100 rounded-lg"><WalletIcon size={20} /></div>
                  <span className="font-bold">Portefeuille</span>
                </button>
                <button 
                  onClick={handleOpenHistory}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="p-2 bg-gray-100 rounded-lg"><MapPin size={20} /></div>
                  <span className="font-bold">Mes Trajets</span>
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    onSwitchToDriver();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors text-left"
                >
                  <div className="p-2 bg-yellow-500 rounded-lg text-white"><UserCircle size={20} /></div>
                  <span className="font-bold">Devenir Chauffeur</span>
                </button>
              </div>

              <div className="mt-auto border-t pt-6">
                <button 
                  onClick={() => toast.info("Déconnexion en cours...")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-red-500 transition-colors text-left"
                >
                  <LogOut size={20} />
                  <span className="font-bold">Déconnexion</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0">
        <MapView />
      </div>

      <AnimatePresence mode="wait">
        {step === 'wallet' && (
          <motion.div
            key="wallet-view"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-[200] bg-white"
          >
            <WalletView onBack={resetFlow} />
          </motion.div>
        )}
        
        {(step === 'profile' || step === 'history') && (
          <motion.div
            key="profile-history-view"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-[200] bg-white"
          >
            <ProfileAndHistory 
              onBack={resetFlow} 
              onLogout={() => {
                toast.success("Déconnecté");
                resetFlow();
              }} 
            />
          </motion.div>
        )}

        {isSearching && (
          <motion.div 
            key="search-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 z-[100] bg-white"
          >
            <div className="h-full flex flex-col">
              <div className="p-2 flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsSearching(false)}>
                  <ChevronLeft size={24} />
                </Button>
                <span className="font-bold text-lg">Où allez-vous ?</span>
              </div>
              <div className="flex-grow">
                <DestinationInput 
                  onDestinationSet={handleDestinationSet} 
                  onSelectOnMap={() => {
                    setIsSearching(false);
                    toast.info("Mode sélection sur carte activé");
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isFullScreenView && (
        <div className="absolute inset-x-0 bottom-0 z-40 max-w-lg mx-auto p-4 pointer-events-none">
          <motion.div 
            layout
            className="bg-white rounded-[32px] shadow-[0_-8px_30px_rgb(0,0,0,0.12)] p-6 overflow-hidden pointer-events-auto"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

            <AnimatePresence mode="wait">
              {step === 'idle' && (
                <motion.div
                  key="idle-state"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Bienvenue</h1>
                    <p className="text-gray-500 text-sm">Que voulez-vous commander aujourd'hui ?</p>
                  </div>
                  
                  <div 
                    onClick={handleOpenSearch}
                    className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-yellow-500 rounded-lg text-white">
                      <MapPin size={20} />
                    </div>
                    <span className="text-gray-400 font-medium">Saisir votre destination...</span>
                  </div>

                  <div className="mt-6 flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {['Maison', 'Travail', 'Marché de Madina', 'Aéroport'].map((place) => (
                      <button 
                        key={place}
                        onClick={() => handleDestinationSet(place)}
                        className="flex flex-col items-center gap-1 min-w-[80px]"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-yellow-100 hover:text-yellow-600 transition-colors">
                          <MapPin size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-600 text-center">{place}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 'selecting' && (
                <motion.div
                  key="selecting-state"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-bold text-gray-900">Vitesse & Confort</h2>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">Vers: {destination}</p>
                    </div>
                    <div 
                      onClick={handleOpenWallet}
                      className="flex items-center gap-1 text-xs font-semibold bg-gray-100 px-3 py-1.5 rounded-full text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <WalletIcon size={12} />
                      <span>Wongaye Pay</span>
                    </div>
                  </div>
                  
                  <RideSelector 
                    selectedId={selectedRide?.id} 
                    onSelect={handleRideSelect} 
                  />
                  
                  <Button 
                    className={`w-full h-14 rounded-2xl text-lg font-bold transition-all shadow-xl ${
                      selectedRide 
                        ? 'bg-black hover:bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!selectedRide}
                    onClick={handleConfirmRide}
                  >
                    {selectedRide 
                      ? (selectedRide.category === 'cargo' || selectedRide.category === 'courier' 
                          ? `Confirmer ${selectedRide.name}` 
                          : `Commander ${selectedRide.name}`) 
                      : 'Choisir un véhicule'
                    }
                  </Button>
                </motion.div>
              )}

              {step === 'searching' && (
                <motion.div
                  key="searching-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 flex flex-col items-center justify-center space-y-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-yellow-100 border-t-yellow-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">Recherche en cours...</h2>
                    <p className="text-gray-500 text-sm">Un partenaire WONGAYE arrive bientôt</p>
                  </div>
                  <Button variant="ghost" className="text-red-500" onClick={() => setStep('selecting')}>
                    Annuler la recherche
                  </Button>
                </motion.div>
              )}

              {step === 'confirmed' && selectedRide && (
                <div key="confirmed-state">
                  <DriverCard 
                    rideName={selectedRide.name} 
                    category={selectedRide.category}
                    onCancel={resetFlow} 
                  />
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
};
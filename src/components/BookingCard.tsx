import React, { useState } from 'react';
import { Search, MapPin, Navigation, Clock, Star, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DestinationInput } from './DestinationInput';
import { RideSelector } from './RideSelector';
import { toast } from 'sonner';
import { RideOption } from '../types';
import { Button } from './ui/button';
import { formatCurrency } from '../lib/utils';

type BookingStep = 'search' | 'select' | 'waiting';

export const BookingCard = () => {
  const [step, setStep] = useState<BookingStep>('search');
  const [pickup, setPickup] = useState('Ma position actuelle');
  const [destination, setDestination] = useState('');
  const [selectedRide, setSelectedRide] = useState<(RideOption & { originalPrice: number; discount: number }) | null>(null);

  const handleDestinationConfirm = () => {
    if (!destination) {
      toast.error('Veuillez entrer une destination');
      return;
    }
    setStep('select');
  };

  const handleRideSelect = (ride: RideOption & { originalPrice: number; discount: number }) => {
    setSelectedRide(ride);
  };

  const handleConfirmBooking = () => {
    if (!selectedRide) {
      toast.error('Veuillez sélectionner un type de trajet');
      return;
    }
    setStep('waiting');
    toast.success('Recherche de votre chauffeur...');
    
    // Simulate finding a driver
    setTimeout(() => {
      toast.success('Chauffeur trouvé ! Arrivée dans 4 min.');
    }, 3000);
  };

  const reset = () => {
    setStep('search');
    setDestination('');
    setSelectedRide(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-8 md:max-w-md md:mx-auto md:relative md:mt-10 pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <DestinationInput 
                  pickup={pickup} 
                  setPickup={setPickup}
                  destination={destination}
                  setDestination={setDestination}
                  onConfirm={handleDestinationConfirm}
                />
              </motion.div>
            )}

            {step === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <button 
                    onClick={() => setStep('search')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h2 className="font-bold text-xl text-gray-900">Choisissez votre trajet</h2>
                </div>
                
                <RideSelector 
                  onSelect={handleRideSelect} 
                  selectedId={selectedRide?.id || null}
                  destination={destination}
                />

                <div className="mt-6">
                  <Button 
                    onClick={handleConfirmBooking}
                    disabled={!selectedRide}
                    className="w-full h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-black font-black text-lg shadow-lg shadow-yellow-500/20 group"
                  >
                    {selectedRide ? (
                      <div className="flex items-center justify-between w-full px-2">
                        <span>Réserver {selectedRide.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm opacity-60 line-through">{selectedRide.discount > 0 ? formatCurrency(selectedRide.originalPrice) : ''}</span>
                          <span className="bg-black/10 px-3 py-1 rounded-xl">{formatCurrency(selectedRide.price)}</span>
                        </div>
                      </div>
                    ) : (
                      "Sélectionnez un trajet"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'waiting' && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Navigation className="w-8 h-8 text-indigo-600 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Recherche en cours...</h3>
                <p className="text-gray-500 mb-6">Mise en relation avec les chauffeurs à proximité de {pickup}</p>
                <button 
                  onClick={reset}
                  className="px-6 py-2 border border-gray-200 rounded-full text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
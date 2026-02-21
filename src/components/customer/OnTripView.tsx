import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  Share2, 
  ChevronUp, 
  MapPin, 
  Clock, 
  Navigation,
  Star,
  MoreVertical,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { RideOption } from '../../types';

interface OnTripViewProps {
  ride: RideOption;
  onArrived?: () => void;
  onCancel?: () => void;
}

export const OnTripView: React.FC<OnTripViewProps> = ({ ride, onArrived, onCancel }) => {
  const [eta, setEta] = useState(12);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tripStatus, setTripStatus] = useState<'approaching' | 'riding' | 'arrived'>('approaching');

  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) {
          if (tripStatus === 'approaching') {
            setTripStatus('riding');
            toast.success("Votre chauffeur est arrivé !");
            return 15; // Time for the actual ride
          }
          if (tripStatus === 'riding') {
            setTripStatus('arrived');
            onArrived?.();
            return 0;
          }
          return 0;
        }
        return prev - 1;
      });

      setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 5000);

    return () => clearInterval(timer);
  }, [tripStatus, onArrived]);

  const handleSOS = () => {
    toast.error("Alerte SOS envoyée aux autorités et à vos contacts d'urgence", {
      duration: 5000,
      icon: <ShieldAlert className="text-red-500" />,
    });
  };

  const handleShare = () => {
    toast.info("Lien de suivi de course copié !");
  };

  const driverImage = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/driver-avatar-89cba9d9-1771684374426.webp";

  return (
    <div className="absolute inset-x-0 bottom-0 z-50 p-4 max-w-lg mx-auto pointer-events-none">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[32px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] overflow-hidden pointer-events-auto border border-gray-100"
      >
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100 relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-yellow-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>

        <div className="p-6">
          {/* Status & ETA Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-yellow-600 mb-1">
                {tripStatus === 'approaching' ? "Le chauffeur arrive" : tripStatus === 'riding' ? "Course en cours" : "Arrivée à destination"}
              </span>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-400" />
                <span className="text-2xl font-black text-gray-900">{eta} min</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleShare}
                className="rounded-full border-gray-200 hover:bg-gray-50"
              >
                <Share2 size={20} />
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={handleSOS}
                className="rounded-full shadow-lg shadow-red-100"
              >
                <ShieldAlert size={20} />
              </Button>
            </div>
          </div>

          {/* Driver Info */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                <img src={driverImage} alt="Driver" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white flex items-center gap-1">
                <Star size={10} fill="currentColor" />
                4.9
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-lg text-gray-900">Mamadou D.</h3>
              <p className="text-sm text-gray-500 font-medium">TVS {ride.name} • GV-9042-A</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="secondary" className="rounded-full bg-white shadow-sm">
                <MessageSquare size={18} className="text-yellow-600" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full bg-white shadow-sm">
                <Phone size={18} className="text-yellow-600" />
              </Button>
            </div>
          </div>

          {/* Collapsible Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                <MapPin size={16} />
              </div>
              <div className="flex-grow">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Destination</p>
                <p className="text-sm font-bold text-gray-800 line-clamp-1">Kipé Centre, Centre Emetteur</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Prix</p>
                <p className="text-sm font-black text-gray-900">{ride.price.toLocaleString()} GNF</p>
              </div>
            </div>

            {isExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="pt-4 border-t border-gray-100 space-y-4"
              >
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                      <Navigation size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-700">Trajet optimisé</p>
                      <p className="text-[10px] text-blue-600">Via Autoroute Fidèle Castro</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-xs">Détails</Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Paiement</p>
                    <p className="text-xs font-bold text-gray-700">Wongaye Pay</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Capacité</p>
                    <p className="text-xs font-bold text-gray-700">{ride.capacity} Passager(s)</p>
                  </div>
                </div>
              </motion.div>
            )}

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-2 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronUp size={20} />
              </motion.div>
            </button>

            {tripStatus === 'approaching' && (
              <Button 
                variant="ghost" 
                className="w-full text-red-500 font-bold hover:bg-red-50"
                onClick={onCancel}
              >
                Annuler la course
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
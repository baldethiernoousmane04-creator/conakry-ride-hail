import React from 'react';
import { Star, Phone, MessageSquare, Car, Package, Truck, Bike } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

interface DriverCardProps {
  rideName: string;
  category?: string;
  onCancel: () => void;
  driverName?: string;
  driverRating?: number;
  driverAvatar?: string;
}

export const DriverCard: React.FC<DriverCardProps> = ({ 
  rideName, 
  category, 
  onCancel,
  driverName = "Mamadou Sylla",
  driverRating = 4.9,
  driverAvatar = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
}) => {
  const isDelivery = category === 'cargo' || category === 'courier';

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center text-left">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isDelivery ? 'Livreur en route' : 'Chauffeur en route'}
          </h2>
          <p className="text-sm text-green-600 font-medium">Arrivée dans 4 minutes</p>
        </div>
        <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1">
          <Star size={14} className="fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-bold text-yellow-700">{driverRating}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
            <img 
              src={driverAvatar} 
              alt="Partenaire" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-1.5 rounded-full border-2 border-white">
            {category === 'cargo' ? (
              <Truck size={14} className="text-white" />
            ) : category === 'courier' ? (
              <Package size={14} className="text-white" />
            ) : category === 'moto' ? (
              <Bike size={14} className="text-white" />
            ) : (
              <Car size={14} className="text-white" />
            )}
          </div>
        </div>
        <div className="flex-grow text-left">
          <h3 className="font-bold text-gray-900">{driverName}</h3>
          <p className="text-sm text-gray-500 uppercase font-mono">RC-1234-A • {rideName}</p>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" className="rounded-full w-10 h-10 border-gray-200">
            <Phone size={18} className="text-gray-600" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full w-10 h-10 border-gray-200">
            <MessageSquare size={18} className="text-gray-600" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Paiement à l'arrivée</span>
          <span className="font-bold">Espèces</span>
        </div>
        <Button 
          variant="ghost" 
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 font-bold h-12 rounded-2xl"
          onClick={onCancel}
        >
          {isDelivery ? 'Annuler la livraison' : 'Annuler la course'}
        </Button>
      </div>
    </motion.div>
  );
};
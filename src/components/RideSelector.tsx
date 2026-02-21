import React, { useState, useMemo } from 'react';
import { RideOption, MotorcycleModel, DeliveryService } from '../types';
import { Users, Clock, Zap, Gem, Package, Truck, Bike, Tag, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOTORCYCLE_MODELS, DELIVERY_SERVICES, validateDiscountCode } from '../lib/data';
import { formatCurrency } from '../lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';

const BASE_CAR_OPTIONS: RideOption[] = [
  {
    id: 'standard',
    name: 'Wongaye Classique',
    price: 45000,
    estimatedTime: '5 min',
    capacity: 4,
    description: 'Confortable et abordable',
    category: 'car',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/standard-car-wongaye-678d0988-1771678359899.webp'
  },
  {
    id: 'premium',
    name: 'Wongaye Premium',
    price: 85000,
    estimatedTime: '4 min',
    capacity: 4,
    description: 'Berlines de luxe climatisées',
    category: 'premium',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/luxury-car-wongaye-17a2043d-1771678359586.webp'
  }
];

interface RideSelectorProps {
  selectedId: string | null;
  onSelect: (ride: RideOption & { originalPrice: number; discount: number }) => void;
  destination: string;
}

export const RideSelector: React.FC<RideSelectorProps> = ({ selectedId, onSelect, destination }) => {
  const [activeTab, setActiveTab] = useState<'ride' | 'delivery'>('ride');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed'; value: number } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const motorcycleOptions: RideOption[] = (MOTORCYCLE_MODELS as MotorcycleModel[]).map(model => ({
    id: `moto-${model.id}`,
    name: `Wongaye ${model.name}`,
    price: model.basePrice,
    estimatedTime: model.category === 'Premium' ? '1 min' : model.category === 'Popular' ? '3 min' : '5 min',
    capacity: 1,
    description: model.description,
    category: 'moto',
    model: model.name,
    isRare: model.isRare,
    image: model.image
  }));

  const deliveryOptions: RideOption[] = (DELIVERY_SERVICES as DeliveryService[]).map(service => ({
    id: service.id,
    name: service.name,
    price: service.basePrice,
    estimatedTime: service.estimatedTime,
    capacity: service.category === 'cargo' ? 2 : 1,
    description: service.description,
    category: service.category === 'cargo' ? 'cargo' : 'courier',
    image: service.image
  }));

  const rideOptions = [...motorcycleOptions, ...BASE_CAR_OPTIONS];
  const currentOptions = activeTab === 'ride' ? rideOptions : deliveryOptions;

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    
    setIsApplying(true);
    // Use a reference price (first option) to validate if code works
    const validation = validateDiscountCode(promoCode, currentOptions[0].price);
    
    setTimeout(() => {
      if (validation.isValid && validation.codeDetails) {
        setAppliedDiscount({
          code: validation.codeDetails.code,
          discount: validation.discount || 0,
          type: validation.codeDetails.discountType,
          value: validation.codeDetails.discountValue
        });
        toast.success(validation.message);
      } else {
        toast.error(validation.message);
      }
      setIsApplying(false);
    }, 800);
  };

  const removePromo = () => {
    setAppliedDiscount(null);
    setPromoCode('');
    toast.info("Code promo retiré");
  };

  const getDiscountedPrice = (originalPrice: number) => {
    if (!appliedDiscount) return { price: originalPrice, discount: 0 };
    
    let discount = 0;
    if (appliedDiscount.type === 'percentage') {
      discount = (originalPrice * appliedDiscount.value) / 100;
    } else {
      discount = appliedDiscount.value;
    }
    return { price: Math.max(0, originalPrice - discount), discount };
  };

  return (
    <div className="space-y-4 py-2">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-gray-100 rounded-2xl">
        <button
          onClick={() => setActiveTab('ride')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'ride' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Bike size={16} className={activeTab === 'ride' ? 'text-yellow-500' : ''} />
          Transport
        </button>
        <button
          onClick={() => setActiveTab('delivery')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'delivery' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Package size={16} className={activeTab === 'delivery' ? 'text-indigo-500' : ''} />
          Livraison
        </button>
      </div>

      {/* Ride Options List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {currentOptions.map((ride) => {
              const { price: discountedPrice, discount } = getDiscountedPrice(ride.price);
              return (
                <motion.div
                  key={ride.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect({ ...ride, price: discountedPrice, originalPrice: ride.price, discount })}
                  className={`flex items-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedId === ride.id
                      ? 'border-yellow-500 bg-yellow-50/50'
                      : 'border-transparent bg-white hover:border-gray-100 shadow-sm'
                  }`}
                >
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative border border-gray-100">
                    <img src={ride.image} alt={ride.name} className="w-full h-full object-cover" />
                    {ride.isRare && (
                      <div className="absolute top-0 right-0 p-1">
                        <Gem size={12} className="text-yellow-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-gray-900">{ride.name}</h4>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded">
                            <Clock size={10} /> {ride.estimatedTime}
                          </p>
                          {ride.category === 'cargo' ? (
                            <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded">
                              <Truck size={10} /> XL
                            </p>
                          ) : (
                            <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded">
                              <Users size={10} /> {ride.capacity}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {discount > 0 && (
                          <p className="text-[10px] text-gray-400 line-through font-bold">{formatCurrency(ride.price)}</p>
                        )}
                        <span className={`font-black whitespace-nowrap ${discount > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                          {formatCurrency(discountedPrice)}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-1 italic">{ride.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Promo Code Section */}
      <div className="pt-2 border-t border-gray-100">
        <AnimatePresence mode="wait">
          {appliedDiscount ? (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">Code {appliedDiscount.code} appliqué</p>
                  <p className="text-[10px] text-emerald-600 font-medium">Réduction active sur votre trajet</p>
                </div>
              </div>
              <button 
                onClick={removePromo}
                className="p-1.5 hover:bg-emerald-100 rounded-full transition-colors text-emerald-700"
              >
                <X size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <div className="relative flex-grow">
                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Code promo (ex: WONGAYE10)" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="pl-9 h-11 rounded-xl bg-gray-50 border-gray-100 text-sm font-medium"
                />
              </div>
              <Button 
                onClick={handleApplyPromo}
                disabled={!promoCode.trim() || isApplying}
                className="h-11 px-4 bg-slate-900 text-white rounded-xl font-bold text-xs"
              >
                {isApplying ? "..." : "Appliquer"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
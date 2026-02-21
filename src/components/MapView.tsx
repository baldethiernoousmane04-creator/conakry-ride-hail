import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Pill, ShoppingBag, Hotel, MapPin } from 'lucide-react';

const DRIVER_PATHS = [
  { x: [100, -50, 20], y: [20, 100, -40], duration: 15 },
  { x: [-80, 40, -20], y: [-60, 20, 80], duration: 18 },
  { x: [50, -100, 40], y: [120, -20, 10], duration: 22 },
  { x: [-120, 20, -50], y: [40, -100, 60], duration: 20 },
  { x: [30, 150, -10], y: [-150, 40, -80], duration: 25 },
];

const POIS = [
  { id: 1, x: -80, y: -40, type: 'pharmacy', icon: <Pill size={12} />, color: 'bg-green-500' },
  { id: 2, x: 120, y: 60, type: 'market', icon: <ShoppingBag size={12} />, color: 'bg-orange-500' },
  { id: 3, x: -40, y: 110, type: 'hotel', icon: <Hotel size={12} />, color: 'bg-blue-500' },
  { id: 4, x: 150, y: -100, type: 'pharmacy', icon: <Pill size={12} />, color: 'bg-green-500' },
  { id: 5, x: 20, y: -140, type: 'market', icon: <ShoppingBag size={12} />, color: 'bg-orange-500' },
];

export const MapView: React.FC = () => {
  const drivers = useMemo(() => DRIVER_PATHS.map((path, i) => ({
    id: i,
    ...path,
    delay: Math.random() * 5
  })), []);

  return (
    <div className="relative w-full h-full bg-[#f8f9fa] overflow-hidden">
      {/* Simulation d'une grille de ville style Google Maps */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} />
      </div>

      {/* Rues simulées */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-0 w-full h-12 bg-gray-300/30 -rotate-3" />
        <div className="absolute top-0 left-1/3 w-14 h-full bg-gray-300/30 rotate-2" />
        <div className="absolute bottom-1/4 left-0 w-full h-10 bg-gray-300/30 rotate-1" />
        <div className="absolute top-0 right-1/4 w-16 h-full bg-gray-300/30 -rotate-1" />
      </div>

      {/* Parcs/Zones vertes */}
      <div className="absolute top-10 right-20 w-48 h-48 bg-green-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-10 w-64 h-32 bg-green-100/40 rounded-full blur-[60px] rotate-45" />

      {/* POI Markers (Pharmacies, Markets, Hotels) */}
      {POIS.map((poi) => (
        <motion.div
          key={poi.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + poi.id * 0.1 }}
          style={{ left: `calc(50% + ${poi.x}px)`, top: `calc(50% + ${poi.y}px)` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="flex flex-col items-center gap-1 group">
            <div className={`p-1.5 ${poi.color} text-white rounded-full shadow-lg transform transition-transform group-hover:scale-110`}>
              {poi.icon}
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full shadow-sm" />
          </div>
        </motion.div>
      ))}

      {/* Marqueur Utilisateur (Conakry) */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <div className="relative">
          <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-2xl" />
          <div className="absolute -inset-6 bg-blue-600/10 rounded-full animate-pulse" />
          <div className="absolute -inset-10 bg-blue-600/5 rounded-full animate-ping" />
        </div>
      </motion.div>

      {/* Chauffeurs simulés - Petites icônes de voitures/motos */}
      {drivers.map((driver) => (
        <motion.div 
          key={driver.id}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            x: driver.x,
            y: driver.y,
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ 
            duration: driver.duration, 
            repeat: Infinity, 
            ease: "linear",
            delay: driver.delay
          }}
          className="absolute top-1/2 left-1/2"
        >
          <div className="relative">
            <div className={`w-2.5 h-4 ${driver.id % 2 === 0 ? 'bg-yellow-400' : 'bg-black'} rounded-sm shadow-sm border border-white/30`} />
            <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-green-500 rounded-full" />
          </div>
        </motion.div>
      ))}
      
      {/* Bottom Overlay gradient */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
    </div>
  );
};
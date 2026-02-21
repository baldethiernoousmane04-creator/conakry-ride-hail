import React, { useState, useMemo } from 'react';
import { Search, MapPin, Landmark, ChevronRight, X, Map, Pill, ShoppingBag, Hotel, Hospital, School, Utensils, Building2, Fuel, Landmark as Bank } from 'lucide-react';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { NEIGHBORHOODS, PUBLIC_PLACES, REGIONS } from '../lib/data';
import { PlaceCategory } from '../types';

interface DestinationInputProps {
  onDestinationSet: (dest: string) => void;
  onSelectOnMap?: () => void;
}

const CategoryIcon = ({ category, size = 16 }: { category: PlaceCategory | string, size?: number }) => {
  switch (category) {
    case 'Pharmacie': return <Pill size={size} />;
    case 'Marché': return <ShoppingBag size={size} />;
    case 'Hôtel': return <Hotel size={size} />;
    case 'Hôpital': return <Hospital size={size} />;
    case 'École': return <School size={size} />;
    case 'Restaurant': return <Utensils size={size} />;
    case 'Administration': return <Building2 size={size} />;
    case 'Station-service': return <Fuel size={size} />;
    case 'Banque': return <Bank size={size} />;
    case 'Religieux': return <Landmark size={size} />;
    case 'Monument': return <Landmark size={size} />;
    case 'Commerce': return <ShoppingBag size={size} />;
    case 'Tourisme': return <Map size={size} />;
    case 'Quartier': return <MapPin size={size} />;
    default: return <MapPin size={size} />;
  }
};

export const DestinationInput: React.FC<DestinationInputProps> = ({ onDestinationSet, onSelectOnMap }) => {
  const [query, setQuery] = useState('');
  const [pickup, setPickup] = useState('Position actuelle');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    const q = query.toLowerCase().trim();
    
    // Filter logic
    const matches = (item: { name: string, region: string, type?: string, address?: string }) => {
      const matchQuery = !q || 
        item.name.toLowerCase().includes(q) || 
        (item.address && item.address.toLowerCase().includes(q)) ||
        item.region.toLowerCase().includes(q);
      const matchRegion = !selectedRegion || item.region === selectedRegion;
      return matchQuery && matchRegion;
    };

    const publicPlaces = PUBLIC_PLACES.filter(matches).map(p => ({
      ...p,
      displayAddress: p.address || `${p.region}, Guinée`,
      category: p.type
    }));

    const neighborhoods = NEIGHBORHOODS.filter(matches).map(n => ({
      name: n.name,
      region: n.region,
      displayAddress: `${n.prefecture ? n.prefecture + ', ' : ''}${n.region}, Guinée`,
      category: 'Quartier' as PlaceCategory
    }));

    const all = [...publicPlaces, ...neighborhoods];
    
    // Sort logic: exact matches first, then partials
    return all.sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q);
      const bStarts = b.name.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    }).slice(0, 50);
  }, [query, selectedRegion]);

  const handleSelect = (name: string) => {
    onDestinationSet(name);
  };

  return (
    <div className="flex flex-col h-full bg-white text-left">
      {/* Search Header */}
      <div className="p-4 space-y-3 bg-white shadow-sm z-10">
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
          <div className="flex flex-col items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-blue-500 bg-white" />
            <div className="w-[1px] h-8 bg-gray-300" />
            <div className="w-2.5 h-2.5 rounded-sm bg-yellow-500" />
          </div>
          <div className="flex-grow space-y-2">
            <div className="relative">
              <Input
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Lieu de départ"
                className="border-none bg-transparent h-6 focus-visible:ring-0 px-0 text-sm font-medium text-gray-400"
              />
            </div>
            <div className="h-[1px] bg-gray-100 w-full" />
            <div className="relative flex items-center">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Où allez-vous ?"
                className="border-none bg-transparent h-8 focus-visible:ring-0 px-0 text-base font-semibold placeholder:text-gray-400"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 text-gray-400">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Region Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedRegion(null)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              !selectedRegion ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Toutes les régions
          </button>
          {REGIONS.map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedRegion === region ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="flex-grow overflow-y-auto px-4 py-2 no-scrollbar">
        {/* Map Shortcut */}
        <button 
          onClick={onSelectOnMap}
          className="w-full flex items-center gap-4 py-4 border-b border-gray-50 group active:bg-gray-50 transition-colors"
        >
          <div className="p-2.5 bg-yellow-50 rounded-full text-yellow-600">
            <Map size={20} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">Choisir sur la carte</p>
            <p className="text-xs text-gray-500">Déplacez le curseur manuellement</p>
          </div>
          <ChevronRight size={16} className="ml-auto text-gray-300" />
        </button>

        <AnimatePresence mode="popLayout">
          {suggestions.length > 0 ? (
            suggestions.map((item, idx) => (
              <motion.button
                key={`${item.name}-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                onClick={() => handleSelect(item.name)}
                className="w-full flex items-center gap-4 py-4 border-b border-gray-50 group active:bg-gray-50 transition-colors text-left"
              >
                <div className="p-2.5 bg-gray-50 rounded-full text-gray-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                  <CategoryIcon category={item.category} size={20} />
                </div>
                <div className="text-left flex-grow">
                  <div className="flex items-center gap-2 text-left">
                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                    {item.category !== 'Quartier' && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium uppercase tracking-tighter">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{item.displayAddress}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
              </motion.button>
            ))
          ) : (
            <div className="py-20 text-center space-y-3">
              <div className="inline-flex p-6 bg-gray-50 rounded-full text-gray-200">
                <Search size={40} />
              </div>
              <p className="text-sm font-medium text-gray-500">Aucun lieu ne correspond à votre recherche</p>
              <p className="text-xs text-gray-400">Essayez d'ajuster votre recherche ou filtre par région</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
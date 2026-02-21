import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Tag, 
  Calendar, 
  Users, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  XCircle,
  Percent,
  Banknote,
  Search,
  Filter,
  BarChart3,
  Globe,
  TrendingUp,
  Ticket
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MOCK_PROMOTIONS, MOCK_DISCOUNT_CODES } from '../../lib/data';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'sonner';
import { Promotion, DiscountCode } from '../../types';

export const PromotionsManager = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(MOCK_DISCOUNT_CODES);
  const [activeTab, setActiveTab] = useState<'promos' | 'codes'>('promos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDeletePromo = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
    toast.success("Promotion supprimée");
  };

  const handleDeleteCode = (id: string) => {
    setDiscountCodes(prev => prev.filter(c => c.id !== id));
    toast.success("Code promo supprimé");
  };

  const togglePromoStatus = (id: string) => {
    setPromotions(prev => prev.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
    toast.success("Statut mis à jour");
  };

  const filteredPromos = promotions.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCodes = discountCodes.filter(c => c.code.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-4 space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">Centre Marketing</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gérer vos campagnes & offres</p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl h-12 px-6 shadow-xl shadow-slate-200"
          >
            <Plus size={20} className="mr-2" />
            CRÉER
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors" />
            <Input 
              placeholder="Rechercher une offre..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-2xl bg-white border-slate-200 shadow-sm focus:ring-yellow-500" 
            />
          </div>
          <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full md:w-auto shrink-0 border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('promos')}
              className={`flex-1 md:flex-none px-6 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'promos' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Campagnes
            </button>
            <button
              onClick={() => setActiveTab('codes')}
              className={`flex-1 md:flex-none px-6 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'codes' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Codes Promo
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'promos' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPromos.map((promo) => (
              <motion.div
                layout
                key={promo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <div className="h-40 w-full relative overflow-hidden bg-slate-100">
                  <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-xl ${
                      promo.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                    }`}>
                      {promo.isActive ? 'ACTIF' : 'INACTIF'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-slate-900 text-lg leading-tight">{promo.title}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Campagne Marketing</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-yellow-600">
                        {promo.discountType === 'percentage' ? `-${promo.discountValue}%` : `-${formatCurrency(promo.discountValue)}`}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed line-clamp-2">{promo.description}</p>

                  <div className="flex items-center gap-4 py-3 border-y border-slate-50 my-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={16} />
                      <span className="text-[10px] font-black">EXP: {new Date(promo.endDate).toLocaleDateString('fr-GN')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Globe size={16} />
                      <span className="text-[10px] font-black">TOUTE RÉGION</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?u=${promo.id}${i}`} alt="user" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 text-white text-[8px] font-bold flex items-center justify-center">
                        +854
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => togglePromoStatus(promo.id)} className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-colors">
                        {promo.isActive ? <XCircle size={18} /> : <CheckCircle2 size={18} className="text-emerald-500" />}
                      </button>
                      <button className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDeletePromo(promo.id)} className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCodes.map((code) => (
              <motion.div
                layout
                key={code.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Ticket size={80} className="rotate-12" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <div className="bg-yellow-500 text-black px-4 py-1.5 rounded-xl font-black tracking-widest text-lg shadow-lg shadow-yellow-200/50">
                      {code.code}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                        {code.discountType === 'percentage' ? `-${code.discountValue}%` : `-${formatCurrency(code.discountValue)}`}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                      <span>Utilisations</span>
                      <span className="text-slate-900">{code.usageCount} / {code.usageLimit || '∞'}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden flex">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(code.usageCount / (code.usageLimit || 1000)) * 100}%` }}
                        className="h-full bg-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Expire le</p>
                      <p className="text-xs font-black text-slate-900">{new Date(code.expiryDate).toLocaleDateString('fr-GN')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Min. Commande</p>
                      <p className="text-xs font-black text-slate-900">{formatCurrency(code.minOrderValue || 0)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <TrendingUp size={16} />
                      <span className="text-[10px] font-black uppercase">Performance: +12%</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-slate-50 text-slate-400 rounded-lg transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteCode(code.id)} className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[40px] p-8 shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl"></div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="p-2.5 bg-yellow-500 rounded-2xl text-white shadow-lg shadow-yellow-200">
                  <Plus size={24} />
                </div>
                Nouvelle {activeTab === 'promos' ? 'Promotion' : 'Offre Spéciale'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider ml-1">Titre de la campagne</label>
                  <Input placeholder={activeTab === 'promos' ? "Ex: Ramadan 2024" : "Ex: WONGAYE50"} className="h-14 rounded-2xl border-slate-200" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider ml-1">Type de réduction</label>
                  <select className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-900 focus:ring-yellow-500 outline-none">
                    <option value="percentage">POURCENTAGE (%)</option>
                    <option value="fixed">MONTANT FIXE (GNF)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider ml-1">Valeur</label>
                  <Input type="number" placeholder="0" className="h-14 rounded-2xl border-slate-200" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider ml-1">Date limite</label>
                  <Input type="date" className="h-14 rounded-2xl border-slate-200" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider ml-1">Ciblage Régional</label>
                  <select className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-900 focus:ring-yellow-500 outline-none">
                    <option>TOUTE LA GUINÉE</option>
                    <option>CONAKRY UNIQUEMENT</option>
                    <option>KANKAN UNIQUEMENT</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <Button 
                  variant="ghost" 
                  className="flex-1 h-14 rounded-[20px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-wider"
                  onClick={() => setShowAddModal(false)}
                >
                  Annuler
                </Button>
                <Button 
                  className="flex-1 h-14 rounded-[20px] bg-slate-900 text-white font-black uppercase tracking-wider shadow-xl shadow-slate-200"
                  onClick={() => {
                    toast.success("Offre créée avec succès !");
                    setShowAddModal(false);
                  }}
                >
                  Publier l'offre
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
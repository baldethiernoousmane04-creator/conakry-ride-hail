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
  Filter
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

  return (
    <div className="p-4 space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">Marketing & Promos</h2>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl"
          >
            <Plus size={18} className="mr-2" />
            Créer
          </Button>
        </div>

        <div className="flex p-1 bg-slate-200/50 rounded-xl">
          <button
            onClick={() => setActiveTab('promos')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'promos' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
            }`}
          >
            Campagnes
          </button>
          <button
            onClick={() => setActiveTab('codes')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'codes' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
            }`}
          >
            Codes Promo
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'promos' ? (
          <div className="grid gap-4">
            {promotions.map((promo) => (
              <motion.div
                layout
                key={promo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
              >
                <div className="h-24 w-full relative overflow-hidden bg-slate-100">
                  <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${
                      promo.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                    }`}>
                      {promo.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900">{promo.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{promo.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-yellow-600">
                        {promo.discountType === 'percentage' ? `-${promo.discountValue}%` : `-${formatCurrency(promo.discountValue)}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 py-2 border-y border-slate-50 my-3">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar size={14} />
                      <span className="text-[10px] font-bold">Jusqu'au {new Date(promo.endDate).toLocaleDateString('fr-GN')}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => togglePromoStatus(promo.id)} className="h-8 w-8 p-0 rounded-lg">
                      {promo.isActive ? <XCircle size={18} className="text-slate-400" /> : <CheckCircle2 size={18} className="text-emerald-500" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400">
                      <Edit2 size={18} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeletePromo(promo.id)} className="h-8 w-8 p-0 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {discountCodes.map((code) => (
              <motion.div
                layout
                key={code.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-100 p-2 rounded-xl text-yellow-700">
                      <Tag size={18} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 tracking-tight">{code.code}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <Users size={10} /> {code.usageCount}/{code.usageLimit || '∞'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">•</span>
                        <span className="text-[10px] font-bold text-slate-500">Exp. {new Date(code.expiryDate).toLocaleDateString('fr-GN')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      {code.discountType === 'percentage' ? `-${code.discountValue}%` : `-${formatCurrency(code.discountValue)}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                  <div className="flex gap-1">
                    {code.minOrderValue && (
                      <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Min: {formatCurrency(code.minOrderValue)}</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 px-2 rounded-lg text-slate-400 hover:text-slate-600">
                      <Edit2 size={14} />
                    </Button>
                    <button 
                      onClick={() => handleDeleteCode(code.id)}
                      className="h-7 px-2 rounded-lg text-red-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal Placeholder */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl"
            >
              <h3 className="text-xl font-black text-slate-900 mb-6">Nouvelle {activeTab === 'promos' ? 'Promotion' : 'Code Promo'}</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Nom / Code</label>
                  <Input placeholder={activeTab === 'promos' ? "Nom de la campagne" : "EX: WONGAYE20"} className="h-12 rounded-xl" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Type</label>
                    <select className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium">
                      <option value="percentage">Pourcentage (%)</option>
                      <option value="fixed">Montant Fixe (GNF)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Valeur</label>
                    <Input type="number" placeholder="0" className="h-12 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Date d'expiration</label>
                  <Input type="date" className="h-12 rounded-xl" />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button 
                  variant="ghost" 
                  className="flex-1 h-12 rounded-xl font-bold"
                  onClick={() => setShowAddModal(false)}
                >
                  Annuler
                </Button>
                <Button 
                  className="flex-1 h-12 rounded-xl bg-slate-900 text-white font-bold"
                  onClick={() => {
                    toast.success("Création réussie");
                    setShowAddModal(false);
                  }}
                >
                  Confirmer
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
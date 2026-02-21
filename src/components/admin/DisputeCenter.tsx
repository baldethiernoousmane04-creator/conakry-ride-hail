import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  MessageSquare, 
  User, 
  ChevronRight, 
  Filter, 
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Dispute } from '../../types';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'disp-1',
    tripId: 'trip-9021',
    userId: 'user-123',
    userName: 'Aissatou Barry',
    role: 'customer',
    reason: 'Frais Incorrects',
    description: "Le chauffeur m'a demandé 5000 GNF de plus que le prix indiqué sur l'application.",
    status: 'pending',
    createdAt: 'Il y a 2 heures',
    priority: 'high'
  },
  {
    id: 'disp-2',
    tripId: 'trip-8842',
    userId: 'driver-45',
    userName: 'Mamadou Diallo',
    role: 'driver',
    reason: 'Comportement Client',
    description: "Le client a été agressif verbalement pendant tout le trajet.",
    status: 'investigating',
    createdAt: 'Il y a 5 heures',
    priority: 'medium'
  },
  {
    id: 'disp-3',
    tripId: 'trip-7721',
    userId: 'user-456',
    userName: 'Ousmane Sow',
    role: 'customer',
    reason: 'Article Non Reçu',
    description: "Le coursier a marqué la livraison comme terminée mais je n'ai rien reçu.",
    status: 'pending',
    createdAt: 'Il y a 1 jour',
    priority: 'high'
  }
];

export const DisputeCenter: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [filter, setFilter] = useState<Dispute['status'] | 'all'>('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const filteredDisputes = disputes.filter(d => filter === 'all' || d.status === filter);

  const updateStatus = (id: string, newStatus: Dispute['status']) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    toast.success(`Statut du litige mis à jour : ${newStatus}`);
    setSelectedDispute(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-left">
      <div className="p-4 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-slate-900">Centre de Litiges</h2>
          <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-full uppercase tracking-wider border border-red-100">
            {disputes.filter(d => d.status === 'pending').length} En attente
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['all', 'pending', 'investigating', 'resolved', 'dismissed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap border transition-all ${
                filter === s 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {s === 'all' ? 'Tous' : s === 'investigating' ? 'En cours' : s === 'resolved' ? 'Résolus' : s === 'dismissed' ? 'Rejetés' : 'En attente'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {filteredDisputes.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <CheckCircle2 size={48} className="mb-4 opacity-20" />
            <p className="font-bold">Aucun litige trouvé</p>
          </div>
        ) : (
          filteredDisputes.map((dispute) => (
            <motion.div
              layoutId={dispute.id}
              key={dispute.id}
              onClick={() => setSelectedDispute(dispute)}
              className="bg-white rounded-[28px] border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
            >
              {dispute.priority === 'high' && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-xl">
                  Urgent
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${dispute.role === 'customer' ? 'bg-slate-100 text-slate-600' : 'bg-yellow-50 text-yellow-600'}`}>
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none">{dispute.userName}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                      {dispute.role === 'customer' ? 'Passager' : 'Chauffeur'} • #{dispute.tripId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs font-black text-slate-700">{dispute.reason}</p>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{dispute.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold">{dispute.createdAt}</span>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  dispute.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                  dispute.status === 'investigating' ? 'bg-blue-50 text-blue-600' :
                  dispute.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {dispute.status === 'investigating' ? 'En cours' : dispute.status === 'resolved' ? 'Résolu' : dispute.status === 'dismissed' ? 'Rejeté' : 'Attente'}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedDispute && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedDispute(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedDispute.role === 'customer' ? 'bg-slate-900 text-white' : 'bg-yellow-500 text-white'}`}>
                    <ShieldAlert size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Détails du Litige</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase">Signalement #{selectedDispute.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDispute(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-6 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Motif du signalement</p>
                  <p className="text-lg font-bold text-slate-900">{selectedDispute.reason}</p>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Description complète</p>
                  <p className="text-sm text-slate-600 leading-relaxed bg-white border border-slate-100 p-4 rounded-2xl">
                    {selectedDispute.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 p-3 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Trajet Concerné</p>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                      <span>{selectedDispute.tripId}</span>
                      <ExternalLink size={12} className="text-blue-500" />
                    </div>
                  </div>
                  <div className="border border-slate-100 p-3 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Signalé par</p>
                    <p className="text-sm font-bold text-slate-900">{selectedDispute.userName}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {selectedDispute.status === 'pending' && (
                  <Button 
                    onClick={() => updateStatus(selectedDispute.id, 'investigating')}
                    className="h-14 rounded-2xl bg-blue-600 text-white font-black col-span-2"
                  >
                    Démarrer l'enquête
                  </Button>
                )}
                {selectedDispute.status === 'investigating' && (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => updateStatus(selectedDispute.id, 'dismissed')}
                      className="h-14 rounded-2xl border-slate-200 text-slate-600 font-black"
                    >
                      Rejeter
                    </Button>
                    <Button 
                      onClick={() => updateStatus(selectedDispute.id, 'resolved')}
                      className="h-14 rounded-2xl bg-emerald-600 text-white font-black"
                    >
                      Résoudre
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
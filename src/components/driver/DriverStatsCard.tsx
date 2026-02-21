import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Star, 
  Clock, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Calendar,
  ChevronRight,
  Wallet
} from 'lucide-react';
import { DriverStats } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface DriverStatsCardProps {
  stats: DriverStats;
}

export const DriverStatsCard: React.FC<DriverStatsCardProps> = ({ stats }) => {
  const metrics = [
    { 
      label: "Taux d'Acceptation", 
      value: `${stats.acceptanceRate}%`, 
      icon: <Target size={18} className="text-blue-500" />,
      color: "bg-blue-50"
    },
    { 
      label: "Heures en Ligne", 
      value: `${stats.onlineHours}h`, 
      icon: <Clock size={18} className="text-purple-500" />,
      color: "bg-purple-50"
    },
    { 
      label: "Note Moyenne", 
      value: stats.rating.toFixed(1), 
      icon: <Star size={18} className="text-yellow-500" />,
      color: "bg-yellow-50"
    },
    { 
      label: "Courses Finies", 
      value: stats.totalTrips, 
      icon: <CheckCircle2 size={18} className="text-emerald-500" />,
      color: "bg-emerald-50"
    }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Earnings Overview */}
      <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Gains d'aujourd'hui</p>
            <h2 className="text-3xl font-black">{formatCurrency(stats.todayEarnings)}</h2>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <TrendingUp size={24} className="text-emerald-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          +12% par rapport à hier
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={m.label} 
            className="bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm"
          >
            <div className={`p-2.5 w-fit rounded-xl ${m.color} mb-3`}>
              {m.icon}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{m.label}</p>
            <p className="text-lg font-black text-slate-900">{m.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly Activity */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <BarChart3 size={18} className="text-slate-400" />
            Activité Hebdomadaire
          </h3>
          <button className="text-[10px] font-black text-blue-600 uppercase">Détails</button>
        </div>
        
        <div className="flex items-end justify-between h-24 gap-1 px-1">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => {
            const height = [40, 65, 30, 85, 95, 70, 50][i];
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  className={`w-full max-w-[8px] rounded-full ${height > 80 ? 'bg-slate-900' : 'bg-slate-200'}`}
                />
                <span className="text-[10px] font-bold text-slate-400">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Trips Preview */}
      <div className="space-y-3">
        <h3 className="font-black text-slate-900 px-1">Dernières Courses</h3>
        {[
          { id: '1', loc: 'Madina → Kipé', price: 25000, time: '14:30', status: 'completed' },
          { id: '2', loc: 'Dixinn → Kaloum', price: 15000, time: '12:15', status: 'completed' },
          { id: '3', loc: 'Lambanyi → Cosa', price: 20000, time: '10:45', status: 'completed' },
        ].map((trip) => (
          <div key={trip.id} className="bg-white p-4 rounded-2xl border border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{trip.loc}</p>
                <p className="text-[10px] text-slate-400 font-medium">{trip.time} • Payé en Digital</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-emerald-600">+{formatCurrency(trip.price)}</p>
              <ChevronRight size={14} className="text-slate-300 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
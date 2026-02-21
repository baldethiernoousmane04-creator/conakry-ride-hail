import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Bike, 
  TrendingUp, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  TrendingDown,
  Activity,
  Calendar,
  Layers,
  BarChart as BarChartIcon,
  ChevronRight,
  Filter,
  Download,
  DollarSign,
  AlertTriangle,
  Zap,
  Globe
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';

export const AnalyticsDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('7d');
  
  const stats = [
    { label: 'Courses Totales', value: '12,840', change: '+12.5%', icon: <Layers size={20} className="text-blue-500" />, positive: true },
    { label: 'Revenu Net', value: formatCurrency(8540000), change: '+8.2%', icon: <TrendingUp size={20} className="text-emerald-500" />, positive: true },
    { label: 'Utilisateurs Actifs', value: '3,241', change: '-2.4%', icon: <Users size={20} className="text-indigo-500" />, positive: false },
    { label: 'Chauffeurs Actifs', value: '185', change: '+5.7%', icon: <Bike size={20} className="text-yellow-500" />, positive: true },
  ];

  const recentTrends = [
    { day: 'Lun', rides: 120, revenue: 2400000 },
    { day: 'Mar', rides: 145, revenue: 2900000 },
    { day: 'Mer', rides: 132, revenue: 2600000 },
    { day: 'Jeu', rides: 168, revenue: 3300000 },
    { day: 'Ven', rides: 210, revenue: 4200000 },
    { day: 'Sam', rides: 195, revenue: 3900000 },
    { day: 'Dim', rides: 155, revenue: 3100000 },
  ];

  const topRegions = [
    { zone: 'Kaloum Centre', count: 420, percentage: 35, color: 'bg-slate-900', status: 'Optimal' },
    { zone: 'Madina Marché', count: 350, percentage: 28, color: 'bg-yellow-500', status: 'Surchargé' },
    { zone: 'Kipé / Centre Emetteur', count: 280, percentage: 22, color: 'bg-blue-500', status: 'Besoins' },
    { zone: 'Taouyah / Ratoma', count: 180, percentage: 15, color: 'bg-slate-400', status: 'Faible' },
  ];

  const maxRides = Math.max(...recentTrends.map(t => t.rides));

  return (
    <div className="space-y-6 p-4 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Analyse de Performance</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Plateforme de Monitoring Wongaye</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm shrink-0">
            {['7d', '30d', '90d'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t as any)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  timeframe === t ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t === '7d' ? '7 Jours' : t === '30d' ? '30 Jours' : '3 Mois'}
              </button>
            ))}
          </div>
          <Button variant="outline" className="h-9 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0">
            <Download size={12} className="mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-white p-5 rounded-[28px] border border-slate-200 shadow-sm relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-yellow-500 group-hover:text-white transition-colors">{stat.icon}</div>
              <div className={`flex items-center gap-0.5 text-[10px] font-black ${stat.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {stat.change}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{stat.label}</p>
            <p className="text-xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 leading-none">Volume de Trajets</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Évolution sur les 7 derniers jours</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <div className="w-2 h-2 rounded-full bg-slate-900"></div>
              <span className="text-[10px] font-black uppercase">Courses</span>
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 px-2">
            {recentTrends.map((trend) => (
              <div key={trend.day} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full relative flex items-end justify-center h-40">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(trend.rides / maxRides) * 100}%` }}
                    className="w-full max-w-[40px] bg-slate-100 rounded-t-xl group-hover:bg-yellow-500 transition-all relative overflow-hidden"
                  >
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: '30%' }}
                      className="absolute bottom-0 left-0 right-0 bg-slate-900 opacity-20"
                    />
                  </motion.div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl pointer-events-none whitespace-nowrap z-10 scale-90 group-hover:scale-100">
                    {trend.rides} COURSES
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trend.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Status */}
        <div className="bg-slate-900 p-6 rounded-[32px] text-white shadow-xl shadow-slate-200 overflow-hidden relative">
          <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="font-black text-white mb-6 flex items-center gap-2">
              <Zap size={18} className="text-yellow-500" />
              Live Fleet Status
            </h3>
            
            <div className="space-y-6 flex-grow">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white/60">Chauffeurs Libres</span>
                  <span className="text-lg font-black text-yellow-500">42</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div animate={{ width: '65%' }} className="h-full bg-yellow-500" />
                </div>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white/60">En Course</span>
                  <span className="text-lg font-black text-emerald-500">128</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div animate={{ width: '85%' }} className="h-full bg-emerald-500" />
                </div>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white/60">Incidents Ouverts</span>
                  <span className="text-lg font-black text-red-500">3</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div animate={{ width: '15%' }} className="h-full bg-red-500" />
                </div>
              </div>
            </div>

            <Button className="mt-8 w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-2xl">
              VOIR LA CARTE LIVE
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Zones */}
        <div className="bg-white p-7 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <MapPin size={20} className="text-red-500" />
              Densité par Zone
            </h3>
            <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1.5 rounded-xl uppercase">Par Demande</span>
          </div>
          <div className="space-y-6">
            {topRegions.map(zone => (
              <div key={zone.zone} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-black text-slate-800">{zone.zone}</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{zone.count} trajets • {zone.status}</p>
                  </div>
                  <span className="text-xs font-black text-slate-900 bg-slate-50 px-3 py-1.5 rounded-xl">{zone.percentage}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden flex p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${zone.percentage}%` }}
                    className={`h-full rounded-full ${zone.color}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Distribution */}
        <div className="bg-white p-7 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <DollarSign size={20} className="text-emerald-500" />
              Répartition Financière
            </h3>
          </div>
          <div className="space-y-5">
            {[
              { label: 'Courses Digitales', amount: 5240000, percentage: 65, color: 'bg-emerald-500' },
              { label: 'Paiements Espèces', amount: 3300000, percentage: 35, color: 'bg-slate-900' },
            ].map(item => (
              <div key={item.label} className="p-4 bg-slate-50 rounded-[24px] border border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                    <span className="text-xs font-black text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400">{item.percentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-slate-900">{formatCurrency(item.amount)}</span>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
              </div>
            ))}

            <div className="pt-2">
              <div className="bg-indigo-50 p-5 rounded-[24px] border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Commissions Totales</p>
                  <p className="text-2xl font-black text-indigo-900">{formatCurrency(1281000)}</p>
                </div>
                <TrendingUp className="text-indigo-400 opacity-50" size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alert Section */}
      <div className="p-5 bg-orange-50 border border-orange-100 rounded-[28px] flex items-center gap-4">
        <div className="p-3 bg-white rounded-2xl text-orange-500 shadow-sm shadow-orange-100">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black text-orange-900 leading-none">Vérification Requise</h4>
          <p className="text-xs text-orange-700/70 mt-1 font-bold">12 nouveaux chauffeurs attendent la validation de leurs documents.</p>
        </div>
        <Button className="ml-auto bg-orange-500 hover:bg-orange-600 text-white font-black text-[10px] px-4 h-9 rounded-xl shrink-0 uppercase tracking-wider">
          Gérer
        </Button>
      </div>
    </div>
  );
};
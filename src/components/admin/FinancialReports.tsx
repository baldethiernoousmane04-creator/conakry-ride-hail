import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  ArrowDownToLine, 
  Filter,
  Wallet,
  Calendar,
  ChevronRight,
  Printer
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export const FinancialReports: React.FC = () => {
  const reports = [
    { id: 'rep-1', name: 'Rapport Mensuel - Mai 2024', date: '01/06/2024', size: '1.2 MB', type: 'PDF' },
    { id: 'rep-2', name: 'Récapitulatif Commissions S20', date: '25/05/2024', size: '850 KB', type: 'XLS' },
    { id: 'rep-3', name: 'Bilan Hebdomadaire Chauffeurs', date: '20/05/2024', size: '2.4 MB', type: 'PDF' },
    { id: 'rep-4', name: 'Rapport Annuel Fiscal 2023', date: '15/01/2024', size: '5.8 MB', type: 'PDF' },
  ];

  const handleDownload = (name: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Génération du rapport...',
        success: `${name} téléchargé avec succès !`,
        error: 'Erreur lors du téléchargement'
      }
    );
  };

  return (
    <div className="space-y-6 p-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Rapports Financiers</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Exportations et documents fiscaux</p>
        </div>
        <Button size="icon" variant="outline" className="rounded-xl border-slate-200">
          <Filter size={18} className="text-slate-600" />
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-[32px] p-6 text-white overflow-hidden relative shadow-xl">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Collecté ce mois</span>
          </div>
          <h3 className="text-3xl font-black mb-1">{formatCurrency(42850000)}</h3>
          <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            +18% par rapport au mois dernier
          </p>
        </div>

        <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Wallet size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paiements Sortants (Chauffeurs)</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-1">{formatCurrency(36422500)}</h3>
          <p className="text-xs text-slate-400 font-bold">
            85% du volume total des courses
          </p>
        </div>
      </div>

      {/* Generation Tools */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-[32px] p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-black text-slate-900">Générer un Rapport Personnalisé</h3>
            <p className="text-xs text-slate-600 mt-1">Sélectionnez une période et des filtres spécifiques</p>
          </div>
          <Printer size={20} className="text-yellow-600 opacity-50" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white border border-yellow-200 p-3 rounded-2xl">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Date Début</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">01 Mai 2024</span>
              <Calendar size={14} className="text-slate-400" />
            </div>
          </div>
          <div className="bg-white border border-yellow-200 p-3 rounded-2xl">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Date Fin</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">31 Mai 2024</span>
              <Calendar size={14} className="text-slate-400" />
            </div>
          </div>
        </div>
        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 h-12 rounded-2xl font-black text-xs uppercase tracking-wider">
          Générer et Télécharger (PDF)
        </Button>
      </div>

      {/* Available Reports List */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-900 px-1">Rapports Disponibles</h3>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center justify-between group hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${report.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{report.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-medium text-slate-400">{report.date}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[10px] font-medium text-slate-400">{report.size}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDownload(report.name)}
                className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all group-hover:scale-105"
              >
                <ArrowDownToLine size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
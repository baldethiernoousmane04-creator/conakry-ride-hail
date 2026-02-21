import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Car, Bike, CreditCard, 
  FileCheck, ChevronRight, ChevronLeft, Upload, CheckCircle2, 
  Clock, ShieldCheck, AlertCircle, XCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { DriverStatus, DriverApplication } from '../../types';

interface DriverOnboardingProps {
  onComplete: (application: DriverApplication) => void;
  initialStatus?: DriverStatus;
  existingApplication?: DriverApplication | null;
}

export const DriverOnboarding: React.FC<DriverOnboardingProps> = ({ 
  onComplete, 
  initialStatus = 'not_started',
  existingApplication = null
}) => {
  const [step, setStep] = useState(initialStatus === 'pending' ? 5 : 1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<DriverApplication>>(
    existingApplication || {
      fullName: '',
      phone: '',
      email: '',
      vehicleType: 'moto',
      vehicleModel: '',
      vehicleYear: '',
      licensePlate: '',
    }
  );

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleTypeSelect = (type: 'moto' | 'car') => {
    setFormData(prev => ({ ...prev, vehicleType: type }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const application: DriverApplication = {
        id: 'APP-' + Math.random().toString(36).substr(2, 9),
        userId: 'USER-123',
        fullName: formData.fullName || '',
        phone: formData.phone || '',
        email: formData.email || '',
        vehicleType: formData.vehicleType || 'moto',
        vehicleModel: formData.vehicleModel || '',
        vehicleYear: formData.vehicleYear || '',
        licensePlate: formData.licensePlate || '',
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      setLoading(false);
      onComplete(application);
      nextStep();
      toast.success("Demande d'inscription envoyée avec succès !");
    }, 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Intro
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-4">
              <ShieldCheck size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">
              Devenez Partenaire <span className="text-yellow-500">WONGAYE</span>
            </h1>
            <p className="text-slate-600 leading-relaxed max-w-xs">
              Augmentez vos revenus en conduisant avec la plateforme de transport la plus fiable de Guinée.
            </p>
            <div className="w-full space-y-4 pt-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Gagnez plus</h4>
                  <p className="text-xs text-slate-500">Paiements rapides et transparents.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Liberté totale</h4>
                  <p className="text-xs text-slate-500">Soyez votre propre patron.</p>
                </div>
              </div>
            </div>
            <Button onClick={nextStep} className="w-full h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg shadow-lg mt-4">
              Commencer l'inscription
            </Button>
          </motion.div>
        );

      case 2: // Personal Info
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Informations Personnelles</h2>
              <p className="text-sm text-slate-500">Dites-nous qui vous êtes pour commencer.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nom Complet</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ex: Mamadou Diallo" 
                    className="h-14 pl-12 rounded-2xl border-slate-200"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Numéro de Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ex: 620 00 00 00" 
                    className="h-14 pl-12 rounded-2xl border-slate-200"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email (Optionnel)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ex: chauffeur@wongaye.gn" 
                    className="h-14 pl-12 rounded-2xl border-slate-200"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={prevStep} className="h-14 w-14 rounded-2xl border-slate-200 shrink-0">
                <ChevronLeft size={24} />
              </Button>
              <Button 
                onClick={nextStep} 
                disabled={!formData.fullName || !formData.phone}
                className="h-14 flex-grow rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg"
              >
                Continuer
                <ChevronRight size={20} className="ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 3: // Vehicle Info
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Votre Véhicule</h2>
              <p className="text-sm text-slate-500">Choisissez votre type de transport.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleVehicleTypeSelect('moto')}
                className={`p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 ${
                  formData.vehicleType === 'moto' 
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700' 
                  : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                }`}
              >
                <div className={`p-4 rounded-2xl ${formData.vehicleType === 'moto' ? 'bg-yellow-200' : 'bg-slate-50'}`}>
                  <Bike size={32} />
                </div>
                <span className="font-black uppercase tracking-tighter">Moto-Taxi</span>
              </button>
              <button 
                onClick={() => handleVehicleTypeSelect('car')}
                className={`p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 ${
                  formData.vehicleType === 'car' 
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700' 
                  : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                }`}
              >
                <div className={`p-4 rounded-2xl ${formData.vehicleType === 'car' ? 'bg-yellow-200' : 'bg-slate-50'}`}>
                  <Car size={32} />
                </div>
                <span className="font-black uppercase tracking-tighter">Taxi/Auto</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Modèle du Véhicule</label>
                <Input 
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                  placeholder="Ex: TVS HLX 125 / Toyota Corolla" 
                  className="h-14 rounded-2xl border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Année</label>
                  <Input 
                    name="vehicleYear"
                    value={formData.vehicleYear}
                    onChange={handleInputChange}
                    placeholder="Ex: 2023" 
                    className="h-14 rounded-2xl border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Immatriculation</label>
                  <Input 
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    placeholder="Ex: RC-0000-A" 
                    className="h-14 rounded-2xl border-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={prevStep} className="h-14 w-14 rounded-2xl border-slate-200 shrink-0">
                <ChevronLeft size={24} />
              </Button>
              <Button 
                onClick={nextStep} 
                disabled={!formData.vehicleModel || !formData.licensePlate}
                className="h-14 flex-grow rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg"
              >
                Continuer
                <ChevronRight size={20} className="ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 4: // Documents
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Documents Requis</h2>
              <p className="text-sm text-slate-500">Veuillez télécharger les photos de vos documents.</p>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Permis de Conduire', desc: 'Face avant visible' },
                { label: 'Carte Grise', desc: 'Document du véhicule' },
                { label: 'Assurance', desc: 'En cours de validité' }
              ].map((doc, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400">
                      <Upload size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{doc.label}</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-medium">{doc.desc}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-yellow-600 font-bold text-xs hover:bg-yellow-50">
                    AJOUTER
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 border border-blue-100">
              <AlertCircle className="text-blue-500 shrink-0" size={18} />
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Vos documents seront vérifiés par notre équipe dans un délai de 24h à 48h.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={prevStep} className="h-14 w-14 rounded-2xl border-slate-200 shrink-0">
                <ChevronLeft size={24} />
              </Button>
              <Button 
                onClick={handleSubmit}
                loading={loading}
                className="h-14 flex-grow rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg"
              >
                Soumettre ma demande
              </Button>
            </div>
          </motion.div>
        );

      case 5: // Pending Status
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center space-y-6 pt-8"
          >
            <div className="relative">
              <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                <Clock size={64} />
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-2 border-4 border-dashed border-yellow-200 rounded-full"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900">Demande en cours...</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-black uppercase tracking-wider">
                Statut: En attente
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-xs">
              Mamadou, nous avons bien reçu votre demande ! Notre équipe est en train de vérifier vos documents.
            </p>
            
            <div className="w-full bg-slate-50 rounded-[32px] p-6 text-left border border-slate-100 space-y-4">
              <h4 className="font-bold text-slate-800 text-sm border-b pb-2">Prochaines étapes :</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-xs text-slate-600">Vérification de l'identité et du casier judiciaire.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-xs text-slate-600">Contrôle technique du véhicule ({formData.vehicleModel}).</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck size={14} />
                  </div>
                  <span className="text-xs text-slate-600">Formation à l'utilisation de l'application WONGAYE.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 w-full">
              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-slate-200 font-bold"
                onClick={() => window.location.reload()}
              >
                Vérifier plus tard
              </Button>
            </div>
          </motion.div>
        );

      case 6: // Rejected Status (Example)
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center space-y-6 pt-8"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <XCircle size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Demande Refusée</h2>
            <p className="text-slate-600 leading-relaxed max-w-xs">
              Malheureusement, votre demande n'a pas pu être validée pour le moment.
            </p>
            <div className="w-full bg-red-50 rounded-2xl p-4 border border-red-100 text-left">
              <p className="text-xs text-red-700 font-medium">Raison : Photo du permis de conduire illisible. Veuillez soumettre une nouvelle photo plus nette.</p>
            </div>
            <Button onClick={() => setStep(4)} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold">
              Réessayer le téléchargement
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center max-w-md mx-auto px-6 py-12">
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
};
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  User, 
  History, 
  LogOut, 
  Star, 
  MapPin, 
  Calendar, 
  Smartphone, 
  Mail, 
  Edit2, 
  CheckCircle, 
  XCircle,
  Gift,
  Trophy,
  Share2,
  Copy,
  Settings,
  Bell,
  Globe,
  Bike
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MOCK_USER, MOCK_RIDE_HISTORY } from '../../lib/data';
import { UserProfile } from '../../types';
import { toast } from 'sonner';

interface ProfileAndHistoryProps {
  onBack: () => void;
  onLogout: () => void;
}

type TabType = 'profile' | 'history' | 'loyalty' | 'referral' | 'settings';

export const ProfileAndHistory: React.FC<ProfileAndHistoryProps> = ({ onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>(MOCK_USER);

  const handleSaveProfile = () => {
    setUser(editedUser);
    setIsEditing(false);
    toast.success('Profil mis à jour avec succès');
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast.success('Code de parrainage copié !');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            key="profile-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center py-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-500 shadow-xl">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full shadow-lg border-2 border-white">
                  <Edit2 size={16} />
                </button>
              </div>
              <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center gap-1 text-yellow-500 mt-1">
                <Star size={16} fill="currentColor" />
                <span className="font-bold">{user.rating}</span>
                <span className="text-gray-400 font-normal ml-1">({user.totalRides} trajets)</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-gray-500 shadow-sm">
                    <Mail size={18} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs text-gray-400 font-medium">Email</p>
                    {isEditing ? (
                      <Input 
                        value={editedUser.email} 
                        onChange={e => setEditedUser({...editedUser, email: e.target.value})}
                        className="mt-1 h-8 text-sm"
                      />
                    ) : (
                      <p className="font-bold text-gray-800">{user.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-gray-500 shadow-sm">
                    <Smartphone size={18} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs text-gray-400 font-medium">Téléphone</p>
                    {isEditing ? (
                      <Input 
                        value={editedUser.phone} 
                        onChange={e => setEditedUser({...editedUser, phone: e.target.value})}
                        className="mt-1 h-8 text-sm"
                      />
                    ) : (
                      <p className="font-bold text-gray-800">{user.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-gray-500 shadow-sm">
                    <Calendar size={18} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs text-gray-400 font-medium">Membre depuis</p>
                    <p className="font-bold text-gray-800">{user.joinedDate}</p>
                  </div>
                </div>
              </div>

              {isEditing ? (
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUser(user);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button 
                    className="flex-1 h-12 rounded-xl bg-black text-white hover:bg-gray-900" 
                    onClick={handleSaveProfile}
                  >
                    Enregistrer
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="secondary" 
                  className="w-full h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-black font-bold"
                  onClick={() => setIsEditing(true)}
                >
                  Modifier le profil
                </Button>
              )}

              <Button 
                variant="ghost" 
                className="w-full h-12 rounded-xl text-red-500 hover:bg-red-50 font-bold flex items-center justify-center gap-2"
                onClick={onLogout}
              >
                <LogOut size={18} />
                <span>Se déconnecter</span>
              </Button>
            </div>
          </motion.div>
        );

      case 'history':
        return (
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-900">Derniers trajets</h3>
              <div className="flex gap-2">
                <button className="text-[10px] font-bold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg">Tous</button>
                <button className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-lg">Mois</button>
              </div>
            </div>
            {MOCK_RIDE_HISTORY.map((ride) => (
              <div key={ride.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${ride.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {ride.status === 'completed' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${ride.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                      {ride.status === 'completed' ? 'Terminé' : 'Annulé'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{ride.date}</span>
                </div>

                <div className="space-y-3 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-100" />
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                    <p className="text-sm font-medium text-gray-700 truncate">{ride.origin}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 border-2 border-white shadow-sm" />
                    <p className="text-sm font-bold text-gray-900 truncate">{ride.destination}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dashed flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      {ride.vehicleType === 'moto' ? <Bike size={16} /> : <MapPin size={16} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{ride.vehicleName}</p>
                      {ride.driverName && <p className="text-[10px] text-gray-500">Chauffeur: {ride.driverName}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">{ride.fare.toLocaleString()} GNF</p>
                    <p className="text-[10px] text-gray-400 font-medium">Paiement {ride.paymentMethod === 'digital' ? 'Digital' : 'Espèces'}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        );

      case 'loyalty':
        return (
          <motion.div
            key="loyalty-tab"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-[-20px] right-[-20px] opacity-20">
                <Trophy size={120} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">Points de fidélité</p>
              <h3 className="text-4xl font-black mt-1">{user.loyaltyPoints}</h3>
              <p className="text-[10px] mt-4 font-bold bg-white/20 inline-block px-2 py-1 rounded-full backdrop-blur-sm">
                Niveau Or • 150 pts avant le niveau Diamant
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">Récompenses disponibles</h4>
              {[
                { title: 'Trajet Gratuit (Max 25k GNF)', points: 1000, icon: <Bike className="text-blue-500" /> },
                { title: '-50% sur votre prochain trajet', points: 500, icon: <Star className="text-yellow-500" /> },
                { title: 'Priorité de prise en charge', points: 200, icon: <Trophy className="text-amber-500" /> },
              ].map((reward, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                      {reward.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{reward.title}</p>
                      <p className="text-xs text-gray-500">{reward.points} points</p>
                    </div>
                  </div>
                  <Button size="sm" className="h-8 rounded-lg bg-black text-white text-xs font-bold px-4" disabled={user.loyaltyPoints < reward.points}>
                    Échanger
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'referral':
        return (
          <motion.div
            key="referral-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-center"
          >
            <div className="py-8 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                <Gift size={40} />
              </div>
              <h3 className="text-xl font-black text-gray-900">Parrainez un ami</h3>
              <p className="text-sm text-gray-500 mt-2 px-6">
                Offrez 10,000 GNF à un ami et recevez 10,000 GNF après son premier trajet.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Votre code</p>
              <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-lg font-black tracking-widest">{user.referralCode}</span>
                <button onClick={copyReferralCode} className="p-2 hover:bg-gray-50 rounded-xl text-yellow-600 transition-colors">
                  <Copy size={20} />
                </button>
              </div>
            </div>

            <Button className="w-full h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-black font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-yellow-200">
              <Share2 size={20} />
              Inviter des amis
            </Button>

            <div className="pt-4">
              <div className="flex justify-between items-center text-left p-4 bg-white border border-gray-100 rounded-2xl">
                <div>
                  <p className="text-sm font-bold text-gray-900">Amis parrainés</p>
                  <p className="text-xs text-gray-500">3 amis ont rejoint Wongaye</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-600">+30,000 GNF</p>
                  <p className="text-[10px] text-gray-400">Gagnés au total</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            key="settings-tab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-100">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Globe size={18} /></div>
                  <span className="text-sm font-bold">Langue</span>
                </div>
                <span className="text-xs font-bold text-gray-500">Français (GN)</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Bell size={18} /></div>
                  <span className="text-sm font-bold">Notifications Push</span>
                </div>
                <div className="w-10 h-6 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Bike size={18} /></div>
                  <span className="text-sm font-bold">Véhicule préféré</span>
                </div>
                <span className="text-xs font-bold text-gray-500">TVS ZT</span>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-2xl">
              <p className="text-xs font-bold text-red-600 uppercase mb-2">Zone Danger</p>
              <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-100 h-10 px-0">
                Supprimer mon compte définitivement
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-4 bg-white sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">
          {activeTab === 'profile' ? 'Mon Profil' : 
           activeTab === 'history' ? 'Historique' :
           activeTab === 'loyalty' ? 'Fidélité' :
           activeTab === 'referral' ? 'Parrainage' : 'Paramètres'}
        </h1>
      </div>

      {/* Modern Horizontal Navigation */}
      <div className="flex p-2 bg-gray-50 mx-4 mt-4 rounded-2xl overflow-x-auto no-scrollbar gap-2">
        {[
          { id: 'profile', icon: <User size={18} />, label: 'Profil' },
          { id: 'history', icon: <History size={18} />, label: 'Trajets' },
          { id: 'loyalty', icon: <Trophy size={18} />, label: 'Points' },
          { id: 'referral', icon: <Gift size={18} />, label: 'Cadeaux' },
          { id: 'settings', icon: <Settings size={18} />, label: 'Paramètres' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-white shadow-sm text-black ring-1 ring-black/5' : 'text-gray-400'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-grow overflow-y-auto px-4 pb-10 pt-4">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>
    </div>
  );
};
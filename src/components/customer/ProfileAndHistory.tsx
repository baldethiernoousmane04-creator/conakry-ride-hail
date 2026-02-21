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
  XCircle 
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

export const ProfileAndHistory: React.FC<ProfileAndHistoryProps> = ({ onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>(MOCK_USER);

  const handleSaveProfile = () => {
    setUser(editedUser);
    setIsEditing(false);
    toast.success('Profil mis à jour avec succès');
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-4 bg-white sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">
          {activeTab === 'profile' ? 'Mon Profil' : 'Historique des trajets'}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 mx-4 my-4 rounded-xl">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'profile' ? 'bg-white shadow-sm text-black' : 'text-gray-500'
          }`}
        >
          <User size={18} />
          <span>Profil</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'history' ? 'bg-white shadow-sm text-black' : 'text-gray-500'
          }`}
        >
          <History size={18} />
          <span>Historique</span>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto px-4 pb-10">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
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
          ) : (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
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
                        {ride.vehicleType === 'moto' ? <Smartphone size={16} className="rotate-12" /> : <MapPin size={16} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{ride.vehicleName}</p>
                        {ride.driverName && <p className="text-[10px] text-gray-500">Chauffeur: {ride.driverName}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900">{ride.fare.toLocaleString()} GN</p>
                      <p className="text-[10px] text-gray-400 font-medium">Paiement Espèces</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {MOCK_RIDE_HISTORY.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <History size={32} />
                  </div>
                  <p className="font-medium">Aucun trajet trouvé</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
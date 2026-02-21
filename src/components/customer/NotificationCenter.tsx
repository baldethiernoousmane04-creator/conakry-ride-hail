import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronLeft, Trash2, CheckCircle2, Ticket, Info, MapPin, HeadphonesIcon, BellRing, Settings2 } from 'lucide-react';
import { Button } from '../ui/button';
import { MOCK_NOTIFICATIONS } from '../../lib/data';
import { AppNotification } from '../../types';
import { toast } from 'sonner';
import { requestNotificationPermission, getNotificationPermission, sendLocalNotification } from '../../lib/utils';

interface NotificationCenterProps {
  onBack: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onBack }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>(getNotificationPermission());

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setPushPermission(result);
    if (result === 'granted') {
      toast.success("Notifications activées !");
      sendLocalNotification("Wongaye", {
        body: "Vous recevrez désormais nos mises à jour en temps réel.",
      });
    } else if (result === 'denied') {
      toast.error("Notifications bloquées par le navigateur");
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("Toutes les notifications sont marquées comme lues");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.info("Notification supprimée");
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'promo': return <Ticket className="text-orange-500" size={20} />;
      case 'trip': return <MapPin className="text-green-500" size={20} />;
      case 'support': return <HeadphonesIcon className="text-blue-500" size={20} />;
      default: return <Info className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between border-b sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-yellow-600 font-semibold hover:text-yellow-700 hover:bg-yellow-50"
            >
              Tout lire
            </Button>
          )}
        </div>
      </div>

      {/* Push Notification Banner */}
      {pushPermission !== 'granted' && pushPermission !== 'unsupported' && (
        <div className="m-4 p-4 bg-yellow-50 border border-yellow-100 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
              <BellRing className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Activer les notifications Push</p>
              <p className="text-xs text-gray-500">Ne manquez aucune mise à jour importante.</p>
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-xs px-4 h-9"
            onClick={handleRequestPermission}
          >
            Activer
          </Button>
        </div>
      )}

      {/* Notifications List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <AnimatePresence initial={false}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => markAsRead(notification.id)}
                className={`relative bg-white p-4 rounded-2xl shadow-sm border-l-4 transition-all ${
                  notification.read ? 'border-l-transparent opacity-75' : 'border-l-yellow-500 shadow-md'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    notification.read ? 'bg-gray-100' : 'bg-yellow-50'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-bold text-sm ${notification.read ? 'text-gray-700' : 'text-black'}`}>
                        {notification.title}
                      </h3>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] font-medium text-gray-400">{notification.date}</span>
                      {!notification.read && (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <CheckCircle2 size={10} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Nouveau</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="text-gray-300" size={40} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Aucune notification</h2>
              <p className="text-gray-500 text-sm max-w-[200px] mt-1">
                Vous recevrez ici les alertes importantes et promotions.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Settings2 size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400">Statut Push: {pushPermission === 'granted' ? 'Activé' : 'Désactivé'}</span>
        </div>
        <p className="text-xs text-gray-400">
          Les notifications sont conservées pendant 30 jours.
        </p>
      </div>
    </div>
  );
};
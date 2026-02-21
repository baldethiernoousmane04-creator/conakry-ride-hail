import React, { useState, useEffect } from 'react';
import { CustomerInterface } from './components/customer/CustomerInterface';
import { DriverInterface } from './components/driver/DriverInterface';
import { AdminDashboard } from './components/admin/AdminDashboard';
import type { UserRole } from './types';
import { Toaster } from 'sonner';
import { registerServiceWorker, requestNotificationPermission } from './lib/utils';
import { toast } from 'sonner';

/**
 * App component that handles role switching and rendering the appropriate interface.
 */
const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('customer');

  useEffect(() => {
    // Initialize Push Notifications
    const initNotifications = async () => {
      try {
        await registerServiceWorker();
        // We don't force permission request on load as it's bad UX, 
        // but we check if we should suggest it.
        if (Notification.permission === 'default') {
          console.log('Notifications permission not yet requested');
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initNotifications();

    try {
      const savedRole = localStorage.getItem('wongaye_role');
      if (savedRole === 'customer' || savedRole === 'driver' || savedRole === 'admin') {
        setRole(savedRole as UserRole);
      }
    } catch (e) {
      console.warn('LocalStorage not available:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('wongaye_role', role);
    } catch (e) {
      console.warn('Could not save role to LocalStorage:', e);
    }
  }, [role]);

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 antialiased">
      <Toaster position="top-center" expand={true} richColors />
      
      {role === 'customer' && (
        <CustomerInterface 
          key="customer-ui-container"
          onSwitchToDriver={() => setRole('driver')} 
        />
      )}

      {role === 'driver' && (
        <DriverInterface 
          key="driver-ui-container"
          onSwitchToCustomer={() => setRole('customer')}
          onSwitchToAdmin={() => setRole('admin')}
        />
      )}

      {role === 'admin' && (
        <AdminDashboard 
          key="admin-ui-container"
          onBack={() => setRole('driver')}
        />
      )}
    </div>
  );
};

export default App;
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import { Toaster } from 'sonner';
import { registerServiceWorker } from './lib/utils';
import { Loader2, LogOut, Settings, LayoutGrid, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load heavy interface components to prevent initial bundle bloat and isolate errors
const CustomerInterface = lazy(() => import('./components/customer/CustomerInterface').then(m => ({ default: m.CustomerInterface })));
const DriverInterface = lazy(() => import('./components/driver/DriverInterface').then(m => ({ default: m.DriverInterface })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AuthScreen = lazy(() => import('./components/auth/AuthScreen').then(m => ({ default: m.AuthScreen })));

/**
 * Loading fallback for lazy components
 */
const ComponentLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-white">
    <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
  </div>
);

/**
 * Main Application logic after authentication
 */
const AppContent: React.FC = () => {
  const { user, role, loading, updateRole, signOut } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showSlowLoading, setShowSlowLoading] = useState(false);

  useEffect(() => {
    // Show slow loading message after 5 seconds
    const timer = setTimeout(() => {
      if (loading) setShowSlowLoading(true);
    }, 5000);

    // Initialize Push Notifications
    const initNotifications = async () => {
      try {
        await registerServiceWorker();
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initNotifications();
    return () => clearTimeout(timer);
  }, [loading]);

  const handleManualRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-yellow-50 overflow-hidden p-6 antialiased">
        <div className="relative flex flex-col items-center gap-6 p-8 max-w-sm w-full">
          <div className="w-24 h-24 bg-yellow-400 rounded-[2.5rem] flex items-center justify-center animate-bounce shadow-2xl ring-8 ring-white/50">
            <span className="text-4xl font-black text-black tracking-tighter">W</span>
          </div>
          
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-yellow-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Wongaye - Gebeya Dala</h2>
              <p className="text-gray-500 font-medium animate-pulse text-sm mt-1">
                {showSlowLoading ? "La connexion prend un peu plus de temps..." : "Chargement de votre session sécurisée..."}
              </p>
            </div>
          </div>

          {showSlowLoading && (
            <div className="mt-8 w-full space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="flex items-center gap-2 p-3 bg-yellow-100/50 rounded-xl text-yellow-800 text-xs border border-yellow-200/50">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>Le contenu est temporairement lent à charger. Voulez-vous réessayer ?</p>
              </div>
              <Button 
                onClick={handleManualRefresh}
                className="w-full bg-black text-white hover:bg-gray-800 font-bold h-12 rounded-xl flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Actualiser la page
              </Button>
            </div>
          )}
          
          <div className="mt-8 flex gap-1">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
             ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Suspense fallback={<ComponentLoader />}>
        <AuthScreen />
      </Suspense>
    );
  }

  const renderInterface = () => {
    switch (role) {
      case 'customer':
        return (
          <CustomerInterface 
            onSwitchToDriver={() => updateRole('driver')} 
          />
        );
      case 'driver':
        return (
          <DriverInterface 
            onSwitchToCustomer={() => updateRole('customer')}
            onSwitchToAdmin={() => updateRole('admin')}
          />
        );
      case 'admin':
        return (
          <AdminDashboard 
            onBack={() => updateRole('driver')}
          />
        );
      default:
        return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 flex flex-col items-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <LayoutGrid className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-tighter">Erreur d'Accès</h1>
              <p className="text-gray-600 mb-8 font-medium">
                Votre rôle utilisateur n'est pas reconnu. Veuillez contacter le support ou vous reconnecter.
              </p>
              <Button 
                onClick={signOut}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black h-14 rounded-2xl shadow-lg shadow-yellow-100 uppercase tracking-widest text-xs"
              >
                Se Déconnecter
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 antialiased selection:bg-yellow-100">
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
        {showSettings && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
             <Button 
              variant="outline" 
              size="sm" 
              onClick={() => updateRole('admin')}
              className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-100 text-[10px] font-black h-10 px-4 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-all border uppercase tracking-widest"
            >
              Mode Administrateur
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-100 text-[10px] font-black text-red-600 h-10 px-4 rounded-full flex items-center gap-2 hover:bg-red-50 transition-all border uppercase tracking-widest"
            >
              <LogOut className="w-3.5 h-3.5" />
              Se déconnecter
            </Button>
          </div>
        )}
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={() => setShowSettings(!showSettings)}
          className="w-14 h-14 rounded-full bg-black hover:bg-gray-800 text-yellow-400 shadow-2xl ring-4 ring-white/80 pointer-events-auto transition-transform active:scale-95 flex items-center justify-center"
        >
          <Settings className={`w-7 h-7 ${showSettings ? 'rotate-180' : 'rotate-0'} transition-all duration-500 ease-in-out`} />
        </Button>
      </div>

      <ErrorBoundary name="Interface">
        <Suspense fallback={<ComponentLoader />}>
          {renderInterface()}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary name="AppRoot">
      <AuthProvider>
        <Toaster position="top-center" expand={true} richColors closeButton />
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
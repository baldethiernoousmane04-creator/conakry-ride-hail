import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCw, Home, LifeBuoy } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Robust Error Boundary to catch rendering errors and prevent white screens.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary [${this.props.name || 'Global'}]:`, error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.href = '/';
  };

  private handleClearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center antialiased">
          <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl max-w-lg w-full border border-gray-100 animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-red-50/50">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter uppercase">
              Application indisponible
            </h1>
            <p className="text-gray-600 mb-10 font-medium leading-relaxed">
              Une erreur inattendue empêche l'affichage de l'application. Ne vous inquiétez pas, vos données sont en sécurité.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={this.handleRetry}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black h-14 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-200 transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                <RefreshCw className="w-5 h-5" />
                Actualiser
              </Button>
              
              <Button 
                variant="outline"
                onClick={this.handleGoHome}
                className="w-full border-gray-200 text-gray-700 font-black h-14 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                <Home className="w-5 h-5" />
                Accueil
              </Button>

              <Button 
                variant="ghost"
                onClick={this.handleClearStorage}
                className="w-full sm:col-span-2 text-gray-400 hover:text-red-500 font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-colors text-[10px] uppercase tracking-widest"
              >
                <LifeBuoy className="w-4 h-4" />
                Réinitialiser les données locales
              </Button>
            </div>
            
            <div className="mt-10 pt-8 border-t border-gray-100">
              <details className="text-left group">
                <summary className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1 cursor-pointer hover:text-gray-600 transition-colors flex items-center gap-2 select-none">
                  Détails techniques
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 bg-gray-50 p-4 rounded-xl overflow-auto max-h-48 border border-gray-100">
                  <code className="text-[10px] text-red-600 font-mono leading-relaxed block whitespace-pre-wrap">
                    {this.state.error?.stack || this.state.error?.message || 'Erreur inconnue'}
                  </code>
                </div>
              </details>
            </div>
          </div>
          
          <p className="mt-10 text-xs text-gray-400 font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Wongaye • Gebeya Dala
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail, Lock, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LoginProps {
  onSignUp: () => void;
  onForgotPassword: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSignUp, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setShowResend(false);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('confirm') || error.message.toLowerCase().includes('v\u00e9rifier')) {
          setShowResend(true);
        }
        throw error;
      }
      
      toast.success('Connexion r\u00e9ussie !');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast.error('Veuillez saisir votre e-mail');
      return;
    }

    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;
      toast.success('E-mail de confirmation renvoy\u00e9 !');
      setShowResend(false);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg rotate-3">
          <span className="text-3xl font-bold text-black">W</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tighter uppercase">Bon retour !</h1>
        <p className="text-gray-500 mt-2 text-center text-sm font-medium uppercase tracking-wider">
          Connectez-vous pour commencer votre trajet.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 ml-1 uppercase tracking-widest">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl font-bold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Mot de passe</label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[10px] font-black text-yellow-600 hover:text-yellow-700 transition-colors uppercase tracking-widest"
            >
              Mot de passe oubli\u00e9 ?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="password"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl font-bold"
            />
          </div>
        </div>

        {showResend && (
          <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-yellow-800">E-mail non confirm\u00e9</p>
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resending}
                className="text-[10px] font-black text-yellow-600 hover:text-yellow-700 uppercase tracking-widest underline underline-offset-2 flex items-center gap-1"
              >
                {resending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Renvoyer le lien de confirmation'}
              </button>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 uppercase tracking-widest text-xs"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Se connecter
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center border-t border-gray-50 pt-6">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
          Pas encore de compte ?{' '}
          <button
            onClick={onSignUp}
            className="font-black text-yellow-600 hover:text-yellow-700 underline underline-offset-4"
          >
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  );
};
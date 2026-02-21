import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ForgotPasswordProps {
  onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Veuillez entrer votre adresse e-mail');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success('Lien de réinitialisation envoyé !');
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérifiez vos e-mails</h2>
        <p className="text-gray-500 mb-8">
          Si un compte est associé à l'adresse <span className="font-semibold text-gray-900">{email}</span>, 
          vous recevrez un lien pour réinitialiser votre mot de passe.
        </p>
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full h-12 rounded-xl border-gray-200 font-semibold"
        >
          Retour à la connexion
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h1>
        <p className="text-gray-500 mt-2">
          Ne vous inquiétez pas ! Entrez votre e-mail et nous vous enverrons un lien pour créer un nouveau mot de passe.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">Votre E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Envoyer le lien
              <Send className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail, Lock, User, Phone, Loader2, ArrowRight, Check, Gift } from 'lucide-react';
import { toast } from 'sonner';

interface SignUpProps {
  onLogin: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            name: formData.fullName, // Send both to match trigger logic
            phone: formData.phone,
            role: 'customer', // Default role
            referral_code_used: formData.referralCode || null,
          },
        },
      });

      if (error) throw error;
      toast.success('Inscription réussie ! Veuillez vérifier votre boîte mail pour confirmer votre compte.');
      if (formData.referralCode) {
        toast.info(`Code de parrainage ${formData.referralCode} appliqué !`);
      }
      // Don't auto-login or switch to login yet, maybe stay on a "check email" view
      // But for this app flow, we switch to login
      onLogin();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg -rotate-3">
          <span className="text-3xl font-bold text-black">W</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tighter uppercase">Rejoindre Wongaye</h1>
        <p className="text-gray-500 mt-2 text-center text-xs font-bold uppercase tracking-widest">
          Créez votre compte en quelques secondes.
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-500 ml-1 uppercase tracking-widest">Nom Complet</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              name="fullName"
              placeholder="Jean Dupont"
              value={formData.fullName}
              onChange={handleChange}
              className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl text-sm font-bold"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-500 ml-1 uppercase tracking-widest">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              name="email"
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl text-sm font-bold"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-500 ml-1 uppercase tracking-widest">Téléphone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              name="phone"
              placeholder="+224 6XX XX XX XX"
              value={formData.phone}
              onChange={handleChange}
              className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl text-sm font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 ml-1 uppercase tracking-widest">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl text-sm font-bold"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 ml-1 uppercase tracking-widest">Confirmer</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl text-sm font-bold"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-500 ml-1 uppercase tracking-widest">Code de parrainage (Optionnel)</label>
          <div className="relative">
            <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              name="referralCode"
              placeholder="Ex: ALPHA224"
              value={formData.referralCode}
              onChange={handleChange}
              className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl text-sm uppercase font-black tracking-widest"
            />
          </div>
        </div>

        <div className="flex items-start gap-2 py-2">
          <div className="mt-1 w-4 h-4 rounded border border-gray-300 flex items-center justify-center bg-gray-50">
            <Check className="w-3 h-3 text-yellow-600" />
          </div>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">
            J'accepte les conditions d'utilisation de Wongaye.
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              S'inscrire
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center border-t border-gray-50 pt-4">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          Déjà un compte ?{' '}
          <button
            onClick={onLogin}
            className="font-black text-yellow-600 hover:text-yellow-700 underline underline-offset-4"
          >
            SE CONNECTER
          </button>
        </p>
      </div>
    </div>
  );
};
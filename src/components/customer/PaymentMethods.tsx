import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard, Smartphone, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { PaymentMethod } from '../../types';
import { toast } from 'sonner';

interface PaymentMethodsProps {
  onSelect?: (method: PaymentMethod) => void;
  selectable?: boolean;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ onSelect, selectable = false }) => {
  const { user } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'card' as const,
    lastDigits: '',
  });

  useEffect(() => {
    if (user) fetchMethods();
  }, [user]);

  const fetchMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMethods(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          type: newMethod.type,
          last_digits: newMethod.lastDigits,
          is_default: methods.length === 0,
        })
        .select()
        .single();

      if (error) throw error;
      setMethods([data, ...methods]);
      setShowAdd(false);
      setNewMethod({ type: 'card', lastDigits: '' });
      toast.success('Mode de paiement ajouté');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMethods(methods.filter(m => m.id !== id));
      toast.success('Mode de paiement supprimé');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const setDefault = async (id: string) => {
    try {
      // Set all to false
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user?.id);
      
      // Set target to true
      await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);

      setMethods(methods.map(m => ({ ...m, is_default: m.id === id })));
      toast.success('Mode de paiement par défaut mis à jour');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="p-4 text-center">Chargement...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-4">
        <h3 className="font-bold text-gray-900">Mes modes de paiement</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowAdd(!showAdd)}
          className="text-yellow-600 font-bold"
        >
          {showAdd ? 'Annuler' : <><Plus size={16} className="mr-1" /> Ajouter</>}
        </Button>
      </div>

      {showAdd && (
        <motion.form 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          onSubmit={handleAddMethod}
          className="bg-white p-4 mx-4 rounded-2xl border border-yellow-200 space-y-3"
        >
          <div className="grid grid-cols-2 gap-2">
            {['card', 'orange_money', 'mtn_momo'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setNewMethod({ ...newMethod, type: type as any })}
                className={`p-2 text-xs font-bold rounded-lg border ${
                  newMethod.type === type ? 'bg-yellow-50 border-yellow-500 text-yellow-700' : 'bg-gray-50 border-gray-100'
                }`}
              >
                {type.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
          <Input 
            placeholder={newMethod.type === 'card' ? '4 derniers chiffres' : 'Numéro de téléphone'}
            value={newMethod.lastDigits}
            onChange={(e) => setNewMethod({ ...newMethod, lastDigits: e.target.value })}
            maxLength={newMethod.type === 'card' ? 4 : 10}
            required
          />
          <Button type="submit" className="w-full bg-yellow-500 text-black font-bold">
            Confirmer l'ajout
          </Button>
        </motion.form>
      )}

      <div className="space-y-3 px-4">
        {methods.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-2xl text-center border border-dashed">
            <CreditCard className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="text-sm text-gray-500">Aucun mode de paiement enregistré</p>
          </div>
        ) : (
          methods.map((method) => (
            <div 
              key={method.id}
              onClick={() => selectable && onSelect?.(method)}
              className={`bg-white p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                selectable ? 'cursor-pointer hover:border-yellow-500' : ''
              } ${method.is_default ? 'border-yellow-200 bg-yellow-50/20' : 'border-gray-100'}`}
            >
              <div className={`p-3 rounded-xl ${
                method.type === 'card' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
              }`}>
                {method.type === 'card' ? <CreditCard size={20} /> : <Smartphone size={20} />}
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-sm text-gray-900 capitalize">
                  {method.type.replace('_', ' ')}
                </h4>
                <p className="text-gray-500 text-xs">
                  {method.type === 'card' ? `**** **** **** ${method.last_digits}` : method.last_digits}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {method.is_default && <CheckCircle2 size={16} className="text-green-500" />}
                {!selectable && (
                  <>
                    {!method.is_default && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDefault(method.id); }}
                        className="text-[10px] font-bold text-gray-400 hover:text-yellow-600"
                      >
                        Défaut
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(method.id); }}
                      className="text-gray-300 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
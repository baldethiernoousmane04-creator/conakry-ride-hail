import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, ArrowUpRight, ArrowDownLeft, Calendar, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { Transaction } from '../../types';
import { formatCurrency } from '../../lib/utils';

export const PaymentHistory: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      // Query the transactions with joined data
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          type,
          status,
          description,
          created_at,
          ride_id,
          rides (
            pickup_address,
            destination_address
          ),
          payment_methods (
            type,
            last_digits
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching history:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Chargement de l'historique...</div>;

  return (
    <div className="space-y-4 px-4 pb-10">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Historique des transactions</h3>
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <History className="mx-auto mb-2 opacity-20" size={48} />
            <p>Aucune transaction récente</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <motion.div 
              key={tx.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  tx.type === 'topup' ? 'bg-green-50 text-green-600' : 
                  tx.type === 'ride' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                }`}>
                  {tx.type === 'topup' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 leading-tight">
                        {tx.description || (tx.type === 'ride' ? 'Course Wongaye' : 'Rechargement')}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(tx.created_at).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${
                        tx.type === 'topup' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {tx.type === 'topup' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-700' : 
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>

                  {tx.rides && (
                    <div className="mt-3 pt-3 border-t border-gray-50 space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="truncate">{tx.rides.pickup_address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="truncate">{tx.rides.destination_address}</span>
                      </div>
                    </div>
                  )}

                  {tx.payment_methods && (
                    <p className="text-[9px] text-gray-400 mt-2 font-medium">
                      Payé via {tx.payment_methods.type.replace('_', ' ')} (**** {tx.payment_methods.last_digits})
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
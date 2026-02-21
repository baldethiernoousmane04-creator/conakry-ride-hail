import React, { useState } from 'react';
import { Star, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { createRating } from '../lib/data';

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  raterUserId: string;
  ratedUserId: string;
  ratedUserName: string;
  ratedUserAvatar?: string;
  onRatingSubmitted?: () => void;
}

export const RatingDialog: React.FC<RatingDialogProps> = ({
  isOpen,
  onClose,
  tripId,
  raterUserId,
  ratedUserId,
  ratedUserName,
  ratedUserAvatar,
  onRatingSubmitted
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }

    setIsSubmitting(true);
    try {
      await createRating({
        tripId,
        raterUserId,
        ratedUserId,
        ratingValue: rating,
        reviewText: review,
      });
      toast.success('Merci pour votre avis !');
      onRatingSubmitted?.();
      onClose();
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%', scale: 1 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: '100%', scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-yellow-500 p-1 bg-white shadow-lg overflow-hidden">
                <img
                  src={ratedUserAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(ratedUserName)}&background=random`}
                  alt={ratedUserName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Notez votre trajet</h2>
              <p className="text-gray-500 mt-1">Comment était votre expérience avec {ratedUserName} ?</p>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform active:scale-95"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={40}
                    className={`transition-colors ${
                      star <= (hover || rating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Un commentaire ? (Optionnel)"
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all resize-none h-24 text-gray-700"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="w-full h-14 rounded-2xl bg-black hover:bg-gray-900 text-white font-bold text-lg shadow-xl shadow-gray-200"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Envoyer ma note
                    <Send size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
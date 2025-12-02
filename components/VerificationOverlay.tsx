import React from 'react';
import { motion } from 'framer-motion';
import { Worry } from '../types';
import { Check, X } from 'lucide-react';

interface VerificationOverlayProps {
  worry: Worry;
  onResolve: (worryId: string, status: 'happened' | 'did_not_happen', reflection?: string) => void;
}

export const VerificationOverlay: React.FC<VerificationOverlayProps> = ({ worry, onResolve }) => {
  const [outcome, setOutcome] = React.useState<'happened' | 'did_not_happen' | null>(null);
  const [reflection, setReflection] = React.useState('');

  const handleComplete = () => {
    if (outcome) {
      onResolve(worry.id, outcome, reflection);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-midnight/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
      <motion.div
        {...({
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 }
        } as any)}
        className="w-full max-w-md"
      >
        <span className="block text-center text-accent text-sm font-bold tracking-[0.2em] uppercase mb-8">
          Reality Check
        </span>

        <div className="bg-surface border border-slate-200 dark:border-slate-800 p-8 rounded-2xl mb-8 shadow-2xl">
          <p className="text-slate-500 text-sm mb-2 italic">
            Le {new Date(worry.createdAt).toLocaleDateString('fr-FR')}, vous aviez peur de ceci :
          </p>
          <h3 className="text-xl md:text-2xl text-slate-900 dark:text-white font-light leading-relaxed">
            "{worry.text}"
          </h3>
        </div>

        {!outcome ? (
          <>
            <p className="text-center text-slate-900 dark:text-white text-lg mb-8 font-medium">
              Est-ce que c'est vraiment arrivé ?
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setOutcome('did_not_happen')}
                className="flex-1 bg-emerald-500/10 border border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 py-4 rounded-xl flex items-center justify-center gap-2 transition-all group"
              >
                <X size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-bold">NON</span>
              </button>

              <button
                onClick={() => setOutcome('happened')}
                className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Check size={20} />
                <span className="font-medium">OUI</span>
              </button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Qu'avez-vous appris ? (Optionnel)
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder={outcome === 'did_not_happen' ? "Pourquoi me suis-je inquiété pour rien ?" : "Comment ai-je géré la situation ?"}
                className="w-full bg-surface/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-accent h-32 resize-none"
                autoFocus
              />
            </div>

            <button
              onClick={handleComplete}
              className="w-full py-4 bg-accent text-white dark:text-midnight font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Terminer
            </button>

            <button
              onClick={() => setOutcome(null)}
              className="w-full py-2 text-slate-500 text-sm hover:text-slate-700 dark:hover:text-slate-300"
            >
              Retour
            </button>
          </motion.div>
        )}

        {!outcome && (
          <p className="text-center text-slate-500 dark:text-slate-600 text-xs mt-6">
            Soyez honnête pour un score précis.
          </p>
        )}
      </motion.div>
    </div>
  );
};

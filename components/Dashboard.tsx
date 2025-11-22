
import React, { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Worry } from '../types';
import { motion } from 'framer-motion';

interface DashboardProps {
  worries: Worry[];
  onAddPress: () => void;
  onSettingsPress: () => void;
  userName?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ worries, onAddPress, userName }) => {
  
  // Helper pour mettre la majuscule
  const formatName = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const { rate, totalResolved, phrase } = useMemo(() => {
    const resolved = worries.filter((w) => w.status !== 'pending');
    const total = resolved.length;
    const formattedName = userName ? formatName(userName) : "";
    
    if (total === 0) {
      return { 
        rate: 0, 
        totalResolved: 0, 
        phrase: formattedName 
            ? `Bonjour ${formattedName}. Dépose une première pensée pour commencer.`
            : "Commence par déposer une angoisse pour construire ta lucidité." 
      };
    }

    const notHappened = resolved.filter((w) => w.status === 'did_not_happen').length;
    const calculatedRate = Math.round((notHappened / total) * 100);

    let text = "";
    
    if (calculatedRate >= 90) {
        text = formattedName ? `Bravo ${formattedName}. Tes peurs sont presque toujours des illusions.` : "Tes peurs sont presque toujours des illusions.";
    } else if (calculatedRate >= 75) {
        text = "La réalité est bien plus douce que tes pensées.";
    } else if (calculatedRate >= 65) {
        text = formattedName ? `${formattedName}, tu reprends le contrôle.` : "Tu reprends le contrôle.";
    } else {
        // Phrases de réconfort pour taux < 65% - ADOUCIES
        const comfortPhrases = [
            "Respire. Tes pensées ne sont pas la réalité.",
            "L'anxiété ment souvent, les chiffres le prouvent.",
            "C'est normal d'avoir peur, mais regarde les faits.",
            "Tu avances, petit à petit. C'est ce qui compte.",
            "Ne sois pas dur avec toi-même. Observe simplement.",
            "Cette statistique n'est qu'un début, courage."
        ];
        text = comfortPhrases[total % comfortPhrases.length];
    }

    return { rate: calculatedRate, totalResolved: total, phrase: text };
  }, [worries, userName]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 relative">
      
      {/* The Big Number */}
      <div className="flex flex-col items-center justify-center mb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <span className="text-[8rem] md:text-[10rem] font-thin leading-none text-accent tracking-tighter tabular-nums">
            {totalResolved === 0 ? "--" : `${rate}%`}
          </span>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-slate-400 text-sm md:text-base uppercase tracking-[0.2em] mt-2 font-medium"
        >
          Taux de Lucidité
        </motion.p>
      </div>

      {/* Reassuring Phrase */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-lg md:text-2xl text-slate-300 font-light max-w-xl leading-relaxed mb-12"
      >
        {phrase}
      </motion.p>

      {/* Action Button - Centered in flow */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddPress}
        className="bg-surface border border-slate-800 shadow-[0_0_40px_rgba(167,139,250,0.1)] p-6 md:p-8 rounded-full text-accent hover:bg-slate-900 hover:border-accent/50 transition-colors group"
        aria-label="Ajouter une angoisse"
      >
        <Plus size={32} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>
    </div>
  );
};

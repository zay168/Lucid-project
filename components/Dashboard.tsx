
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
    const n = userName ? formatName(userName) : "";
    const hasName = n.length > 0;
    
    if (total === 0) {
      return { 
        rate: 0, 
        totalResolved: 0, 
        phrase: hasName 
            ? `Bonjour ${n}. Dépose une première pensée pour commencer.`
            : "Commence par déposer une angoisse pour construire ta lucidité." 
      };
    }

    const notHappened = resolved.filter((w) => w.status === 'did_not_happen').length;
    const calculatedRate = Math.round((notHappened / total) * 100);

    let text = "";
    
    // Phrases plus riches et personnalisées par paliers
    if (calculatedRate === 100) {
        const phrases = [
            hasName ? `Incroyable ${n}. Aucune peur ne s'est réalisée.` : "Incroyable. Aucune peur ne s'est réalisée.",
            "La réalité est ton terrain de jeu, pas tes angoisses.",
            hasName ? `Tu es invincible, ${n}. 100% de lucidité.` : "Une lucidité totale. Tu es invincible.",
            "Ton esprit est une forteresse imprenable.",
            "Regarde ça. L'anxiété n'a aucune prise sur toi."
        ];
        text = phrases[total % phrases.length];
    } else if (calculatedRate >= 90) {
        const phrases = [
            hasName ? `Presque parfait, ${n}. Tu vois clair.` : "Presque parfait. Tu vois clair maintenant.",
            "Tes peurs sont des fantômes. Tu les traverses sans mal.",
            "Une lucidité impressionnante. Continue.",
            hasName ? `${n}, tu es la preuve que la peur ment.` : "Tu es la preuve que la peur ment.",
            "La sérénité n'est plus très loin."
        ];
        text = phrases[total % phrases.length];
    } else if (calculatedRate >= 80) {
        const phrases = [
            hasName ? `C'est excellent, ${n}.` : "C'est un excellent score.",
            "Tu apprends à distinguer le bruit du signal.",
            "La grande majorité de tes craintes étaient fausses.",
            "Tu gagnes du terrain chaque jour. Bravo.",
            hasName ? `Ta vision s'éclaircit, ${n}.` : "Ta vision s'éclaircit de jour en jour."
        ];
        text = phrases[total % phrases.length];
    } else if (calculatedRate >= 60) {
        const phrases = [
            hasName ? `Tu es sur la bonne voie, ${n}.` : "Tu es sur la bonne voie.",
            "Plus d'une fois sur deux, ton angoisse se trompe.",
            "Tu reprends le contrôle, doucement mais sûrement.",
            "Respire. Les faits sont plus rassurants que tes pensées.",
            hasName ? `Crois en ce chiffre, ${n}.` : "Crois en ce chiffre, pas en tes doutes."
        ];
        text = phrases[total % phrases.length];
    } else if (calculatedRate >= 40) {
        const phrases = [
            "C'est un combat, et tu es en train de l'apprendre.",
            hasName ? `Ne lâche rien ${n}.` : "Ne lâche rien. La lucidité est un muscle.",
            "Observe simplement. Tes peurs ont tort la moitié du temps.",
            "L'équilibre est fragile, mais tu es debout.",
            "Chaque vérification te rend plus fort(e)."
        ];
        text = phrases[total % phrases.length];
    } else {
        const phrases = [
            hasName ? `Courage ${n}. Tu es toujours là.` : "Courage. Tu es toujours là.",
            "Ce chiffre n'est qu'un début. Ne te juge pas.",
            "L'important est d'affronter la réalité.",
            "Même si tes peurs arrivent, tu as la force de gérer.",
            hasName ? `Doucement, ${n}. Un pas après l'autre.` : "Doucement. Un pas après l'autre.",
            "L'anxiété rend les choses pires qu'elles ne le sont."
        ];
        text = phrases[total % phrases.length];
    }

    return { rate: calculatedRate, totalResolved: total, phrase: text };
  }, [worries, userName]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 relative">
      
      {/* The Big Number */}
      <div className="flex flex-col items-center justify-center mb-12">
        <motion.div 
          {...({
            initial: { opacity: 0, scale: 0.8 },
            animate: { 
              opacity: 1, 
              scale: [1, 1.05, 1], // Breathing animation
            },
            transition: { 
              duration: 0.8, 
              ease: "easeOut",
              scale: {
                duration: 4, // Slow breathing
                repeat: Infinity,
                ease: "easeInOut"
              }
            }
          } as any)}
          className="relative"
        >
          <span className="text-[8rem] md:text-[10rem] font-thin leading-none text-accent tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(167,139,250,0.2)]">
            {totalResolved === 0 ? "--" : `${rate}%`}
          </span>
        </motion.div>
        
        <motion.p 
          {...({
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3, duration: 0.8 }
          } as any)}
          className="text-slate-400 text-sm md:text-base uppercase tracking-[0.2em] mt-2 font-medium"
        >
          Taux de Lucidité
        </motion.p>
      </div>

      {/* Reassuring Phrase */}
      <motion.p 
        {...({
            key: phrase, // Key change triggers animation on phrase update
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 }
        } as any)}
        className="text-center text-lg md:text-2xl text-slate-300 font-light max-w-xl leading-relaxed mb-12 min-h-[3rem]"
      >
        {phrase}
      </motion.p>

      {/* Action Button - Centered in flow */}
      <motion.button
        {...({
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.8 },
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 }
        } as any)}
        onClick={onAddPress}
        className="bg-surface border border-slate-800 shadow-[0_0_40px_rgba(167,139,250,0.1)] p-6 md:p-8 rounded-full text-accent hover:bg-slate-900 hover:border-accent/50 transition-colors group"
        aria-label="Ajouter une angoisse"
      >
        <Plus size={32} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>
    </div>
  );
};

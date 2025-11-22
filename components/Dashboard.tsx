
import React, { useMemo } from 'react';
import { Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
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

  const { rate, totalResolved, phrase, trend } = useMemo(() => {
    // 1. Filtrer les angoisses résolues
    const resolved = worries.filter((w) => w.status !== 'pending');
    const total = resolved.length;
    const n = userName ? formatName(userName) : "";
    const hasName = n.length > 0;
    
    // Cas Zéro : Pas encore de données
    if (total === 0) {
      return { 
        rate: 0, 
        totalResolved: 0, 
        phrase: hasName 
            ? `Bonjour ${n}. Dépose une première pensée pour commencer.`
            : "Commence par déposer une angoisse pour construire ta lucidité.",
        trend: 'neutral'
      };
    }

    // 2. Calcul du Taux Actuel
    const successCount = resolved.filter((w) => w.status === 'did_not_happen').length;
    const currentRate = Math.round((successCount / total) * 100);

    // 3. Algorithme de Tendance (Trend Detection)
    // On simule le taux précédent en retirant l'élément le plus récent (basé sur checkDate)
    // Cela nous permet de savoir si la dernière action a fait monter ou descendre le score.
    let trend: 'up' | 'down' | 'equal' = 'equal';
    
    if (total > 1) {
        // On trie par date de vérification pour trouver le "dernier" événement
        const sortedByDate = [...resolved].sort((a, b) => b.checkDate - a.checkDate);
        const latestWorry = sortedByDate[0];
        
        // On recalcule le score sans ce dernier élément
        const prevTotal = total - 1;
        const prevSuccess = latestWorry.status === 'did_not_happen' ? successCount - 1 : successCount;
        const prevRate = Math.round((prevSuccess / prevTotal) * 100);

        if (currentRate > prevRate) trend = 'up';
        else if (currentRate < prevRate) trend = 'down';
    } else {
        // S'il n'y a qu'un seul élément, la tendance dépend de sa réussite
        trend = currentRate === 100 ? 'up' : 'down';
    }

    let text = "";

    // --- LOGIQUE DE SÉLECTION DE PHRASE ---
    
    // CAS 1 : PERFECTION (100%)
    if (currentRate === 100) {
         const phrases = [
            hasName ? `Incroyable ${n}. Aucune peur ne s'est réalisée.` : "Incroyable. Aucune peur ne s'est réalisée.",
            "La réalité est ton terrain de jeu, pas tes angoisses.",
            "Ton esprit est une forteresse imprenable.",
            "Regarde ça. L'anxiété n'a aucune prise sur toi."
        ];
        text = phrases[total % phrases.length];
    } 
    
    // CAS 2 : CHUTE DU SCORE (Trend Down) - C'est ici qu'on gère l'empathie
    else if (trend === 'down') {
        const phrases = [
            hasName ? `La guérison n'est pas linéaire, ${n}.` : "La guérison n'est pas linéaire. Ce n'est qu'un chiffre.",
            "Ce recul est temporaire. Ne te juge pas sévèrement.",
            "C'est un rappel : la réalité gagne souvent, mais pas toujours.",
            hasName ? `Accepte l'incertitude, ${n}.` : "Accepte l'incertitude. Respire et continue.",
            "Une bataille perdue ne signifie pas que la guerre est finie.",
            "C'est normal de trébucher. Ton taux de lucidité reste solide."
        ];
        // On force une rotation basée sur le total pour varier
        text = phrases[total % phrases.length];
    }

    // CAS 3 : PROGRESSION (Trend Up) - Renforcement positif
    else if (trend === 'up') {
        const phrases = [
            hasName ? `Tu reprends le dessus, ${n}.` : "Tu reprends le dessus. C'est visible.",
            "Ta perception s'affine. Tu distingues le bruit du signal.",
            "Tu es en train de reprogrammer ton cerveau.",
            "Regarde ce chiffre monter. C'est ta victoire.",
            hasName ? `Bravo ${n}. Tu construis ta preuve.` : "Bravo. Tu construis ta preuve."
        ];
        text = phrases[total % phrases.length];
    }

    // CAS 4 : STABILITÉ (Trend Equal) - Messages de maintenance par paliers
    else {
        if (currentRate >= 80) {
            text = hasName ? `Tu maintiens le cap, ${n}.` : "Tu maintiens le cap. Excellent.";
        } else if (currentRate >= 50) {
            text = "L'équilibre est là. Continue d'observer.";
        } else {
            text = hasName ? `Patience, ${n}. Ça va venir.` : "Patience. La lucidité est un muscle.";
        }
    }

    return { rate: currentRate, totalResolved: total, phrase: text, trend };
  }, [worries, userName]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 relative">
      
      {/* The Big Number */}
      <div className="flex flex-col items-center justify-center mb-12 relative">
        <motion.div 
          {...({
            initial: { opacity: 0, scale: 0.8 },
            animate: { 
              opacity: 1, 
              scale: [1, 1.05, 1], 
            },
            transition: { 
              duration: 0.8, 
              ease: "easeOut",
              scale: {
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }
            }
          } as any)}
          className="relative z-10"
        >
          <span className={`text-[8rem] md:text-[10rem] font-thin leading-none tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(167,139,250,0.2)] ${
            trend === 'down' ? 'text-slate-200' : 'text-accent'
          }`}>
            {totalResolved === 0 ? "--" : `${rate}%`}
          </span>
        </motion.div>
        
        {/* Trend Indicator */}
        {totalResolved > 0 && (
             <motion.div
                {...({
                    initial: { opacity: 0, y: -10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.5 }
                } as any)}
                className={`absolute -right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-1 opacity-50`}
             >
                {trend === 'up' && <TrendingUp size={24} className="text-emerald-400" />}
                {trend === 'down' && <TrendingDown size={24} className="text-slate-500" />}
                {trend === 'equal' && <Minus size={24} className="text-slate-600" />}
             </motion.div>
        )}
        
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

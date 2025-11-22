
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Bell, ShieldCheck, User } from 'lucide-react';
import TextType from './TextType';

// Fix for missing Variants export in some environments
type Variants = any;

interface OnboardingProps {
  onComplete: (name: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');

  const requestNotifications = async () => {
    if ('Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch (e) {
        console.log("Notifications not supported or denied");
      }
    }
    // Complete regardless of permission result
    onComplete(name);
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const variants: Variants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="fixed inset-0 z-50 bg-midnight flex flex-col items-center justify-center p-8 text-center overflow-hidden">
      <AnimatePresence mode="wait">
        
        {/* STEP 0: WELCOME */}
        {step === 0 && (
          <motion.div
            key="step0"
            {...({
              variants: variants,
              initial: "enter",
              animate: "center",
              exit: "exit",
              transition: { type: "spring", stiffness: 300, damping: 30 }
            } as any)}
            className="flex flex-col items-center max-w-sm"
          >
            <motion.div 
                {...({
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  transition: { delay: 0.2 }
                } as any)}
                className="w-24 h-24 rounded-3xl bg-slate-800 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(167,139,250,0.15)] rotate-3"
            >
                <ShieldCheck size={48} className="text-accent" strokeWidth={2} />
            </motion.div>
            <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">LUCID</h1>
            <p className="text-slate-300 text-xl font-medium leading-relaxed">
              Ton nouveau coffre-fort mental.
            </p>
            <button 
                onClick={nextStep}
                className="mt-12 w-20 h-20 rounded-full bg-surface border-2 border-slate-700 flex items-center justify-center text-white hover:border-accent hover:bg-slate-800 transition-all shadow-lg"
            >
                <ChevronRight size={32} strokeWidth={3} />
            </button>
          </motion.div>
        )}

        {/* STEP 1: PHILOSOPHY - REWORKED WITH GSAP TextType */}
        {step === 1 && (
          <motion.div
            key="step1"
            {...({
              variants: variants,
              initial: "enter",
              animate: "center",
              exit: "exit"
            } as any)}
            className="flex flex-col items-center max-w-sm w-full min-h-[400px] justify-center"
          >
            <h2 className="text-3xl text-white font-bold mb-12">
              Le Testeur de Réalité
            </h2>
            
            <div className="min-h-[120px] flex items-center justify-center">
              <TextType 
                text={[
                    "L'anxiété te raconte des histoires...", 
                    "LUCID vérifie les faits.",
                    "Tes peurs sont des illusions.",
                    "La réalité est ton alliée."
                ]}
                typingSpeed={50}
                deletingSpeed={25}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                textColors={['#94a3b8', '#a78bfa', '#cbd5e1', '#34d399']} // slate-400, accent, slate-300, mint
                className="text-2xl md:text-3xl font-bold leading-relaxed"
                cursorClassName="text-accent text-3xl font-light"
              />
            </div>

            <motion.button 
                {...({
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 3 }
                } as any)}
                onClick={nextStep}
                className="mt-16 px-8 py-4 rounded-2xl bg-surface border border-slate-700 text-white font-bold text-lg hover:bg-slate-800 hover:border-white/20 transition-all w-full"
            >
                Compris
            </motion.button>
          </motion.div>
        )}

        {/* STEP 2: NAME INPUT */}
        {step === 2 && (
          <motion.div
            key="step2"
            {...({
              variants: variants,
              initial: "enter",
              animate: "center",
              exit: "exit"
            } as any)}
            className="flex flex-col items-center w-full max-w-sm"
          >
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-8 -rotate-3">
                <User size={32} className="text-slate-300" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl text-white font-bold mb-8">Comment t'appelles-tu ?</h2>
            
            <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ton prénom..."
                className="w-full bg-transparent border-b-2 border-slate-700 text-center text-3xl font-bold text-white pb-4 mb-12 focus:border-accent outline-none placeholder-slate-700 transition-colors"
            />
            
            <button 
                onClick={nextStep}
                disabled={!name.trim()}
                className={`px-8 py-4 rounded-2xl font-bold text-lg w-full transition-all ${
                    name.trim() 
                    ? 'bg-accent text-midnight hover:bg-white shadow-lg shadow-accent/20' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
            >
                Continuer
            </button>
          </motion.div>
        )}

        {/* STEP 3: NOTIFICATIONS */}
        {step === 3 && (
          <motion.div
            key="step3"
            {...({
              variants: variants,
              initial: "enter",
              animate: "center",
              exit: "exit"
            } as any)}
            className="flex flex-col items-center max-w-sm"
          >
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
                <Bell size={64} className="text-accent relative z-10" strokeWidth={2} />
            </div>
            
            <h2 className="text-3xl text-white font-bold mb-4">Le moment de vérité</h2>
            <p className="text-slate-300 text-lg font-medium leading-relaxed mb-10">
                Pour que ça marche, LUCID doit pouvoir te dire quand une angoisse est passée.
                <br/><br/>
                <span className="text-sm text-slate-500 font-normal">C'est la seule façon de construire ta preuve.</span>
            </p>
            
            <button 
                onClick={requestNotifications}
                className="w-full py-4 rounded-2xl bg-accent text-midnight font-extrabold text-lg tracking-wide hover:bg-white transition-all mb-4 shadow-lg shadow-accent/20"
            >
                Activer les notifs
            </button>
            <button 
                onClick={() => onComplete(name)}
                className="text-slate-500 text-sm font-medium hover:text-slate-300 py-2"
            >
                Plus tard
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="absolute bottom-10 flex gap-3">
        {[0, 1, 2, 3].map((i) => (
            <div 
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                    i === step ? 'w-8 bg-accent' : 'w-2 bg-slate-800'
                }`}
            />
        ))}
      </div>
    </div>
  );
};

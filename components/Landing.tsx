
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BrainCircuit, Sparkles, ArrowRight, Fingerprint } from 'lucide-react';

interface LandingProps {
  onEnter: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    },
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-midnight overflow-hidden flex flex-col items-center justify-center relative z-50"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent rounded-full blur-[120px] opacity-10"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-900 rounded-full blur-[150px] opacity-10"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl w-full px-6 md:px-12 flex flex-col items-center text-center">
        
        {/* Logo Icon */}
        <motion.div variants={itemVariants} className="mb-8 md:mb-12">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-surface border border-slate-800 flex items-center justify-center shadow-[0_0_60px_-15px_rgba(167,139,250,0.3)]">
            <BrainCircuit size={40} className="text-accent" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tighter mb-6 leading-[0.9]"
        >
          Domptez <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-400">
            l'incertitude.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-2xl text-slate-400 font-light max-w-2xl leading-relaxed mb-12 md:mb-16"
        >
          LUCID transforme vos angoisses en statistiques. <br className="hidden md:block"/>
          La preuve mathématique que tout ira bien.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="mb-20 md:mb-24">
          <button 
            onClick={onEnter}
            className="group relative px-8 py-4 md:px-10 md:py-5 bg-white text-midnight rounded-full font-bold text-lg md:text-xl tracking-wide shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(167,139,250,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            Entrer dans la Lucidité
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Pillars / Features */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 w-full max-w-4xl border-t border-slate-800/50 pt-12"
        >
          {/* Feature 1 */}
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-slate-900 text-emerald-400 mb-1">
              <Sparkles size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-white font-medium text-lg">Thérapie Cognitive</h3>
            <p className="text-slate-500 text-sm">Basé sur la confrontation au réel.</p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-slate-900 text-accent mb-1">
              <Fingerprint size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-white font-medium text-lg">100% Privé</h3>
            <p className="text-slate-500 text-sm">Données locales. Zéro cloud.</p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-slate-900 text-indigo-400 mb-1">
              <ShieldCheck size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-white font-medium text-lg">Sans Bruit</h3>
            <p className="text-slate-500 text-sm">Design silencieux et apaisant.</p>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

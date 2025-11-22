
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { BrainCircuit, ArrowRight, Lock, Hourglass, CheckCircle2, ChevronDown, Quote } from 'lucide-react';

interface LandingProps {
  onEnter: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="fixed inset-0 bg-midnight z-50 overflow-y-auto overflow-x-hidden selection:bg-accent selection:text-midnight">
      
      {/* Fixed Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[150px]" />
      </div>

      {/* --- SECTION 1: HERO --- */}
      <section className="min-h-[100dvh] flex flex-col items-center justify-center relative px-6 py-12 text-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
          className="max-w-4xl mx-auto relative z-10 flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="mb-12">
            <div className="w-24 h-24 rounded-3xl bg-surface/50 backdrop-blur-md border border-slate-800 flex items-center justify-center shadow-[0_0_60px_-15px_rgba(167,139,250,0.3)] mx-auto">
              <BrainCircuit size={40} className="text-accent" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.h1 
            variants={fadeIn}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tighter mb-8 leading-[0.95]"
          >
            Domptez <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-300">
              l'incertitude.
            </span>
          </motion.h1>

          <motion.p 
            variants={fadeIn}
            className="text-lg md:text-2xl text-slate-400 font-light max-w-2xl leading-relaxed mb-12"
          >
            LUCID transforme vos angoisses en statistiques. <br className="hidden md:block"/>
            La preuve mathématique que tout ira bien.
          </motion.p>

          <motion.button 
            variants={fadeIn}
            onClick={onEnter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-white text-midnight rounded-full font-bold text-xl tracking-wide shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(167,139,250,0.6)] transition-all duration-300 flex items-center gap-3"
          >
            Commencer l'expérience
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.div 
            variants={fadeIn}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 2 }}
            className="absolute bottom-[-15vh] md:bottom-[-20vh] opacity-50"
          >
            <ChevronDown size={32} className="text-slate-500" />
          </motion.div>
        </motion.div>
      </section>


      {/* --- SECTION 2: PHILOSOPHY --- */}
      <section className="py-32 px-6 bg-surface/30 relative z-10 border-y border-slate-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Quote size={48} className="text-accent/30 mx-auto mb-8" />
            <blockquote className="text-3xl md:text-5xl font-serif text-slate-200 leading-snug italic mb-8">
              "Nous souffrons plus souvent en imagination qu'en réalité."
            </blockquote>
            <cite className="text-accent uppercase tracking-widest font-bold not-italic">
              — Sénèque
            </cite>
          </motion.div>
        </div>
      </section>


      {/* --- SECTION 3: METHOD (Workflow) --- */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-bold text-accent uppercase tracking-[0.3em] mb-4">La Méthode</h2>
            <h3 className="text-3xl md:text-5xl text-white font-bold">Comment ça marche ?</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 group-hover:border-accent/50 transition-colors">
                <Lock size={32} className="text-slate-300 group-hover:text-accent transition-colors" />
              </div>
              <h4 className="text-xl text-white font-bold mb-3">1. Capturer</h4>
              <p className="text-slate-400 leading-relaxed">
                Déposez votre angoisse dans le coffre-fort numérique. Formulez-la, puis verrouillez-la pour vous en libérer mentalement.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 group-hover:border-accent/50 transition-colors">
                <Hourglass size={32} className="text-slate-300 group-hover:text-accent transition-colors" />
              </div>
              <h4 className="text-xl text-white font-bold mb-3">2. Vivre</h4>
              <p className="text-slate-400 leading-relaxed">
                Continuez votre vie. L'application garde la pensée pour vous jusqu'à la date de vérification choisie.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 group-hover:border-emerald-500/50 transition-colors">
                <CheckCircle2 size={32} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h4 className="text-xl text-white font-bold mb-3">3. Vérifier</h4>
              <p className="text-slate-400 leading-relaxed">
                Le jour J, revenez. L'angoisse s'est-elle réalisée ? Dans 92% des cas, la réponse est non. Votre lucidité augmente.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
           <button 
            onClick={onEnter}
            className="px-12 py-6 bg-accent hover:bg-white text-midnight rounded-2xl font-bold text-xl transition-all duration-300 shadow-[0_0_50px_-10px_rgba(167,139,250,0.4)] hover:shadow-[0_0_80px_-10px_rgba(167,139,250,0.6)] hover:-translate-y-1"
          >
            Je reprends le contrôle
          </button>
        </motion.div>
      </section>


      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-900 relative z-10 bg-midnight">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-2">
            <BrainCircuit size={16} />
            <span className="font-bold tracking-widest uppercase text-xs">LUCID App</span>
          </div>
          
          <p className="text-xs font-medium tracking-wide text-slate-500">
            Fait par zay168 2025
          </p>
        </div>
      </footer>

    </div>
  );
};

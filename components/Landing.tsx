
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, ArrowRight, Lock, Hourglass, CheckCircle2, ChevronDown, Quote, 
  Github, Shield, Zap, Moon, Code2, ExternalLink
} from 'lucide-react';

// Fix for missing Variants export
type Variants = any;

interface LandingProps {
  onEnter: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-midnight z-50 overflow-y-auto overflow-x-hidden selection:bg-accent selection:text-midnight scroll-smooth">
      
      {/* Fixed Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          {...({
            animate: { 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1], 
              rotate: [0, 45, 0]
            },
            transition: { duration: 20, repeat: Infinity, ease: "linear" }
          } as any)}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-accent/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          {...({
            animate: { 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
              x: [0, -50, 0]
            },
            transition: { duration: 15, repeat: Infinity, ease: "easeInOut" }
          } as any)}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[150px]" 
        />
      </div>

      {/* --- SECTION 1: HERO --- */}
      <section className="min-h-[100dvh] flex flex-col items-center justify-center relative px-6 py-12 text-center z-10">
        <motion.div 
          {...({
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            transition: { staggerChildren: 0.2 }
          } as any)}
          className="max-w-5xl mx-auto relative flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="mb-12 relative">
            <div className="absolute inset-0 bg-accent/30 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 rounded-3xl bg-surface/50 backdrop-blur-md border border-slate-700/50 flex items-center justify-center shadow-[0_0_60px_-15px_rgba(167,139,250,0.5)] mx-auto">
              <BrainCircuit size={40} className="text-accent" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.h1 
            variants={fadeIn}
            className="text-5xl md:text-7xl lg:text-9xl font-extrabold text-white tracking-tighter mb-8 leading-[0.9]"
          >
            Domptez <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-indigo-300 to-white">
              l'incertitude.
            </span>
          </motion.h1>

          <motion.p 
            variants={fadeIn}
            className="text-lg md:text-2xl text-slate-400 font-light max-w-2xl leading-relaxed mb-12"
          >
            LUCID transforme vos angoisses en statistiques. <br className="hidden md:block"/>
            Une approche stoïcienne assistée par la technologie.
          </motion.p>

          <motion.button 
            {...({
              variants: fadeIn,
              onClick: onEnter,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 }
            } as any)}
            className="px-10 py-5 bg-white text-midnight rounded-full font-bold text-xl tracking-wide shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(167,139,250,0.8)] transition-all duration-300 flex items-center gap-3 group"
          >
            Commencer l'expérience
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.div 
            {...({
              variants: fadeIn,
              animate: { y: [0, 10, 0] },
              transition: { duration: 2, repeat: Infinity, delay: 2 }
            } as any)}
            className="absolute bottom-[-15vh] md:bottom-[-20vh] opacity-50 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <ChevronDown size={32} className="text-slate-500" />
          </motion.div>
        </motion.div>
      </section>


      {/* --- SECTION 2: PHILOSOPHY --- */}
      <section className="py-32 px-6 bg-surface/30 relative z-10 border-y border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            {...({
              initial: { opacity: 0, scale: 0.9 },
              whileInView: { opacity: 1, scale: 1 },
              viewport: { once: true },
              transition: { duration: 0.8 }
            } as any)}
          >
            <Quote size={48} className="text-accent/30 mx-auto mb-8" />
            <blockquote className="text-3xl md:text-5xl font-serif text-slate-200 leading-snug italic mb-8">
              "Nous souffrons plus souvent en imagination qu'en réalité."
            </blockquote>
            <cite className="text-accent uppercase tracking-widest font-bold not-italic flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-accent/50" /> Sénèque <span className="w-8 h-[1px] bg-accent/50" />
            </cite>
          </motion.div>
        </div>
      </section>


      {/* --- SECTION 3: SCIENCE & FEATURES --- */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            {...({
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true }
            } as any)}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-bold text-accent uppercase tracking-[0.3em] mb-4">La Logique</h2>
            <h3 className="text-3xl md:text-5xl text-white font-bold">Pourquoi ça marche ?</h3>
          </motion.div>

          <motion.div 
            {...({
              variants: staggerContainer,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true }
            } as any)}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={fadeIn} className="bg-surface/50 border border-slate-800 p-8 rounded-3xl hover:bg-surface hover:border-accent/30 transition-colors duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-indigo-400" size={28} />
              </div>
              <h4 className="text-xl text-white font-bold mb-3">Thérapie Cognitive</h4>
              <p className="text-slate-400 leading-relaxed text-sm">
                Basé sur la restructuration cognitive. En confrontant vos prédictions à la réalité, vous rééduquez votre cerveau à moins paniquer.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeIn} className="bg-surface/50 border border-slate-800 p-8 rounded-3xl hover:bg-surface hover:border-accent/30 transition-colors duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="text-emerald-400" size={28} />
              </div>
              <h4 className="text-xl text-white font-bold mb-3">Totalement Privé</h4>
              <p className="text-slate-400 leading-relaxed text-sm">
                Pas de cloud, pas de compte, pas de tracking. Vos pensées les plus intimes restent cryptées dans votre appareil.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeIn} className="bg-surface/50 border border-slate-800 p-8 rounded-3xl hover:bg-surface hover:border-accent/30 transition-colors duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Moon className="text-purple-400" size={28} />
              </div>
              <h4 className="text-xl text-white font-bold mb-3">Midnight Mode</h4>
              <p className="text-slate-400 leading-relaxed text-sm">
                Une interface ultra-sombre conçue pour ne pas agresser les yeux lors des insomnies anxieuses de 3h du matin.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* --- SECTION 4: METHOD (Workflow) --- */}
      <section className="py-24 px-6 relative z-10 bg-gradient-to-b from-transparent to-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <motion.div 
              {...({
                initial: { opacity: 0, y: 30 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { delay: 0.1 }
              } as any)}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 group-hover:border-accent/50 transition-colors relative">
                <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Lock size={32} className="text-slate-300 group-hover:text-accent transition-colors relative z-10" />
              </div>
              <h4 className="text-xl text-white font-bold mb-3">1. Capturer</h4>
              <p className="text-slate-400 leading-relaxed text-sm">
                Verrouillez l'angoisse.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              {...({
                initial: { opacity: 0, y: 30 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { delay: 0.3 }
              } as any)}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 group-hover:border-accent/50 transition-colors relative">
                 <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Hourglass size={32} className="text-slate-300 group-hover:text-accent transition-colors relative z-10" />
              </div>
              <h4 className="text-xl text-white font-bold mb-3">2. Vivre</h4>
              <p className="text-slate-400 leading-relaxed text-sm">
                Laissez le temps faire son œuvre.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              {...({
                initial: { opacity: 0, y: 30 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { delay: 0.5 }
              } as any)}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 group-hover:border-emerald-500/50 transition-colors relative">
                 <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <CheckCircle2 size={32} className="text-slate-300 group-hover:text-emerald-400 transition-colors relative z-10" />
              </div>
              <h4 className="text-xl text-white font-bold mb-3">3. Vérifier</h4>
              <p className="text-slate-400 leading-relaxed text-sm">
                Constatez que rien n'est arrivé.
              </p>
            </motion.div>
          </div>
        </div>
      </section>


      {/* --- SECTION 5: CREATOR SPOTLIGHT --- */}
      <section className="py-32 px-6 relative z-10">
        <motion.div 
          {...({
            initial: { opacity: 0, scale: 0.95 },
            whileInView: { opacity: 1, scale: 1 },
            viewport: { once: true }
          } as any)}
          className="max-w-3xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-slate-900 to-midnight border border-slate-800 p-12 rounded-[3rem] overflow-hidden shadow-2xl text-center group">
            {/* Glow effect behind */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <Github size={40} className="text-midnight" />
                </div>
                
                <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-2">Développé par</h3>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">zay168</h2>
                
                <p className="text-slate-400 max-w-lg mx-auto mb-10 text-lg font-light">
                    Créateur passionné d'expériences numériques minimalistes et utiles.
                </p>

                <motion.a
                    href="https://github.com/zay168"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...({
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 }
                    } as any)}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-white hover:text-midnight text-white border border-slate-700 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg group-hover:shadow-accent/20"
                >
                    <Code2 size={20} />
                    <span>Voir le profil GitHub</span>
                    <ExternalLink size={16} className="opacity-50" />
                </motion.a>
            </div>
          </div>
        </motion.div>
      </section>


      {/* --- FINAL CTA --- */}
      <section className="pb-32 pt-12 px-6 relative z-10 text-center">
        <motion.div
          {...({
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true }
          } as any)}
        >
            <p className="text-slate-500 mb-8 text-lg">Prêt à alléger votre esprit ?</p>
           <button 
            onClick={onEnter}
            className="px-16 py-6 bg-accent hover:bg-white text-midnight rounded-2xl font-bold text-xl transition-all duration-300 shadow-[0_0_50px_-10px_rgba(167,139,250,0.4)] hover:shadow-[0_0_80px_-10px_rgba(167,139,250,0.6)] hover:-translate-y-1 ring-4 ring-accent/20"
          >
            Entrer dans LUCID
          </button>
        </motion.div>
      </section>


      {/* --- FOOTER --- */}
      <footer className="py-8 border-t border-slate-900 relative z-10 bg-midnight/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <BrainCircuit size={16} />
            <span className="font-bold tracking-widest uppercase text-xs">LUCID App v1.0</span>
          </div>
          
          <a 
            href="https://github.com/zay168" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-medium tracking-wide text-slate-500 hover:text-accent transition-colors flex items-center gap-1"
          >
            <span>Code & Design par</span>
            <span className="text-slate-300 font-bold">@zay168</span>
          </a>
        </div>
      </footer>

    </div>
  );
};

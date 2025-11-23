
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
          <motion.div variants={fadeIn} className="mb-8 md:mb-12 relative">
            <div className="absolute inset-0 bg-accent/30 blur-3xl rounded-full" />
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-surface/50 backdrop-blur-md border border-slate-700/50 flex items-center justify-center shadow-[0_0_60px_-15px_rgba(167,139,250,0.5)] mx-auto">
              <BrainCircuit size={32} className="text-accent md:w-10 md:h-10" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.h1 
            variants={fadeIn}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-extrabold text-white tracking-tighter mb-6 md:mb-8 leading-[0.95] md:leading-[0.9]"
          >
            Domptez <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-indigo-300 to-white">
              l'incertitude.
            </span>
          </motion.h1>

          <motion.p 
            variants={fadeIn}
            className="text-base md:text-2xl text-slate-400 font-light max-w-2xl leading-relaxed mb-8 md:mb-12 px-4"
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
            className="px-8 py-4 md:px-10 md:py-5 bg-white text-midnight rounded-full font-bold text-lg md:text-xl tracking-wide shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(167,139,250,0.8)] transition-all duration-300 flex items-center gap-3 group"
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
            className="absolute bottom-[-10vh] md:bottom-[-20vh] opacity-50 cursor-pointer hidden sm:block"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <ChevronDown size={32} className="text-slate-500" />
          </motion.div>
        </motion.div>
      </section>


      {/* --- SECTION 2: PHILOSOPHY (Grain Applied Here) --- */}
      <section className="py-20 md:py-32 px-6 bg-surface/30 relative z-10 border-y border-slate-800/50 backdrop-blur-sm overflow-hidden">
        {/* Cinematic Noise specifically for this section */}
        <div className="cinematic-noise" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Quote size={32} className="text-accent/30 mx-auto mb-6 md:mb-8 rotate-180 md:w-12 md:h-12" />
          <motion.blockquote 
            {...({
              initial: { opacity: 0, scale: 0.95 },
              whileInView: { opacity: 1, scale: 1 },
              transition: { duration: 1 }
            } as any)}
            className="text-2xl md:text-5xl font-serif italic text-slate-200 leading-tight mb-6 md:mb-8"
          >
            "Nous souffrons plus souvent en imagination qu'en réalité."
          </motion.blockquote>
          <cite className="text-accent text-sm md:text-lg font-bold tracking-widest uppercase not-italic">— Sénèque</cite>
        </div>
      </section>


      {/* --- SECTION 3: METHOD --- */}
      <section className="py-20 md:py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Le Protocole LUCID</h2>
            <p className="text-sm md:text-base text-slate-400">Comment déconstruire l'anxiété en 3 étapes.</p>
          </div>

          <motion.div 
            {...({
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true, margin: "-50px" },
              variants: staggerContainer
            } as any)}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12"
          >
            {[
              { 
                icon: Lock, 
                title: "1. Verrouiller", 
                desc: "Écrivez votre peur. Définissez une date de vérification. Enfermez-la dans le coffre pour libérer votre esprit." 
              },
              { 
                icon: Hourglass, 
                title: "2. Patienter", 
                desc: "Vivez votre vie. Laissez le temps faire son œuvre. L'application garde la trace pour vous." 
              },
              { 
                icon: CheckCircle2, 
                title: "3. Vérifier", 
                desc: "Le jour J, confrontez la peur à la réalité. A-t-elle eu lieu ? Le plus souvent, la réponse est non." 
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={fadeIn}
                className="bg-surface/40 border border-slate-800 p-6 md:p-8 rounded-3xl hover:bg-surface/60 transition-colors group"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-800">
                  <item.icon size={24} className="text-slate-300 group-hover:text-accent transition-colors md:w-8 md:h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">{item.title}</h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 4: SCIENCE & PRIVACY --- */}
      <section className="py-20 md:py-32 px-6 relative z-10 border-t border-slate-800/30">
        <div className="max-w-6xl mx-auto">
           <motion.div 
             {...({
               initial: "hidden",
               whileInView: "visible",
               viewport: { once: true },
               variants: staggerContainer
             } as any)}
             className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
           >
              {/* Card 1: CBT */}
              <motion.div variants={fadeIn} className="col-span-1 md:col-span-2 bg-gradient-to-br from-surface to-slate-900 border border-slate-800 p-6 md:p-10 rounded-3xl relative overflow-hidden">
                  <div className="relative z-10">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 md:mb-6">
                          <BrainCircuit className="text-accent w-6 h-6 md:w-auto md:h-auto" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Basé sur la TCC</h3>
                      <p className="text-sm md:text-base text-slate-400 max-w-lg leading-relaxed">
                          La Thérapie Cognitive et Comportementale (TCC) est la méthode la plus validée scientifiquement pour traiter l'anxiété. LUCID applique le principe de "restructuration cognitive" en vous forçant à tester vos hypothèses négatives.
                      </p>
                  </div>
                  <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-1/4 translate-y-1/4">
                      <BrainCircuit size={200} className="md:w-[300px] md:h-[300px]" />
                  </div>
              </motion.div>

              {/* Card 2: Privacy */}
              <motion.div variants={fadeIn} className="bg-surface border border-slate-800 p-6 md:p-10 rounded-3xl relative overflow-hidden group hover:border-emerald-900/50 transition-colors">
                  <div className="relative z-10">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-900/20 rounded-xl flex items-center justify-center mb-4 md:mb-6">
                          <Shield className="text-emerald-500 w-6 h-6 md:w-auto md:h-auto" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Local First</h3>
                      <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                          Vos pensées vous appartiennent. Aucune donnée ne quitte votre appareil.
                      </p>
                  </div>
              </motion.div>

              {/* Card 3: Design */}
              <motion.div variants={fadeIn} className="bg-surface border border-slate-800 p-6 md:p-10 rounded-3xl relative overflow-hidden">
                  <div className="relative z-10">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 md:mb-6">
                          <Moon className="text-slate-300 w-6 h-6 md:w-auto md:h-auto" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Mode Sombre</h3>
                      <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                          Conçu pour être utilisé la nuit, quand l'anxiété frappe le plus fort.
                      </p>
                  </div>
              </motion.div>

              {/* Card 4: Speed */}
              <motion.div variants={fadeIn} className="col-span-1 md:col-span-2 bg-surface border border-slate-800 p-6 md:p-10 rounded-3xl relative overflow-hidden">
                   <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 relative z-10">
                        <div className="flex-1">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-900/20 rounded-xl flex items-center justify-center mb-4 md:mb-6">
                                <Zap className="text-yellow-500 w-6 h-6 md:w-auto md:h-auto" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Instantané</h3>
                            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                                Pas de chargement, pas de compte à créer. Lancez l'app, libérez votre esprit en 5 secondes.
                            </p>
                        </div>
                        {/* Stats Section - Re-arranged for mobile */}
                        <div className="flex items-center justify-around md:justify-end gap-4 md:pr-8 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800/50 md:border-none w-full md:w-auto">
                             <div className="text-center md:text-right">
                                 <span className="block text-2xl md:text-4xl font-bold text-white">0.1s</span>
                                 <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider">Latence</span>
                             </div>
                             <div className="h-8 w-px bg-slate-800 md:h-12" />
                             <div className="text-center md:text-right">
                                 <span className="block text-2xl md:text-4xl font-bold text-white">0%</span>
                                 <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider">Tracker</span>
                             </div>
                        </div>
                   </div>
              </motion.div>
           </motion.div>
        </div>
      </section>

      {/* --- SECTION 5: CREATOR SPOTLIGHT --- */}
      <section className="py-20 md:py-32 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
            <motion.div 
                {...({
                  initial: { opacity: 0, y: 50 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.8 }
                } as any)}
                className="relative group"
            >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                
                <div className="relative bg-surface/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-12 text-center overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <Code2 size={32} className="text-white md:w-10 md:h-10" />
                        </div>
                        
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">Conçu par zay168</h2>
                        <p className="text-slate-400 mb-8 text-base md:text-lg">Développeur Créatif & Designer UI</p>
                        
                        <a 
                            href="https://github.com/zay168" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-white text-midnight rounded-xl font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 text-sm md:text-base"
                        >
                            <Github size={18} className="md:w-5 md:h-5" />
                            <span>Suivre sur GitHub</span>
                            <ExternalLink size={14} className="opacity-50 md:w-4 md:h-4" />
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 md:py-12 text-center text-slate-600 text-xs md:text-sm relative z-10 border-t border-slate-900">
        <p className="mb-2">Code & Design par <span className="text-slate-400 font-medium">@zay168</span></p>
        <p>LUCID © Tous droits réservés.</p>
      </footer>

    </div>
  );
};

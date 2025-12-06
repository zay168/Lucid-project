import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause } from 'lucide-react';

interface BreathingExerciseProps {
    onClose: () => void;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose }) => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [cycleCount, setCycleCount] = useState(0);

    // Cycle duration in seconds
    const INHALE_TIME = 4;
    const HOLD_TIME = 4;
    const EXHALE_TIME = 4;

    useEffect(() => {
        let timeout: any;

        if (isActive) {
            const runCycle = () => {
                setPhase('inhale');
                timeout = setTimeout(() => {
                    setPhase('hold');
                    timeout = setTimeout(() => {
                        setPhase('exhale');
                        timeout = setTimeout(() => {
                            setCycleCount(c => c + 1);
                            runCycle(); // Loop
                        }, EXHALE_TIME * 1000);
                    }, HOLD_TIME * 1000);
                }, INHALE_TIME * 1000);
            };

            runCycle();
        } else {
            setPhase('inhale'); // Reset to start state
        }

        return () => clearTimeout(timeout);
    }, [isActive]);

    const getInstruction = () => {
        if (!isActive) return "Prêt ?";
        switch (phase) {
            case 'inhale': return "Inspire...";
            case 'hold': return "Bloque...";
            case 'exhale': return "Expire...";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-midnight/95 backdrop-blur-xl text-[rgb(var(--color-text-main))]">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-4 rounded-full bg-surface border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                <X size={24} />
            </button>

            {/* Main Content */}
            <div className="relative flex flex-col items-center justify-center w-full max-w-md px-6">

                {/* Breathing Circle Container */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-12">

                    {/* Outer Glow/Ring */}
                    <motion.div
                        animate={{
                            scale: isActive && phase === 'inhale' ? 1.5 : isActive && phase === 'exhale' ? 1 : 1.2,
                            opacity: isActive && phase === 'inhale' ? 0.5 : 0.2,
                        }}
                        transition={{ duration: phase === 'inhale' ? INHALE_TIME : phase === 'exhale' ? EXHALE_TIME : 0.5, ease: "easeInOut" }}
                        className="absolute inset-0 bg-accent rounded-full blur-3xl"
                    />

                    {/* Main Circle */}
                    <motion.div
                        animate={{
                            scale: isActive ? (phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1.2) : 1,
                        }}
                        transition={{ duration: phase === 'inhale' ? INHALE_TIME : phase === 'exhale' ? EXHALE_TIME : 0, ease: "easeInOut" }}
                        className="relative z-10 w-full h-full bg-surface border-4 border-accent/30 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(167,139,250,0.2)]"
                    >
                        {/* Inner Text */}
                        <div className="text-center">
                            <motion.div
                                key={getInstruction()}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
                            >
                                {getInstruction()}
                            </motion.div>
                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-slate-500 font-medium uppercase tracking-widest"
                                >
                                    Cycle {cycleCount + 1}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Progress Ring (Optional visual cue) */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none transform scale-110">
                        <circle
                            cx="50%"
                            cy="50%"
                            r="48%"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-slate-200 dark:text-slate-800"
                        />
                        {isActive && (
                            <motion.circle
                                cx="50%"
                                cy="50%"
                                r="48%"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                className="text-accent"
                                initial={{ pathLength: 0 }}
                                animate={{
                                    pathLength: phase === 'inhale' ? 1 : phase === 'exhale' ? 0 : 1
                                }}
                                transition={{
                                    duration: phase === 'inhale' ? INHALE_TIME : phase === 'exhale' ? EXHALE_TIME : 0,
                                    ease: "linear"
                                }}
                            />
                        )}
                    </svg>
                </div>

                {/* Controls */}
                <div className="flex gap-6">
                    <button
                        onClick={() => {
                            setIsActive(!isActive);
                            if (!isActive) setCycleCount(0);
                        }}
                        className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-full font-bold text-lg hover:bg-accent/90 transition-all shadow-lg hover:shadow-accent/25 hover:scale-105 active:scale-95"
                    >
                        {isActive ? (
                            <>
                                <Pause size={20} fill="currentColor" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play size={20} fill="currentColor" />
                                Commencer
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-12 text-center max-w-xs">
                    <p className="text-sm text-slate-500">
                        Respiration carrée (Box Breathing). <br />
                        Idéal pour calmer le système nerveux instantanément.
                    </p>
                </div>

            </div>
        </div>
    );
};

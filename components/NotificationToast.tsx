import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { Worry } from '../types';

interface NotificationToastProps {
    worry: Worry;
    onOpen: () => void;
    onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ worry, onOpen, onClose }) => {
    // Auto-close after some time if ignored? Maybe not, let it persist until handled or closed.

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[90] max-w-sm w-full"
        >
            <div className="relative bg-white/95 dark:bg-midnight/80 backdrop-blur-xl border border-accent/30 dark:border-accent/20 rounded-2xl p-4 shadow-[0_0_30px_rgba(124,58,237,0.15)] dark:shadow-[0_0_30px_rgba(124,58,237,0.2)] overflow-hidden group cursor-pointer"
                onClick={onOpen}>

                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent skew-x-12" />

                <div className="relative flex items-start gap-4">
                    <div className="p-3 bg-accent/20 rounded-xl text-accent animate-pulse">
                        <Sparkles size={24} />
                    </div>

                    <div className="flex-1">
                        <h4 className="text-slate-900 dark:text-white font-medium mb-1">Le moment de vérité</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-3">
                            Votre prédiction du {new Date(worry.createdAt).toLocaleDateString('fr-FR')} est arrivée à échéance.
                        </p>
                        <button
                            className="text-xs font-bold text-accent uppercase tracking-wider hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Vérifier maintenant &rarr;
                        </button>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};


import React, { useMemo, useRef, useState } from 'react';
import { Worry } from '../types';
import { CheckCircle2, XCircle, Lock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArchiveProps {
  worries: Worry[];
  onDelete: (id: string) => void;
}

// Sub-component for individual item logic (Long Press)
const ArchiveItem: React.FC<{ worry: Worry; onDelete: (id: string) => void; index: number }> = ({ worry, onDelete, index }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [pressProgress, setPressProgress] = useState(0); // 0 to 100
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const LONG_PRESS_DURATION = 12000; // 12 seconds
  const PROGRESS_UPDATE_INTERVAL = 50;

  const startPress = () => {
    setIsPressing(true);
    setPressProgress(0);

    // Start progress visual
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / LONG_PRESS_DURATION) * 100, 100);
        setPressProgress(progress);
    }, PROGRESS_UPDATE_INTERVAL);

    // Schedule deletion
    timerRef.current = setTimeout(() => {
        onDelete(worry.id);
        // Reset (in case component doesn't unmount immediately)
        cancelPress(); 
        // Vibrate if supported
        if (navigator.vibrate) navigator.vibrate(200);
    }, LONG_PRESS_DURATION);
  };

  const cancelPress = () => {
    setIsPressing(false);
    setPressProgress(0);
    if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
    }
    if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
    }
  };

  const isPositive = worry.status === 'did_not_happen';
  const isPending = worry.status === 'pending';

  return (
    <motion.li 
      {...({
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: index * 0.05 }
      } as any)}
      // Pointer events for long press
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onContextMenu={(e) => e.preventDefault()} // Prevent context menu on mobile
      className={`relative p-4 rounded-xl border transition-all select-none overflow-hidden touch-none ${
        isPending 
          ? 'bg-surface border-slate-800 opacity-100'
          : isPositive
            ? 'bg-surface/50 border-slate-900 opacity-50 hover:opacity-80'
            : 'bg-surface/50 border-red-900/20 opacity-80'
      } ${isPressing ? 'scale-[0.98]' : 'scale-100'}`}
    >
        {/* Progress Bar Background for Deletion */}
        <AnimatePresence>
            {isPressing && (
                <motion.div 
                    {...({
                        initial: { width: '0%' },
                        animate: { width: `${pressProgress}%` },
                        transition: { ease: "linear", duration: 0 }
                    } as any)}
                    className="absolute bottom-0 left-0 h-1 bg-red-600 z-10"
                    style={{ opacity: pressProgress > 0 ? 1 : 0 }}
                />
            )}
        </AnimatePresence>
        
        {/* Deletion Warning Overlay (subtle) */}
        {isPressing && pressProgress > 20 && (
            <div className="absolute inset-0 bg-red-900/10 z-0 flex items-center justify-end px-4">
                <Trash2 className="text-red-500/50" size={20} />
            </div>
        )}

      <div className="flex items-start gap-3 relative z-10">
        <div className="mt-1">
          {isPending && <div className="w-5 h-5 rounded-full border-2 border-slate-700 border-t-accent animate-spin" />}
          {!isPending && isPositive && <CheckCircle2 size={20} className="text-emerald-500/70" />}
          {!isPending && !isPositive && <XCircle size={20} className="text-red-500/70" />}
        </div>
        <div className="flex-1">
          <p className={`text-base leading-snug ${isPositive ? 'line-through text-slate-500' : 'text-slate-300'}`}>
            {worry.text}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-600">
              {new Date(worry.createdAt).toLocaleDateString('fr-FR')}
            </span>
            <span className={`text-[10px] uppercase tracking-wider font-bold ${
              isPending ? 'text-accent' : isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {isPending ? 'En cours' : isPositive ? 'Évitée' : 'Réalisée'}
            </span>
          </div>
        </div>
      </div>
    </motion.li>
  );
};

export const Archive: React.FC<ArchiveProps> = ({ worries, onDelete }) => {
  // Sort by creation date descending
  const sortedWorries = [...worries].sort((a, b) => b.createdAt - a.createdAt);

  const stats = useMemo(() => {
    const resolved = worries.filter(w => w.status !== 'pending');
    return {
      total: resolved.length,
      avoided: resolved.filter(w => w.status === 'did_not_happen').length,
      happened: resolved.filter(w => w.status === 'happened').length
    };
  }, [worries]);

  return (
    <div className="h-full overflow-y-auto pb-24 px-6 pt-6">
      {/* Container centré pour desktop */}
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-xl font-light text-white mb-6 tracking-wide">
          Archives
        </h2>

        {/* Statistics Summary */}
        {stats.total > 0 && (
          <motion.div 
            {...({
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 }
            } as any)}
            className="grid grid-cols-3 gap-2 mb-8"
          >
            <div className="bg-surface/50 border border-slate-800/50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white tabular-nums">{stats.total}</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-1 font-medium">Total</span>
            </div>
            
            <div className="bg-emerald-900/10 border border-emerald-500/10 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-emerald-400 tabular-nums">{stats.avoided}</span>
              <span className="text-[9px] text-emerald-600/70 uppercase tracking-widest mt-1 font-medium">Évitées</span>
            </div>

            <div className="bg-surface/50 border border-slate-800/50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-red-400/80 tabular-nums">{stats.happened}</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-1 font-medium">Réalisées</span>
            </div>
          </motion.div>
        )}

        {sortedWorries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-600">
            <Lock size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Aucune archive pour le moment.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {sortedWorries.map((worry, index) => (
              <ArchiveItem key={worry.id} worry={worry} onDelete={onDelete} index={index} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

import React, { useMemo, useRef, useState, memo, useCallback } from 'react';
import { Worry, Category } from '../types';
import { CheckCircle2, XCircle, Lock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES: { id: Category | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'Tout', color: 'bg-slate-700' },
  { id: 'work', label: 'Travail', color: 'bg-blue-500' },
  { id: 'health', label: 'Santé', color: 'bg-emerald-500' },
  { id: 'social', label: 'Social', color: 'bg-purple-500' },
  { id: 'finance', label: 'Finance', color: 'bg-amber-500' },
  { id: 'other', label: 'Autre', color: 'bg-slate-500' },
];

interface ArchiveProps {
  worries: Worry[];
  onDelete: (id: string) => void;
  onVerify: (worry: Worry) => void;
}

interface ArchiveItemProps {
  worry: Worry;
  onDelete: (id: string) => void;
  onVerify: (worry: Worry) => void;
  index: number;
}

// ✨ MEMOIZED - Sub-component for individual item logic (Long Press)
const ArchiveItem = memo<ArchiveItemProps>(({ worry, onDelete, onVerify, index }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const LONG_PRESS_DURATION = 12000;
  const PROGRESS_UPDATE_INTERVAL = 50;

  const startPress = useCallback(() => {
    setIsPressing(true);
    setPressProgress(0);

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / LONG_PRESS_DURATION) * 100, 100);
      setPressProgress(progress);
    }, PROGRESS_UPDATE_INTERVAL);

    timerRef.current = setTimeout(() => {
      onDelete(worry.id);
      cancelPress();
      if (navigator.vibrate) navigator.vibrate(200);
    }, LONG_PRESS_DURATION);
  }, [onDelete, worry.id]);

  const cancelPress = useCallback(() => {
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
  }, []);

  const isPositive = worry.status === 'did_not_happen';
  const isPending = worry.status === 'pending';
  const isOverdue = isPending && worry.checkDate <= Date.now();

  const handleVerify = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onVerify(worry);
  }, [onVerify, worry]);

  return (
    <motion.li
      {...({
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: Math.min(index * 0.05, 0.3) } // Cap delay for long lists
      } as any)}
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative p-4 rounded-xl border transition-all select-none overflow-hidden touch-none ${isPending
        ? 'bg-surface border-slate-800 opacity-100'
        : isPositive
          ? 'bg-surface/50 border-slate-900 opacity-50 hover:opacity-80'
          : 'bg-surface/50 border-red-900/20 opacity-80'
        } ${isPressing ? 'scale-[0.98]' : 'scale-100'}`}
    >
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
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">
                {new Date(worry.createdAt).toLocaleDateString('fr-FR')}
              </span>
              {worry.category && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {CATEGORIES.find(c => c.id === worry.category)?.label || worry.category}
                </span>
              )}
            </div>

            {isPending ? (
              <button
                onClick={handleVerify}
                className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full transition-colors ${isOverdue
                  ? 'bg-accent text-midnight hover:bg-white animate-pulse'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
              >
                {isOverdue ? 'Vérifier maintenant' : 'En cours'}
              </button>
            ) : (
              <span className={`text-[10px] uppercase tracking-wider font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {isPositive ? 'Évitée' : 'Réalisée'}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return prevProps.worry.id === nextProps.worry.id &&
    prevProps.worry.status === nextProps.worry.status &&
    prevProps.worry.checkDate === nextProps.worry.checkDate &&
    prevProps.index === nextProps.index;
});

ArchiveItem.displayName = 'ArchiveItem';

// ✨ MEMOIZED - Main Archive component
export const Archive = memo<ArchiveProps>(({ worries, onDelete, onVerify }) => {
  const [filter, setFilter] = useState<Category | 'all'>('all');

  // ✨ OPTIMIZED - useMemo for filtered and sorted worries
  const sortedWorries = useMemo(() => {
    return [...worries]
      .filter(w => filter === 'all' || w.category === filter)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [worries, filter]);

  // ✨ OPTIMIZED - useMemo for stats calculation
  const stats = useMemo(() => {
    const resolved = worries.filter(w => w.status !== 'pending');
    return {
      total: resolved.length,
      avoided: resolved.filter(w => w.status === 'did_not_happen').length,
      happened: resolved.filter(w => w.status === 'happened').length
    };
  }, [worries]);

  const handleFilterChange = useCallback((newFilter: Category | 'all') => {
    setFilter(newFilter);
  }, []);

  return (
    <div className="h-full overflow-y-auto pb-24 px-6 pt-6">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-xl font-light text-white mb-6 tracking-wide">
          Archives
        </h2>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleFilterChange(cat.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${filter === cat.id
                ? 'bg-white text-midnight border-white'
                : 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

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
          // ✨ OPTIMIZED - Memoized list
          <ul className="space-y-4">
            {sortedWorries.map((worry, index) => (
              <ArchiveItem
                key={worry.id}
                worry={worry}
                onDelete={onDelete}
                onVerify={onVerify}
                index={index}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

Archive.displayName = 'Archive';

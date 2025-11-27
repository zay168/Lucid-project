import React, { useState } from 'react';
import { X, Lock, Calendar, CalendarClock, AlertTriangle, Brain, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '../types';

interface CaptureProps {
  onClose: () => void;
  onSave: (text: string, checkDate: number, category?: Category, reframing?: { rationalThought?: string; actionPlan?: string }) => void;
}

const CATEGORIES: { id: Category; label: string; color: string }[] = [
  { id: 'work', label: 'Travail', color: 'bg-blue-500' },
  { id: 'health', label: 'Santé', color: 'bg-emerald-500' },
  { id: 'social', label: 'Social', color: 'bg-purple-500' },
  { id: 'finance', label: 'Finance', color: 'bg-amber-500' },
  { id: 'other', label: 'Autre', color: 'bg-slate-500' },
];

export const Capture: React.FC<CaptureProps> = ({ onClose, onSave }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>('other');

  // Reframing State
  const [showReframing, setShowReframing] = useState(false);
  const [rationalThought, setRationalThought] = useState('');
  const [actionPlan, setActionPlan] = useState('');

  // State for date selection
  const [selectionMode, setSelectionMode] = useState<'preset' | 'custom'>('preset');
  const [daysOffset, setDaysOffset] = useState<number>(1);
  const [customDate, setCustomDate] = useState<string>('');

  const [isLocking, setIsLocking] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleCloseRequest = () => {
    if (text.trim().length > 0) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    if (!text.trim()) return;

    let targetTimestamp: number;

    if (selectionMode === 'preset') {
      const date = new Date();
      date.setDate(date.getDate() + daysOffset);
      targetTimestamp = date.getTime();
    } else {
      if (!customDate) return;
      targetTimestamp = new Date(customDate).getTime();
    }

    setIsLocking(true);

    // Duration of the full animation sequence (crumple + safe close + lock)
    // 2.5s total before closing modal
    setTimeout(() => {
      onSave(
        text,
        targetTimestamp,
        category,
        showReframing ? { rationalThought, actionPlan } : undefined
      );
    }, 3200);
  };

  const dateOptions = [
    { label: 'Demain', value: 1 },
    { label: '3 Jours', value: 3 },
    { label: '1 Semaine', value: 7 },
    { label: '1 Mois', value: 30 },
  ];

  // Calculate min date for custom picker (now)
  const getMinDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const isSaveDisabled = !text.trim() || (selectionMode === 'custom' && !customDate);

  return (
    <div className="absolute inset-0 z-50 bg-midnight flex flex-col p-6 overflow-hidden">

      {/* Confirmation Modal Overlay */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="absolute inset-0 z-[60] bg-midnight/90 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div
              {...({
                initial: { scale: 0.9, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.9, opacity: 0 }
              } as any)}
              className="bg-surface border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-white text-lg font-medium mb-2">Abandonner cette pensée ?</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Le texte saisi sera perdu si vous quittez maintenant.
                </p>
                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-200 font-medium hover:bg-slate-700 transition-colors"
                  >
                    Rester
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-red-900/20 text-red-400 font-medium border border-red-900/50 hover:bg-red-900/30 transition-colors"
                  >
                    Quitter
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      {!isLocking && (
        <div className="flex justify-end mb-8 max-w-3xl mx-auto w-full">
          <button onClick={handleCloseRequest} className="p-2 text-slate-500 hover:text-slate-300">
            <X size={24} />
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isLocking ? (
          <motion.div
            key="form"
            {...({
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
            } as any)}
            className="flex-1 flex flex-col max-w-3xl mx-auto w-full"
          >
            <h2 className="text-2xl font-light text-[rgb(var(--color-text-main))] mb-6">
              Quelle est votre inquiétude ?
            </h2>

            {/* Emergency Help Section */}
            <div className="bg-rose-900/10 border border-rose-900/30 rounded-xl p-4 flex items-start gap-3 mb-6">
              <div className="p-2 bg-rose-900/20 rounded-lg shrink-0">
                <HeartHandshake className="text-rose-400" size={18} />
              </div>
              <div className="flex-1">
                <h3 className="text-[rgb(var(--color-text-main))] text-sm font-medium mb-1">Besoin d'aide immédiate ?</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                  LUCID est un outil d'accompagnement, pas un service médical. Si vous êtes en détresse, contactez le 3114.
                </p>
                <a
                  href="tel:3114"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-600/20 text-rose-400 rounded-lg hover:bg-rose-600 hover:text-white transition-all font-bold text-xs border border-rose-600/30"
                >
                  📞 Appeler le 3114
                </a>
              </div>
            </div>

            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="J'ai peur que..."
              className="w-full bg-transparent text-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-700 outline-none resize-none flex-1 leading-relaxed mb-4"
            />

            {/* Categories */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${category === cat.id
                    ? `${cat.color} text-white border-transparent`
                    : 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-500'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Reframing Toggle */}
            <div className="mb-6">
              <button
                onClick={() => setShowReframing(!showReframing)}
                className="flex items-center gap-2 text-sm text-accent hover:text-white transition-colors"
              >
                <Brain size={16} />
                {showReframing ? 'Masquer le recadrage' : 'Ajouter une perspective rationnelle (TCC)'}
              </button>

              <AnimatePresence>
                {showReframing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase font-bold">Pensée Rationnelle</label>
                        <textarea
                          value={rationalThought}
                          onChange={(e) => setRationalThought(e.target.value)}
                          placeholder="Quelle est une façon plus réaliste de voir la situation ?"
                          className="w-full bg-surface/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-accent resize-none h-20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase font-bold">Plan d'Action</label>
                        <textarea
                          value={actionPlan}
                          onChange={(e) => setActionPlan(e.target.value)}
                          placeholder="Que pouvez-vous faire concrètement ?"
                          className="w-full bg-surface/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-accent resize-none h-20"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-auto">
              <div className="flex items-center gap-2 text-slate-500 mb-4">
                <Calendar size={16} />
                <span className="text-sm uppercase tracking-wider">Vérification</span>
              </div>

              {/* Date Selection Options */}
              <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mb-2 items-center">
                {dateOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSelectionMode('preset');
                      setDaysOffset(opt.value);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors border ${selectionMode === 'preset' && daysOffset === opt.value
                      ? 'bg-accent/10 border-accent text-accent'
                      : 'bg-surface border-slate-800 text-slate-400'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}

                {/* Custom Date Button */}
                <button
                  onClick={() => setSelectionMode('custom')}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors border flex items-center gap-2 ${selectionMode === 'custom'
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-surface border-slate-800 text-slate-400'
                    }`}
                >
                  <CalendarClock size={14} />
                  Personnalisé
                </button>
              </div>

              {/* Custom Date Input Panel */}
              <AnimatePresence>
                {selectionMode === 'custom' && (
                  <motion.div
                    {...({
                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: 'auto' },
                      exit: { opacity: 0, height: 0 }
                    } as any)}
                    className="mb-6 overflow-hidden"
                  >
                    <input
                      type="datetime-local"
                      min={getMinDate()}
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full bg-surface border border-slate-200 dark:border-slate-700 text-[rgb(var(--color-text-main))] rounded-xl p-4 outline-none focus:border-accent transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                    />
                    <p className="text-xs text-slate-500 mt-2 ml-1">
                      Choisissez la date et l'heure exactes du verdict.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Spacing if not custom to keep layout stable */}
              {selectionMode !== 'custom' && <div className="mb-6 h-1"></div>}

              <button
                onClick={handleSave}
                disabled={isSaveDisabled}
                className={`w-full py-4 rounded-xl font-medium tracking-wide text-midnight transition-all ${!isSaveDisabled
                  ? 'bg-accent hover:bg-white'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
              >
                Verrouiller cette pensée
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="animation-sequence"
            className="absolute inset-0 flex flex-col items-center justify-center bg-midnight"
          >
            {/* 1. PAPER CRUMPLING ANIMATION */}
            <motion.div
              {...({
                initial: { scale: 1, opacity: 1, borderRadius: "2px" },
                animate: {
                  scale: [1, 0.6, 0.1],
                  rotate: [0, -5, 15, 720],
                  y: [0, 0, 150], // Drops down into the safe
                  opacity: [1, 1, 0] // Fades out as it enters safe
                },
                transition: {
                  duration: 1.2,
                  times: [0, 0.4, 1],
                  ease: "easeInOut"
                }
              } as any)}
              className="absolute z-20 bg-slate-200 text-midnight p-6 w-64 h-80 shadow-xl overflow-hidden"
              style={{ transformOrigin: "center" }}
            >
              <p className="text-xs font-serif leading-relaxed opacity-60 break-words">
                {text}
              </p>
            </motion.div>

            {/* 2. THE SAFE (Coffre-fort) */}
            <motion.div
              {...({
                initial: { opacity: 0, scale: 0.8, y: 100 },
                animate: { opacity: 1, scale: 1, y: 0 },
                transition: { delay: 0.5, duration: 0.5 }
              } as any)}
              className="relative w-48 h-48 bg-surface border-4 border-slate-700 rounded-3xl flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10"
            >
              {/* Safe Interior Details */}
              <div className="absolute inset-2 border border-slate-800/50 rounded-2xl" />

              {/* 3. SAFE DOOR CLOSING */}
              <motion.div
                {...({
                  initial: { x: "100%" },
                  animate: { x: "0%" },
                  transition: { delay: 1.4, duration: 0.4, type: "spring", bounce: 0.1 }
                } as any)}
                className="absolute inset-0 bg-slate-800 border-l-2 border-slate-600 z-30 flex items-center justify-center"
              >
                {/* The Lock on the door */}
                <motion.div
                  {...({
                    initial: { scale: 0, rotate: -45 },
                    animate: { scale: 1, rotate: 0 },
                    transition: { delay: 1.9, type: "spring" }
                  } as any)}
                  className="p-4 bg-slate-900 rounded-full border border-slate-700 shadow-lg text-emerald-500"
                >
                  <Lock size={32} strokeWidth={2.5} />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* 4. FINAL TEXT */}
            <motion.div
              {...({
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 2.2 }
              } as any)}
              className="mt-12 text-center"
            >
              <h3 className="text-xl text-white font-light tracking-widest uppercase mb-2">Sécurisé</h3>
              <p className="text-slate-500 text-sm">L'angoisse est enfermée.<br />Reprenez votre vie.</p>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

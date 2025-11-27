import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { Worry, ViewState, Category } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { debouncedSaveToStorage, loadFromStorage, saveToStorage, flushPendingSaves } from './utils/storage';

// ✨ LAZY LOADING
const Capture = lazy(() => import('./components/Capture').then(module => ({ default: module.Capture })));
const Archive = lazy(() => import('./components/Archive').then(module => ({ default: module.Archive })));
const Settings = lazy(() => import('./components/Settings').then(module => ({ default: module.Settings })));
const Landing = lazy(() => import('./components/Landing').then(module => ({ default: module.Landing })));
const Onboarding = lazy(() => import('./components/Onboarding').then(module => ({ default: module.Onboarding })));
const VerificationOverlay = lazy(() => import('./components/VerificationOverlay').then(module => ({ default: module.VerificationOverlay })));
const Soundscapes = lazy(() => import('./components/Soundscapes').then(module => ({ default: module.Soundscapes })));
const NotificationToast = lazy(() => import('./components/NotificationToast').then(module => ({ default: module.NotificationToast })));

const STORAGE_KEY = 'lucid_worries_v1';
const ONBOARDING_KEY = 'lucid_onboarding_completed';
const NAME_KEY = 'lucid_user_name';
const THEME_KEY = 'lucid_theme';

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full bg-midnight">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm animate-pulse">Chargement...</p>
    </div>
  </div>
);

export default function App() {
  // --- STATE ---
  const [worries, setWorries] = useState<Worry[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [showLanding, setShowLanding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Overlay state
  const [activeOverlayWorry, setActiveOverlayWorry] = useState<Worry | null>(null);
  const [dueNotificationWorry, setDueNotificationWorry] = useState<Worry | null>(null);

  // --- LOAD DATA ---
  useEffect(() => {
    const loadData = () => {
      const loadedWorries = loadFromStorage<Worry[]>(STORAGE_KEY, []);
      const loadedName = loadFromStorage<string>(NAME_KEY, '');
      const onboardingDone = localStorage.getItem(ONBOARDING_KEY) === 'true';
      const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | 'system' | null;

      setWorries(loadedWorries);
      setUserName(loadedName);
      setShowOnboarding(!onboardingDone);
      if (savedTheme) setTheme(savedTheme);
    };

    loadData();

    const handleBeforeUnload = () => {
      flushPendingSaves();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // --- THEME MANAGEMENT ---
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isSystemDark = mediaQuery.matches;
      const shouldBeDark = theme === 'dark' || (theme === 'system' && isSystemDark);

      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    const handleSystemChange = () => {
      if (theme === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  // --- ACTIONS ---
  const handleThemeChange = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  }, []);

  const handleEnterApp = useCallback(() => {
    const onboardingDone = localStorage.getItem(ONBOARDING_KEY);
    setShowLanding(false);
    if (onboardingDone !== 'true') setShowOnboarding(true);
  }, []);

  const handleOnboardingComplete = useCallback((name: string) => {
    saveToStorage(ONBOARDING_KEY, 'true');
    saveToStorage(NAME_KEY, name);
    setUserName(name);
    setShowOnboarding(false);
  }, []);

  const handleUpdateName = useCallback((name: string) => {
    saveToStorage(NAME_KEY, name);
    setUserName(name);
  }, []);

  const handleSaveWorry = useCallback((text: string, checkDate: number, category?: Category, reframing?: any) => {
    const newWorry: Worry = {
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
      checkDate,
      status: 'pending',
      category,
      reframing
    };
    setWorries(prev => {
      const updated = [newWorry, ...prev];
      debouncedSaveToStorage(STORAGE_KEY, updated);
      return updated;
    });
    setView('dashboard');
  }, []);

  const handleResolveWorry = useCallback((id: string, status: 'happened' | 'did_not_happen', reflection?: string) => {
    setWorries(prev => {
      const updated = prev.map(w => w.id === id ? { ...w, status, reflection } : w);
      debouncedSaveToStorage(STORAGE_KEY, updated);
      return updated;
    });
    setActiveOverlayWorry(null);
  }, []);

  const handleDeleteWorry = useCallback((id: string) => {
    setWorries(prev => {
      const updated = prev.filter(w => w.id !== id);
      debouncedSaveToStorage(STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const handleResetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(THEME_KEY);
    setWorries([]);
    setUserName('');
    setTheme('system');
    setShowOnboarding(true);
    setView('dashboard');
  }, []);

  const handleImportData = useCallback((data: Worry[]) => {
    setWorries(data);
    saveToStorage(STORAGE_KEY, data);
  }, []);

  // --- OPTIMIZATIONS ---
  const dueWorries = useMemo(() => {
    if (showLanding || showOnboarding) return [];
    const now = Date.now();
    return worries.filter(w => w.status === 'pending' && w.checkDate && w.checkDate <= now);
  }, [worries, showLanding, showOnboarding]);

  useEffect(() => {
    if (dueWorries.length === 0) return;
    const checkDueWorries = () => {
      if (!activeOverlayWorry && !dueNotificationWorry && view !== 'capture') {
        setDueNotificationWorry(dueWorries[0]);
      }
    };
    checkDueWorries();
    const interval = setInterval(checkDueWorries, 10000);
    return () => clearInterval(interval);
  }, [dueWorries, activeOverlayWorry, dueNotificationWorry, view]);

  const prefersReducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  const pageTransition = useMemo(() => prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {}, transition: {} }
    : {
      initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
      animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    }, [prefersReducedMotion]);

  return (
    <div className="relative w-full min-h-[100dvh] bg-midnight text-[rgb(var(--color-text-main))] overflow-hidden font-sans selection:bg-accent selection:text-midnight">
      <AnimatePresence mode="wait">
        {showLanding && (
          <Suspense fallback={<LoadingFallback />}>
            <motion.div key="landing" className="absolute inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8 } }}>
              <Landing onEnter={handleEnterApp} />
            </motion.div>
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!showLanding && showOnboarding && (
          <Suspense fallback={<LoadingFallback />}>
            <motion.div key="onboarding" className="absolute inset-0 z-40" {...pageTransition}>
              <Onboarding onComplete={handleOnboardingComplete} />
            </motion.div>
          </Suspense>
        )}
      </AnimatePresence>

      {!showLanding && !showOnboarding && (
        <div className="relative w-full h-[100dvh] flex flex-col">
          <Header currentView={view} onChange={setView} />
          <main className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {view === 'dashboard' && (
                <motion.div key="dashboard" className="absolute inset-0 pt-24" {...pageTransition}>
                  <Dashboard worries={worries} onAddPress={() => setView('capture')} onSettingsPress={() => setView('settings')} userName={userName} />
                </motion.div>
              )}
              {view === 'archive' && (
                <Suspense fallback={<LoadingFallback />}>
                  <motion.div key="archive" className="absolute inset-0 pt-24" {...pageTransition}>
                    <Archive worries={worries} onDelete={handleDeleteWorry} onVerify={setActiveOverlayWorry} />
                  </motion.div>
                </Suspense>
              )}
              {view === 'settings' && (
                <Suspense fallback={<LoadingFallback />}>
                  <motion.div key="settings" className="absolute inset-0 pt-24" {...pageTransition}>
                    <Settings
                      currentName={userName}
                      onUpdateName={handleUpdateName}
                      onReset={handleResetAll}
                      worries={worries}
                      onImport={handleImportData}
                      theme={theme}
                      onThemeChange={handleThemeChange}
                    />
                  </motion.div>
                </Suspense>
              )}
              {view === 'capture' && (
                <Suspense fallback={<LoadingFallback />}>
                  <motion.div key="capture" className="absolute inset-0 z-50" initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
                    <Capture onClose={() => setView('dashboard')} onSave={handleSaveWorry} />
                  </motion.div>
                </Suspense>
              )}
            </AnimatePresence>
          </main>

          <AnimatePresence>
            {activeOverlayWorry && (
              <Suspense fallback={null}>
                <VerificationOverlay worry={activeOverlayWorry} onResolve={handleResolveWorry} />
              </Suspense>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {dueNotificationWorry && !activeOverlayWorry && (
              <Suspense fallback={null}>
                <NotificationToast worry={dueNotificationWorry} onOpen={() => { setActiveOverlayWorry(dueNotificationWorry); setDueNotificationWorry(null); }} onClose={() => setDueNotificationWorry(null)} />
              </Suspense>
            )}
          </AnimatePresence>
        </div>
      )}

      <Suspense fallback={null}>
        <Soundscapes />
      </Suspense>
    </div>
  );
}

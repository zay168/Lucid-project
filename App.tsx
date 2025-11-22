
import { useState, useEffect, useCallback } from 'react';
import { Dashboard } from './components/Dashboard';
import { Capture } from './components/Capture';
import { Archive } from './components/Archive';
import { Header } from './components/Header';
import { VerificationOverlay } from './components/VerificationOverlay';
import { Onboarding } from './components/Onboarding';
import { Settings } from './components/Settings';
import { Landing } from './components/Landing';
import { Worry, ViewState } from './types';
import { AnimatePresence, motion } from 'framer-motion';

const STORAGE_KEY = 'lucid_worries_v1';
const ONBOARDING_KEY = 'lucid_onboarding_completed';
const NAME_KEY = 'lucid_user_name';

export default function App() {
  // --- STATE ---
  const [worries, setWorries] = useState<Worry[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [showLanding, setShowLanding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userName, setUserName] = useState<string>('');
  
  // Overlay state
  const [activeOverlayWorry, setActiveOverlayWorry] = useState<Worry | null>(null);

  // --- LOAD DATA ---
  useEffect(() => {
    const loadData = () => {
      // 1. Load Worries
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setWorries(JSON.parse(saved));
        } catch (e) {
          console.error("Corrupt data", e);
        }
      }

      // 2. Load User Profile
      const savedName = localStorage.getItem(NAME_KEY);
      if (savedName) setUserName(savedName);

      // 3. Check Onboarding Status (only if not explicitly showing Landing first)
      const onboardingDone = localStorage.getItem(ONBOARDING_KEY);
      if (onboardingDone === 'true') {
        setShowOnboarding(false);
      }
    };

    loadData();
  }, []);

  // --- CHECK FOR DUE WORRIES ---
  useEffect(() => {
    if (showLanding || showOnboarding) return;

    const checkDueWorries = () => {
      const now = Date.now();
      // Find the first pending worry that is due and hasn't been shown this session?
      // Simple version: Find first due pending worry
      const due = worries.find(w => w.status === 'pending' && w.checkDate <= now);
      
      if (due) {
        // Only show if we aren't already showing one or in capture mode
        if (!activeOverlayWorry && view !== 'capture') {
           setActiveOverlayWorry(due);
        }
      }
    };

    // Check every 10 seconds and on mount/update
    checkDueWorries();
    const interval = setInterval(checkDueWorries, 10000);
    return () => clearInterval(interval);
  }, [worries, showLanding, showOnboarding, view, activeOverlayWorry]);


  // --- ACTIONS ---

  const handleEnterApp = () => {
    const onboardingDone = localStorage.getItem(ONBOARDING_KEY);
    setShowLanding(false);
    
    if (onboardingDone !== 'true') {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = (name: string) => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.setItem(NAME_KEY, name);
    setUserName(name);
    setShowOnboarding(false);
  };

  const handleUpdateName = (name: string) => {
    localStorage.setItem(NAME_KEY, name);
    setUserName(name);
  };

  const handleSaveWorry = (text: string, checkDate: number) => {
    const newWorry: Worry = {
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
      checkDate,
      status: 'pending'
    };

    const updated = [newWorry, ...worries];
    setWorries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setView('dashboard');
  };

  const handleResolveWorry = (id: string, status: 'happened' | 'did_not_happen') => {
    const updated = worries.map(w => 
      w.id === id ? { ...w, status } : w
    );
    setWorries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setActiveOverlayWorry(null);
  };

  const handleDeleteWorry = (id: string) => {
    const updated = worries.filter(w => w.id !== id);
    setWorries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleResetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(NAME_KEY);
    setWorries([]);
    setUserName('');
    setShowOnboarding(true); // Restart onboarding
    setView('dashboard');
  };

  // --- RENDER HELPERS ---

  // Cinematic Transitions
  const pageTransition = {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-midnight text-slate-200 overflow-hidden font-sans selection:bg-accent selection:text-midnight">
      
      {/* Cinematic Grain Overlay */}
      <div className="cinematic-noise" />

      {/* 1. LANDING PAGE */}
      <AnimatePresence mode="wait">
        {showLanding && (
           <motion.div 
             key="landing"
             className="absolute inset-0 z-50"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0, transition: { duration: 0.8 } }}
           >
             <Landing onEnter={handleEnterApp} />
           </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ONBOARDING */}
      <AnimatePresence mode="wait">
        {!showLanding && showOnboarding && (
          <motion.div
            key="onboarding"
            className="absolute inset-0 z-40"
            {...pageTransition}
          >
            <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MAIN APP */}
      {!showLanding && !showOnboarding && (
        <div className="relative w-full h-[100dvh] flex flex-col">
          
          <Header currentView={view} onChange={setView} />

          <main className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              
              {view === 'dashboard' && (
                <motion.div 
                  key="dashboard" 
                  className="absolute inset-0 pt-24" // pt-24 for header space
                  {...pageTransition}
                >
                  <Dashboard 
                    worries={worries} 
                    onAddPress={() => setView('capture')} 
                    onSettingsPress={() => setView('settings')}
                    userName={userName}
                  />
                </motion.div>
              )}

              {view === 'archive' && (
                <motion.div 
                  key="archive" 
                  className="absolute inset-0 pt-24"
                  {...pageTransition}
                >
                  <Archive worries={worries} onDelete={handleDeleteWorry} />
                </motion.div>
              )}

              {view === 'settings' && (
                <motion.div 
                  key="settings" 
                  className="absolute inset-0 pt-24"
                  {...pageTransition}
                >
                  <Settings 
                    currentName={userName} 
                    onUpdateName={handleUpdateName}
                    onReset={handleResetAll}
                  />
                </motion.div>
              )}

              {/* Capture Overlay (Full Screen Modal style) */}
              {view === 'capture' && (
                <motion.div 
                    key="capture"
                    className="absolute inset-0 z-50"
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                >
                    <Capture 
                        onClose={() => setView('dashboard')} 
                        onSave={handleSaveWorry} 
                    />
                </motion.div>
              )}

            </AnimatePresence>
          </main>

          {/* Reality Check Overlay */}
          <AnimatePresence>
            {activeOverlayWorry && (
              <VerificationOverlay 
                worry={activeOverlayWorry} 
                onResolve={handleResolveWorry} 
              />
            )}
          </AnimatePresence>

        </div>
      )}
    </div>
  );
}

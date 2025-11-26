
import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Capture } from './components/Capture';
import { Archive } from './components/Archive';
import { Header } from './components/Header';
import { VerificationOverlay } from './components/VerificationOverlay';
import { Onboarding } from './components/Onboarding';
import { Settings } from './components/Settings';
import { Landing } from './components/Landing';
<<<<<<< HEAD
import { Worry, ViewState } from './types';
import { AnimatePresence, motion } from 'framer-motion';
=======
import { Worry, ViewState, Category } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { Soundscapes } from './components/Soundscapes';
import { NotificationToast } from './components/NotificationToast';
>>>>>>> e4bc5e8 (big maj)

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
<<<<<<< HEAD
  
  // Overlay state
  const [activeOverlayWorry, setActiveOverlayWorry] = useState<Worry | null>(null);
=======

  // Overlay state
  const [activeOverlayWorry, setActiveOverlayWorry] = useState<Worry | null>(null);
  const [dueNotificationWorry, setDueNotificationWorry] = useState<Worry | null>(null);
>>>>>>> e4bc5e8 (big maj)

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
<<<<<<< HEAD
      const due = worries.find(w => w.status === 'pending' && w.checkDate <= now);
      
      if (due) {
        // Only show if we aren't already showing one or in capture mode
        if (!activeOverlayWorry && view !== 'capture') {
           setActiveOverlayWorry(due);
=======
      const due = worries.find(w => w.status === 'pending' && w.checkDate && !isNaN(Number(w.checkDate)) && w.checkDate <= now);

      if (due) {
        // Only show if we aren't already showing one or in capture mode
        if (!activeOverlayWorry && !dueNotificationWorry && view !== 'capture') {
          setDueNotificationWorry(due);
>>>>>>> e4bc5e8 (big maj)
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
<<<<<<< HEAD
    
=======

>>>>>>> e4bc5e8 (big maj)
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

<<<<<<< HEAD
  const handleSaveWorry = (text: string, checkDate: number) => {
=======
  const handleSaveWorry = (
    text: string,
    checkDate: number,
    category?: Category,
    reframing?: { rationalThought?: string; actionPlan?: string }
  ) => {
>>>>>>> e4bc5e8 (big maj)
    const newWorry: Worry = {
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
      checkDate,
<<<<<<< HEAD
      status: 'pending'
=======
      status: 'pending',
      category,
      reframing
>>>>>>> e4bc5e8 (big maj)
    };

    const updated = [newWorry, ...worries];
    setWorries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setView('dashboard');
  };

<<<<<<< HEAD
  const handleResolveWorry = (id: string, status: 'happened' | 'did_not_happen') => {
    const updated = worries.map(w => 
      w.id === id ? { ...w, status } : w
=======
  const handleResolveWorry = (id: string, status: 'happened' | 'did_not_happen', reflection?: string) => {
    const updated = worries.map(w =>
      w.id === id ? { ...w, status, reflection } : w
>>>>>>> e4bc5e8 (big maj)
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

<<<<<<< HEAD
=======
  const handleImportData = (data: Worry[]) => {
    setWorries(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

>>>>>>> e4bc5e8 (big maj)
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
<<<<<<< HEAD
      
=======

>>>>>>> e4bc5e8 (big maj)
      {/* No global cinematic-noise here anymore, it is specific to sections */}

      {/* 1. LANDING PAGE */}
      <AnimatePresence mode="wait">
        {showLanding && (
<<<<<<< HEAD
           <motion.div 
             key="landing"
             className="absolute inset-0 z-50"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0, transition: { duration: 0.8 } }}
           >
             <Landing onEnter={handleEnterApp} />
           </motion.div>
=======
          <motion.div
            key="landing"
            className="absolute inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            <Landing onEnter={handleEnterApp} />
          </motion.div>
>>>>>>> e4bc5e8 (big maj)
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
<<<<<<< HEAD
          
=======

>>>>>>> e4bc5e8 (big maj)
          <Header currentView={view} onChange={setView} />

          <main className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
<<<<<<< HEAD
              
              {view === 'dashboard' && (
                <motion.div 
                  key="dashboard" 
                  className="absolute inset-0 pt-24" // pt-24 for header space
                  {...pageTransition}
                >
                  <Dashboard 
                    worries={worries} 
                    onAddPress={() => setView('capture')} 
=======

              {view === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  className="absolute inset-0 pt-24" // pt-24 for header space
                  {...pageTransition}
                >
                  <Dashboard
                    worries={worries}
                    onAddPress={() => setView('capture')}
>>>>>>> e4bc5e8 (big maj)
                    onSettingsPress={() => setView('settings')}
                    userName={userName}
                  />
                </motion.div>
              )}

              {view === 'archive' && (
<<<<<<< HEAD
                <motion.div 
                  key="archive" 
                  className="absolute inset-0 pt-24"
                  {...pageTransition}
                >
                  <Archive worries={worries} onDelete={handleDeleteWorry} />
=======
                <motion.div
                  key="archive"
                  className="absolute inset-0 pt-24"
                  {...pageTransition}
                >
                  <Archive worries={worries} onDelete={handleDeleteWorry} onVerify={setActiveOverlayWorry} />
>>>>>>> e4bc5e8 (big maj)
                </motion.div>
              )}

              {view === 'settings' && (
<<<<<<< HEAD
                <motion.div 
                  key="settings" 
                  className="absolute inset-0 pt-24"
                  {...pageTransition}
                >
                  <Settings 
                    currentName={userName} 
                    onUpdateName={handleUpdateName}
                    onReset={handleResetAll}
=======
                <motion.div
                  key="settings"
                  className="absolute inset-0 pt-24"
                  {...pageTransition}
                >
                  <Settings
                    currentName={userName}
                    onUpdateName={handleUpdateName}
                    onReset={handleResetAll}
                    worries={worries}
                    onImport={handleImportData}
>>>>>>> e4bc5e8 (big maj)
                  />
                </motion.div>
              )}

              {/* Capture Overlay (Full Screen Modal style) */}
              {view === 'capture' && (
<<<<<<< HEAD
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
=======
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
>>>>>>> e4bc5e8 (big maj)
                </motion.div>
              )}

            </AnimatePresence>
          </main>

          {/* Reality Check Overlay */}
          <AnimatePresence>
            {activeOverlayWorry && (
<<<<<<< HEAD
              <VerificationOverlay 
                worry={activeOverlayWorry} 
                onResolve={handleResolveWorry} 
=======
              <VerificationOverlay
                worry={activeOverlayWorry}
                onResolve={handleResolveWorry}
              />
            )}
          </AnimatePresence>

          {/* Notification Toast for Due Worries */}
          <AnimatePresence>
            {dueNotificationWorry && !activeOverlayWorry && (
              <NotificationToast
                worry={dueNotificationWorry}
                onOpen={() => {
                  setActiveOverlayWorry(dueNotificationWorry);
                  setDueNotificationWorry(null);
                }}
                onClose={() => setDueNotificationWorry(null)}
>>>>>>> e4bc5e8 (big maj)
              />
            )}
          </AnimatePresence>

        </div>
      )}
<<<<<<< HEAD
=======

      <Soundscapes />
>>>>>>> e4bc5e8 (big maj)
    </div>
  );
}

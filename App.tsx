import { useState, useEffect, useCallback } from 'react';
import { Dashboard } from './components/Dashboard';
import { Capture } from './components/Capture';
import { Archive } from './components/Archive';
import { Header } from './components/Header';
import { VerificationOverlay } from './components/VerificationOverlay';
import { Onboarding } from './components/Onboarding';
import { Settings } from './components/Settings';
import { Landing } from './components/Landing';
import { Worry, ViewState, MOCK_INITIAL_DATA } from './types';
import { AnimatePresence, motion } from 'framer-motion';

const STORAGE_KEY = 'lucid_worries_v1';
const ONBOARDING_KEY = 'lucid_onboarding_v1';
const USERNAME_KEY = 'lucid_username_v1';

export default function App() {
  const [worries, setWorries] = useState<Worry[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [worryToVerify, setWorryToVerify] = useState<Worry | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // States for flow
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [userName, setUserName] = useState<string>('');

  // Load from storage
  useEffect(() => {
    // 1. Check Onboarding
    const onboardingStatus = localStorage.getItem(ONBOARDING_KEY);
    const storedName = localStorage.getItem(USERNAME_KEY);
    
    if (onboardingStatus === 'true') {
        setIsOnboardingComplete(true);
        if (storedName) setUserName(storedName);
    }

    // 2. Load Data
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setWorries(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse worries", e);
        setWorries(MOCK_INITIAL_DATA);
      }
    } else {
      setWorries(MOCK_INITIAL_DATA);
    }
    
    setIsLoaded(true);
  }, []);

  // Save to storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(worries));
    }
  }, [worries, isLoaded]);

  // Check for items needing verification
  useEffect(() => {
    if (!isLoaded || !isOnboardingComplete) return;

    const checkVerifications = () => {
      const now = Date.now();
      const overdue = worries.find(
        w => w.status === 'pending' && w.checkDate <= now
      );
      
      if (overdue && !worryToVerify) {
        setWorryToVerify(overdue);
      }
    };

    checkVerifications();
    const interval = setInterval(checkVerifications, 60000);
    return () => clearInterval(interval);
  }, [worries, isLoaded, worryToVerify, isOnboardingComplete]);

  const handleAddWorry = (text: string, checkDate: number) => {
    const newWorry: Worry = {
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
      checkDate,
      status: 'pending',
    };
    setWorries(prev => [...prev, newWorry]);
    setView('dashboard');
  };

  const handleResolveWorry = useCallback((id: string, status: 'happened' | 'did_not_happen') => {
    setWorries(prev => prev.map(w => w.id === id ? { ...w, status } : w));
    setWorryToVerify(null);
  }, []);

  const handleDeleteWorry = useCallback((id: string) => {
    setWorries(prev => prev.filter(w => w.id !== id));
  }, []);

  const handleOnboardingComplete = (name: string) => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.setItem(USERNAME_KEY, name);
    setUserName(name);
    setIsOnboardingComplete(true);
  };

  const handleUpdateName = (name: string) => {
    const newName = name.trim();
    localStorage.setItem(USERNAME_KEY, newName);
    setUserName(newName);
  };

  const handleResetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(USERNAME_KEY);
    
    setWorries([]);
    setUserName('');
    setIsOnboardingComplete(false);
    setHasEnteredApp(false); // Return to landing on reset
    setView('dashboard');
  };

  if (!isLoaded) return <div className="bg-midnight h-screen w-screen" />;

  return (
    <div className="bg-midnight min-h-screen text-slate-200 font-sans overflow-hidden relative selection:bg-accent selection:text-midnight">
      <AnimatePresence mode="wait">
        {/* 1. Landing Page */}
        {!hasEnteredApp && (
          <Landing key="landing" onEnter={() => setHasEnteredApp(true)} />
        )}

        {/* 2. Onboarding (if new user) */}
        {hasEnteredApp && !isOnboardingComplete && (
          <motion.div key="onboarding" className="fixed inset-0 z-40">
             <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        )}
      
        {/* 3. Main App */}
        {hasEnteredApp && isOnboardingComplete && (
          <motion.div 
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-screen w-full flex flex-col"
          >
            {/* Navigation Top Bar */}
            <Header currentView={view} onChange={setView} />

            {/* Main Content Area */}
            <main className="flex-1 w-full mx-auto relative bg-midnight overflow-hidden flex flex-col pt-24 md:pt-32">
              
              {/* Views Container */}
              <div className="flex-1 relative w-full max-w-7xl mx-auto">
                  {view === 'dashboard' && (
                  <Dashboard 
                      worries={worries} 
                      onAddPress={() => setView('capture')}
                      onSettingsPress={() => setView('settings')}
                      userName={userName}
                  />
                  )}

                  {view === 'archive' && (
                  <Archive 
                      worries={worries} 
                      onDelete={handleDeleteWorry}
                  />
                  )}

                  {view === 'settings' && (
                      <Settings 
                          currentName={userName}
                          onUpdateName={handleUpdateName}
                          onReset={handleResetData}
                      />
                  )}
              </div>

              {/* Full Screen Modals */}
              {view === 'capture' && (
                <Capture 
                  onClose={() => setView('dashboard')} 
                  onSave={handleAddWorry} 
                />
              )}

              {/* Reality Check Overlay */}
              {worryToVerify && (
                <VerificationOverlay 
                  worry={worryToVerify} 
                  onResolve={handleResolveWorry} 
                />
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import React from 'react';
import { Home, History } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChange }) => {
  if (currentView === 'capture') return null; // Hide nav on capture screen

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-midnight to-transparent z-10">
      <div className="max-w-xs mx-auto bg-surface/80 backdrop-blur-md border border-slate-800 rounded-full p-1 flex justify-between">
        <button
          onClick={() => onChange('dashboard')}
          className={`flex-1 py-3 rounded-full flex items-center justify-center transition-colors ${
            currentView === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Home size={20} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />
        </button>
        <div className="w-px bg-slate-800 my-2" />
        <button
          onClick={() => onChange('archive')}
          className={`flex-1 py-3 rounded-full flex items-center justify-center transition-colors ${
            currentView === 'archive' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <History size={20} strokeWidth={currentView === 'archive' ? 2.5 : 2} />
        </button>
      </div>
    </div>
  );
};
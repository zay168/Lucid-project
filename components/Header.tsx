
import React from 'react';
import { Settings } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onChange }) => {
  // On cache le header si on est en mode capture (focus total)
  if (currentView === 'capture') return null;

  const linkClass = (view: ViewState) => `
    text-sm font-medium tracking-widest uppercase transition-all duration-300 hover:text-accent cursor-pointer
    ${currentView === view ? 'text-white' : 'text-slate-500'}
  `;

  return (
    <header className="absolute top-0 left-0 right-0 p-8 md:p-12 flex items-center justify-between z-40 max-w-7xl mx-auto w-full">
      {/* Logo / Brand */}
      <div 
        onClick={() => onChange('dashboard')}
        className="cursor-pointer group"
      >
        <h1 className="text-2xl font-extrabold tracking-tighter text-white group-hover:text-accent transition-colors">
          LUCID
        </h1>
      </div>

      {/* Desktop Navigation */}
      <nav className="flex items-center gap-8 md:gap-12">
        <button 
          onClick={() => onChange('dashboard')}
          className={linkClass('dashboard')}
        >
          Accueil
        </button>
        
        <button 
          onClick={() => onChange('archive')}
          className={linkClass('archive')}
        >
          Archives
        </button>

        <button 
          onClick={() => onChange('settings')}
          className={`${linkClass('settings')} flex items-center gap-2`}
          aria-label="Paramètres"
        >
          <span className="hidden md:inline">Paramètres</span>
          <Settings size={20} className={currentView === 'settings' ? 'text-white' : 'text-slate-500'} />
        </button>
      </nav>
    </header>
  );
};

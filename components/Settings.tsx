
import React, { useState } from 'react';
import { Trash2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsProps {
  currentName: string;
  onUpdateName: (name: string) => void;
  onBack: () => void;
  onReset: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentName, onUpdateName, onReset }) => {
  const [name, setName] = useState(currentName);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      onUpdateName(name.trim());
      // On reste sur la page après sauvegarde, avec un feedback visuel idéalement (ici simple)
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col p-6 relative z-20 overflow-y-auto"
    >
        <div className="max-w-2xl mx-auto w-full h-full flex flex-col pt-4">
            <h2 className="text-3xl font-light text-white mb-12 tracking-wide">Paramètres du compte</h2>

            <div className="space-y-12">
                {/* Name Section */}
                <section>
                <label className="block text-xs uppercase text-slate-500 tracking-wider mb-4 font-bold">
                    Personnalisation
                </label>
                <div className="flex gap-4">
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-surface border border-slate-800 rounded-xl px-6 py-4 text-white text-lg outline-none focus:border-accent transition-colors placeholder-slate-700"
                    placeholder="Votre prénom"
                    />
                    <button
                    onClick={handleSave}
                    disabled={!name.trim() || name === currentName}
                    className={`px-6 rounded-xl flex items-center justify-center transition-colors font-medium ${
                        !name.trim() || name === currentName 
                        ? 'bg-slate-900 text-slate-600 border border-slate-800' 
                        : 'bg-accent text-midnight hover:bg-white'
                    }`}
                    >
                    {name === currentName ? 'Enregistré' : 'Sauvegarder'}
                    </button>
                </div>
                </section>

                {/* About Section */}
                <section>
                <label className="block text-xs uppercase text-slate-500 tracking-wider mb-4 font-bold">
                    Confidentialité
                </label>
                <div className="bg-surface/50 border border-slate-800 rounded-xl p-6 flex items-start gap-6">
                    <div className="p-3 bg-emerald-900/20 rounded-lg">
                        <Shield className="text-emerald-500" size={24} />
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-medium mb-2">100% Privé & Hors Ligne</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            LUCID est conçu comme un coffre-fort. Vos données sont stockées uniquement dans la mémoire locale de votre navigateur. Aucune donnée ne transite sur internet, aucune IA ne lit vos pensées.
                        </p>
                    </div>
                </div>
                </section>

                {/* Data Section */}
                <section className="pt-8 border-t border-slate-900/50">
                <label className="block text-xs uppercase text-red-900/50 tracking-wider mb-4 font-bold">
                    Zone de danger
                </label>
                {!confirmReset ? (
                    <button
                    onClick={() => setConfirmReset(true)}
                    className="px-6 py-4 border border-red-900/30 text-red-400/60 rounded-xl hover:bg-red-900/10 transition-colors text-sm font-medium flex items-center gap-3 hover:text-red-400"
                    >
                    <Trash2 size={18} />
                    Réinitialiser toutes les données
                    </button>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 bg-red-900/10 p-6 rounded-xl border border-red-900/30 max-w-md"
                    >
                        <p className="text-red-400 text-lg font-medium">
                            Êtes-vous absolument sûr ?
                        </p>
                        <p className="text-red-400/70 text-sm">
                            Cette action est irréversible. Votre taux de lucidité et votre historique seront effacés.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <button
                            onClick={() => setConfirmReset(false)}
                            className="px-6 py-3 bg-transparent border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium"
                            >
                            Annuler
                            </button>
                            <button
                            onClick={() => {
                                onReset();
                                setConfirmReset(false);
                            }}
                            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors text-sm font-bold shadow-lg shadow-red-900/20"
                            >
                            Tout effacer
                            </button>
                        </div>
                    </motion.div>
                )}
                </section>
            </div>
            
            <div className="mt-auto text-center py-12">
                <p className="text-xs text-slate-800 uppercase tracking-widest font-bold">LUCID v1.0.0 Web</p>
            </div>
        </div>
    </motion.div>
  );
};

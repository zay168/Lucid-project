import React, { useState } from 'react';
import { Trash2, Shield, Download, Upload, MessageSquare, Send, HeartHandshake, Sun, Moon, Monitor, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Worry } from '../types';

interface SettingsProps {
    currentName: string;
    onUpdateName: (name: string) => void;
    onReset: () => void;
    worries: Worry[];
    onImport: (data: Worry[]) => void;
    theme: 'light' | 'dark' | 'system';
    onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
    onShowLanding: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentName, onUpdateName, onReset, worries, onImport, theme, onThemeChange, onShowLanding }) => {
    const [name, setName] = useState(currentName);
    const [confirmReset, setConfirmReset] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleSave = () => {
        if (name.trim()) {
            onUpdateName(name.trim());
        }
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(worries, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lucid_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    if (Array.isArray(data)) {
                        onImport(data);
                        alert('Import réussi !');
                    }
                } catch (error) {
                    console.error('Import failed', error);
                    alert('Erreur lors de l\'import');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleSendFeedback = () => {
        if (!feedback.trim()) return;
        const subject = encodeURIComponent("Feedback Lucid App");
        const body = encodeURIComponent(feedback);
        window.location.href = `mailto:htrheryh@gmail.com?subject=${subject}&body=${body}`;
        setFeedback('');
    };

    return (
        <motion.div
            {...({
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 }
            } as any)}
            className="h-full flex flex-col p-6 relative z-20 overflow-y-auto"
        >
            <div className="max-w-2xl mx-auto w-full h-full flex flex-col pt-4">
                <h2 className="text-3xl font-light text-[rgb(var(--color-text-main))] mb-12 tracking-wide">Paramètres du compte</h2>

                <div className="space-y-12">
                    {/* Theme Section (NEW) */}
                    <section>
                        <label className="block text-xs uppercase text-slate-500 tracking-wider mb-4 font-bold">
                            Apparence
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => onThemeChange('light')}
                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${theme === 'light'
                                    ? 'bg-orange-50 dark:bg-slate-800 border-accent text-slate-900 dark:text-white'
                                    : 'bg-surface border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <Sun size={24} className={theme === 'light' ? 'text-orange-500' : 'text-slate-400'} />
                                <span className="text-sm font-medium">Clair</span>
                            </button>
                            <button
                                onClick={() => onThemeChange('dark')}
                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${theme === 'dark'
                                    ? 'bg-slate-200 dark:bg-slate-800 border-accent text-slate-900 dark:text-white'
                                    : 'bg-surface border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <Moon size={24} className={theme === 'dark' ? 'text-accent' : 'text-slate-400'} />
                                <span className="text-sm font-medium">Sombre</span>
                            </button>
                            <button
                                onClick={() => onThemeChange('system')}
                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${theme === 'system'
                                    ? 'bg-blue-50 dark:bg-slate-800 border-accent text-slate-900 dark:text-white'
                                    : 'bg-surface border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <Monitor size={24} className={theme === 'system' ? 'text-blue-500' : 'text-slate-400'} />
                                <span className="text-sm font-medium">Système</span>
                            </button>
                        </div>
                    </section>

                    {/* About / Intro Section */}
                    <section>
                        <label className="block text-xs uppercase text-slate-500 tracking-wider mb-4 font-bold">
                            À propos
                        </label>
                        <button
                            onClick={onShowLanding}
                            className="w-full flex items-center justify-between p-4 bg-surface border border-slate-200 dark:border-slate-800 rounded-xl text-[rgb(var(--color-text-main))] hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-accent/50 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                                    <Sparkles size={20} className="text-indigo-500" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium">Revoir l'introduction</div>
                                    <div className="text-xs text-slate-500">Afficher l'animation de bienvenue</div>
                                </div>
                            </div>
                            <div className="text-slate-400 group-hover:text-accent transition-colors">→</div>
                        </button>
                    </section>

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
                                className="flex-1 bg-surface border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-[rgb(var(--color-text-main))] text-lg outline-none focus:border-accent transition-colors placeholder-slate-400 dark:placeholder-slate-700"
                                placeholder="Votre prénom"
                            />
                            <button
                                onClick={handleSave}
                                disabled={!name.trim() || name === currentName}
                                className={`px-6 rounded-xl flex items-center justify-center transition-colors font-medium ${!name.trim() || name === currentName
                                    ? 'bg-slate-200 text-slate-400 border border-slate-300 dark:bg-slate-900 dark:text-slate-600 dark:border-slate-800'
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
                        <div className="bg-emerald-50/50 dark:bg-surface/50 border border-emerald-200 dark:border-slate-800 rounded-xl p-6 flex items-start gap-6">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                                <Shield className="text-emerald-600 dark:text-emerald-500" size={24} />
                            </div>
                            <div>
                                <h3 className="text-[rgb(var(--color-text-main))] text-lg font-medium mb-2">100% Privé & Hors Ligne</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    LUCID est conçu comme un coffre-fort. Vos données sont stockées uniquement dans la mémoire locale de votre navigateur. Aucune donnée ne transite sur internet, aucune IA ne lit vos pensées.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Data Management Section */}
                    <section>
                        <label className="block text-xs uppercase text-slate-500 tracking-wider mb-4 font-bold">
                            Données
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={handleExport}
                                className="flex items-center justify-center gap-3 p-4 bg-surface border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
                            >
                                <Download size={20} className="text-accent group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <div className="font-medium text-[rgb(var(--color-text-main))]">Exporter</div>
                                    <div className="text-xs text-slate-500">Sauvegarder en JSON</div>
                                </div>
                            </button>

                            <label className="flex items-center justify-center gap-3 p-4 bg-surface border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group">
                                <Upload size={20} className="text-accent group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <div className="font-medium text-[rgb(var(--color-text-main))]">Importer</div>
                                    <div className="text-xs text-slate-500">Restaurer une sauvegarde</div>
                                </div>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImport}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </section>

                    {/* Feedback Section */}
                    <section>
                        <label className="block text-xs uppercase text-slate-500 tracking-wider mb-4 font-bold">
                            Votre Avis
                        </label>
                        <div className="bg-slate-50 dark:bg-surface border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-2 bg-accent/10 dark:bg-slate-800 rounded-lg">
                                    <MessageSquare size={20} className="text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-[rgb(var(--color-text-main))] font-medium">Aidez-nous à améliorer Lucid</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Une idée ? Un bug ? Dites-nous tout.</p>
                                </div>
                            </div>

                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="J'aimerais pouvoir..."
                                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-accent resize-none h-32 mb-4 transition-colors"
                            />

                            <div className="flex justify-end">
                                <button
                                    onClick={handleSendFeedback}
                                    disabled={!feedback.trim()}
                                    className="flex items-center gap-2 px-6 py-3 bg-accent text-midnight rounded-xl font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                                >
                                    <Send size={18} />
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Help & Emergency Section (NEW) */}
                    <section>
                        <label className="block text-xs uppercase text-slate-500 tracking-wider mb-4 font-bold">
                            Aide & Urgence
                        </label>
                        <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 rounded-xl p-6 flex items-start gap-6">
                            <div className="p-3 bg-rose-100 dark:bg-rose-900/20 rounded-lg shrink-0">
                                <HeartHandshake className="text-rose-500 dark:text-rose-400" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[rgb(var(--color-text-main))] text-lg font-medium mb-2">Besoin d'aide immédiate ?</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                    LUCID est un outil d'accompagnement, pas un service médical. Si vous êtes en détresse, contactez le 3114.
                                </p>
                                <a
                                    href="tel:3114"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-600/20 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-600 hover:text-white transition-all font-bold text-sm border border-rose-300 dark:border-rose-600/30"
                                >
                                    📞 Appeler le 3114
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="pt-8 border-t border-slate-200 dark:border-slate-900/50">
                        <label className="block text-xs uppercase text-red-400 dark:text-red-900/50 tracking-wider mb-4 font-bold">
                            Zone de danger
                        </label>
                        {!confirmReset ? (
                            <button
                                onClick={() => setConfirmReset(true)}
                                className="px-6 py-4 border border-red-200 dark:border-red-900/30 text-red-400 dark:text-red-400/60 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm font-medium flex items-center gap-3 hover:text-red-500 dark:hover:text-red-400"
                            >
                                <Trash2 size={18} />
                                Réinitialiser toutes les données
                            </button>
                        ) : (
                            <motion.div
                                {...({
                                    initial: { opacity: 0, height: 0 },
                                    animate: { opacity: 1, height: 'auto' }
                                } as any)}
                                className="space-y-4 bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-900/30 max-w-md"
                            >
                                <p className="text-red-600 dark:text-red-400 text-lg font-medium">
                                    Êtes-vous absolument sûr ?
                                </p>
                                <p className="text-red-500 dark:text-red-400/70 text-sm">
                                    Cette action est irréversible. Votre taux de lucidité et votre historique seront effacés.
                                </p>
                                <div className="flex gap-4 mt-4">
                                    <button
                                        onClick={() => setConfirmReset(false)}
                                        className="px-6 py-3 bg-transparent border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
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
                    <p className="text-xs text-slate-400 dark:text-slate-600 uppercase tracking-widest font-bold">LUCID v1.0.0 Web</p>
                </div>
            </div>
        </motion.div>
    );
};

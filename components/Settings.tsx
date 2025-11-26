import React, { useState } from 'react';
import { Trash2, Shield, Download, Upload, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Worry } from '../types';

interface SettingsProps {
    currentName: string;
    onUpdateName: (name: string) => void;
    onReset: () => void;
    worries: Worry[];
    onImport: (data: Worry[]) => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentName, onUpdateName, onReset, worries, onImport }) => {
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
        // Optional: Show a toast or alert
        // alert('Merci pour votre retour !'); 
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
                                className={`px-6 rounded-xl flex items-center justify-center transition-colors font-medium ${!name.trim() || name === currentName
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

                    {/* Data Management Section */}
                    <section>
                        <label className="block text-xs uppercase text-slate-500 tracking-wider mb-4 font-bold">
                            Données
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={handleExport}
                                className="flex items-center justify-center gap-3 p-4 bg-surface border border-slate-800 rounded-xl text-slate-300 hover:bg-slate-800 hover:border-slate-700 transition-all group"
                            >
                                <Download size={20} className="text-accent group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <div className="font-medium text-white">Exporter</div>
                                    <div className="text-xs text-slate-500">Sauvegarder en JSON</div>
                                </div>
                            </button>

                            <label className="flex items-center justify-center gap-3 p-4 bg-surface border border-slate-800 rounded-xl text-slate-300 hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer group">
                                <Upload size={20} className="text-accent group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <div className="font-medium text-white">Importer</div>
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
                        <div className="bg-surface border border-slate-800 rounded-xl p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-2 bg-slate-800 rounded-lg">
                                    <MessageSquare size={20} className="text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Aidez-nous à améliorer Lucid</h3>
                                    <p className="text-sm text-slate-400 mt-1">Une idée ? Un bug ? Dites-nous tout.</p>
                                </div>
                            </div>

                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="J'aimerais pouvoir..."
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent resize-none h-32 mb-4 transition-colors"
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

                    {/* Danger Zone */}
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
                                {...({
                                    initial: { opacity: 0, height: 0 },
                                    animate: { opacity: 1, height: 'auto' }
                                } as any)}
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

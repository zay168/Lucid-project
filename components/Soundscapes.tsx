import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SOUNDS = [
    { id: 'rain', name: 'Pluie Douce', url: '/sounds/rain.mp3' },
    { id: 'waves', name: 'Vagues', url: '/sounds/waves.mp3' },
    { id: 'white_noise', name: 'Bruit Blanc', url: '/sounds/white_noise.mp3' },
];

export function Soundscapes() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSound, setCurrentSound] = useState(SOUNDS[0]);
    const [volume, setVolume] = useState(0.5);
    const [isExpanded, setIsExpanded] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Audio play failed", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSound, volume]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-midnight/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl w-64 mb-2"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-slate-400 pb-2 border-b border-white/10">
                                <span className="font-medium text-white">Ambiances</span>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className={`p-1.5 rounded-full transition-colors ${isPlaying ? 'bg-accent text-midnight' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                                >
                                    {isPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
                                </button>
                            </div>

                            <div className="space-y-1">
                                {SOUNDS.map(sound => (
                                    <button
                                        key={sound.id}
                                        onClick={() => {
                                            if (currentSound.id === sound.id) {
                                                setIsPlaying(!isPlaying);
                                            } else {
                                                setCurrentSound(sound);
                                                setIsPlaying(true);
                                            }
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group ${currentSound.id === sound.id
                                            ? 'bg-white/10 text-white font-medium'
                                            : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                                            }`}
                                    >
                                        <span>{sound.name}</span>
                                        {currentSound.id === sound.id && isPlaying && (
                                            <motion.div
                                                className="flex gap-0.5 items-end h-3"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                {[1, 2, 3].map(i => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-0.5 bg-accent rounded-full"
                                                        animate={{ height: [4, 12, 4] }}
                                                        transition={{
                                                            duration: 0.8,
                                                            repeat: Infinity,
                                                            delay: i * 0.2,
                                                            ease: "easeInOut"
                                                        }}
                                                    />
                                                ))}
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-2">
                                <div className="flex justify-between text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
                                    <span>Volume</span>
                                    <span>{Math.round(volume * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-accent hover:accent-white transition-all"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`p-3 rounded-full shadow-lg backdrop-blur-md border transition-all ${isPlaying
                    ? 'bg-accent text-midnight border-accent'
                    : 'bg-midnight/80 text-slate-400 border-white/10 hover:border-white/20'
                    }`}
            >
                <Music size={20} />
            </button>

            <audio
                ref={audioRef}
                src={currentSound.url}
                loop
            />
        </div>
    );
}

/**
 * Utility functions for optimized localStorage operations
 * Maintains backward compatibility with existing data
 */

type StorageCallback = () => void;

// Debounced save to prevent excessive writes
const debouncedSaves = new Map<string, ReturnType<typeof setTimeout>>();

export const debouncedSaveToStorage = (
    key: string,
    data: any,
    delay = 300,
    onComplete?: StorageCallback
) => {
    // Clear existing timeout for this key
    const existingTimeout = debouncedSaves.get(key);
    if (existingTimeout) {
        clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            debouncedSaves.delete(key);
            onComplete?.();
        } catch (e) {
            console.error(`Error saving to localStorage [${key}]:`, e);
        }
    }, delay);

    debouncedSaves.set(key, timeout);
};

// Immediate save (for critical operations like onboarding)
export const saveToStorage = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Error saving to localStorage [${key}]:`, e);
    }
};

// Load from storage with error handling
export const loadFromStorage = <T>(key: string, fallback: T): T => {
    try {
        const saved = localStorage.getItem(key);
        if (!saved) return fallback;
        return JSON.parse(saved) as T;
    } catch (e) {
        console.error(`Error loading from localStorage [${key}]:`, e);
        return fallback;
    }
};

// Remove from storage
export const removeFromStorage = (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error(`Error removing from localStorage [${key}]:`, e);
    }
};

// Flush all pending debounced saves (call before unload)
export const flushPendingSaves = () => {
    debouncedSaves.forEach((timeout, key) => {
        clearTimeout(timeout);
        // Execute immediately
        try {
            const data = localStorage.getItem(key);
            if (data) {
                localStorage.setItem(key, data);
            }
        } catch (e) {
            console.error('Error flushing pending saves:', e);
        }
    });
    debouncedSaves.clear();
};

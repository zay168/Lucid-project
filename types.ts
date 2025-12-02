export type Category = 'work' | 'health' | 'social' | 'finance' | 'other';

export interface Worry {
  id: string;
  text: string;
  createdAt: number; // Timestamp
  checkDate: number; // Timestamp
  status: 'pending' | 'happened' | 'did_not_happen';
  category?: Category;
  reframing?: {
    rationalThought?: string;
    actionPlan?: string;
  };
  reflection?: string;
}

export type ViewState = 'dashboard' | 'capture' | 'archive' | 'settings' | 'breathing';

export const MOCK_INITIAL_DATA: Worry[] = []; // Start empty as requested

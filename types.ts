
export interface Worry {
  id: string;
  text: string;
  createdAt: number; // Timestamp
  checkDate: number; // Timestamp
  status: 'pending' | 'happened' | 'did_not_happen';
}

export type ViewState = 'dashboard' | 'capture' | 'archive' | 'settings';

export const MOCK_INITIAL_DATA: Worry[] = []; // Start empty as requested

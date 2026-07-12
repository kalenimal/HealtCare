import { create } from 'zustand';
import { mockSignals } from './mock-signals';
import type { Signal } from './types';

interface SignalState {
  signals: Signal[];
  markReviewed: (id: string) => void;
}

export const useSignalStore = create<SignalState>((set) => ({
  signals: mockSignals,
  markReviewed: (id) =>
    set((state) => ({
      signals: state.signals.map((s) => (s.id === id ? { ...s, status: 'reviewed' } : s)),
    })),
}));

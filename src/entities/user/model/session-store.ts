import { create } from 'zustand';
import type { User } from './types';

interface SessionState {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateCurrentUser: (patch: Partial<User>) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentUser: null,
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
  updateCurrentUser: (patch) =>
    set((state) =>
      state.currentUser
        ? { currentUser: { ...state.currentUser, ...patch } }
        : state,
    ),
}));

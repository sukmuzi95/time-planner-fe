import { create } from 'zustand';

interface ErrorState {
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  errorMessage: null,
  setErrorMessage: (msg) => set({ errorMessage: msg })
}));

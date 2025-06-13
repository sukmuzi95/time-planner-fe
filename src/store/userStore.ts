import { create } from 'zustand';

interface UserState {
  email: string;
  nickname: string;
  setUser: (data: { email: string; nickname: string }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  email: '',
  nickname: '',
  setUser: ({ email, nickname }) => set({ email, nickname }),
  clearUser: () => set({ email: '', nickname: '' })
}));

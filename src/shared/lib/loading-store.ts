import { create } from "zustand";

interface LoadingState {
  globalLoading: boolean;
  setGlobalLoading: (value: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  globalLoading: false,
  setGlobalLoading: (globalLoading) => set({ globalLoading }),
}));


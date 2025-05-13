import { create } from "zustand";

const usePerformanceStore = create((set) => ({
  performance: [],
  setPerformances: (data) => set({ performance: data }),
}));

export default usePerformanceStore;

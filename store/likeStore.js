import { create } from "zustand";

export const useLikeStore = create((set, get) => ({
  likedPerformances: [],

  setLikedPerformances: (performances) =>
    set({ likedPerformances: performances }),

  addToLiked: (performanceId) =>
    set((state) => ({
      likedPerformances: [...state.likedPerformances, performanceId],
    })),

  removeFromLiked: (performanceId) =>
    set((state) => ({
      likedPerformances: state.likedPerformances.filter(
        (id) => id !== performanceId
      ),
    })),

  isLiked: (performanceId) => get().likedPerformances.includes(performanceId),

  clearLikes: () => set({ likedPerformances: [] }),
}));

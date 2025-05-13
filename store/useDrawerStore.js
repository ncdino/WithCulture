import { create } from 'zustand';

const useDrawerStore = create((set) => ({
  menuDrawerOpen: false,
  searchDrawerOpen: false,
  
  openMenuDrawer: () => set({ menuDrawerOpen: true }),
  closeMenuDrawer: () => set({ menuDrawerOpen: false }),
  
  openSearchDrawer: () => set({ searchDrawerOpen: true }),
  closeSearchDrawer: () => set({ searchDrawerOpen: false }),
  
  drawerOpen: false,
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
}));

export default useDrawerStore;
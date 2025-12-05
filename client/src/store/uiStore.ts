import { create } from 'zustand';

interface UIState {
  isAuthDrawerOpen: boolean;
  authDrawerTab: 'login' | 'register';
  isCartDrawerOpen: boolean;
  isMegaMenuOpen: boolean;
  openAuthDrawer: (tab?: 'login' | 'register') => void;
  closeAuthDrawer: () => void;
  setAuthDrawerTab: (tab: 'login' | 'register') => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleMegaMenu: () => void;
  closeMegaMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAuthDrawerOpen: false,
  authDrawerTab: 'login',
  isCartDrawerOpen: false,
  isMegaMenuOpen: false,
  openAuthDrawer: (tab = 'login') =>
    set({ isAuthDrawerOpen: true, authDrawerTab: tab }),
  closeAuthDrawer: () => set({ isAuthDrawerOpen: false }),
  setAuthDrawerTab: (tab) => set({ authDrawerTab: tab }),
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleMegaMenu: () => set((state) => ({ isMegaMenuOpen: !state.isMegaMenuOpen })),
  closeMegaMenu: () => set({ isMegaMenuOpen: false }),
}));

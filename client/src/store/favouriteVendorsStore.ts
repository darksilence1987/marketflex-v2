import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

export interface FavouriteVendor {
  id: number;
  vendorId: number;
  storeName: string;
  storeDescription?: string;
  address?: string;
  contactEmail?: string;
  addedAt: string;
}

interface FavouriteVendorsState {
  vendors: FavouriteVendor[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchFavourites: () => Promise<void>;
  addFavourite: (vendorId: number) => Promise<void>;
  removeFavourite: (vendorId: number) => Promise<void>;
  isFavourite: (vendorId: number) => boolean;
}

export const useFavouriteVendorsStore = create<FavouriteVendorsState>()(
  persist(
    (set, get) => ({
      vendors: [],
      isLoading: false,
      error: null,

      fetchFavourites: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.get('/favourites/vendors');
          set({ 
            vendors: data || [], 
            isLoading: false 
          });
        } catch (error: any) {
          if (error.response?.status === 401) {
            set({ vendors: [], isLoading: false });
          } else {
            set({ 
              error: error.message || 'Failed to fetch favourite vendors', 
              isLoading: false 
            });
          }
        }
      },

      addFavourite: async (vendorId: number) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post(`/favourites/vendors/${vendorId}`);
          set((state) => ({ 
            vendors: [data, ...state.vendors],
            isLoading: false 
          }));
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to add to favourites', 
            isLoading: false 
          });
          throw error;
        }
      },

      removeFavourite: async (vendorId: number) => {
        set({ isLoading: true, error: null });
        try {
          await api.delete(`/favourites/vendors/${vendorId}`);
          set((state) => ({ 
            vendors: state.vendors.filter(v => v.vendorId !== vendorId),
            isLoading: false 
          }));
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to remove from favourites', 
            isLoading: false 
          });
          throw error;
        }
      },

      isFavourite: (vendorId: number) => {
        return get().vendors.some(v => v.vendorId === vendorId);
      },
    }),
    {
      name: 'favourite-vendors-storage',
      partialize: (state) => ({ vendors: state.vendors }),
    }
  )
);

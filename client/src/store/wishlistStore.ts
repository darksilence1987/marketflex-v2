import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

export interface WishlistItem {
  productId: number;
  productName: string;
  productDescription: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  inStock: boolean;
  vendorId?: number;
  vendorStoreName?: string;
}

interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      isLoading: false,
      error: null,

      fetchWishlist: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.get('/wishlist');
          set({ 
            items: data.items || [], 
            itemCount: data.itemCount || 0,
            isLoading: false 
          });
        } catch (error: any) {
          // If 401, user not authenticated - just set empty
          if (error.response?.status === 401) {
            set({ items: [], itemCount: 0, isLoading: false });
          } else {
            set({ 
              error: error.message || 'Failed to fetch wishlist', 
              isLoading: false 
            });
          }
        }
      },

      addToWishlist: async (productId: number) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post(`/wishlist/${productId}`);
          set({ 
            items: data.items || [], 
            itemCount: data.itemCount || 0,
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to add to wishlist', 
            isLoading: false 
          });
          throw error;
        }
      },

      removeFromWishlist: async (productId: number) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.delete(`/wishlist/${productId}`);
          set({ 
            items: data.items || [], 
            itemCount: data.itemCount || 0,
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to remove from wishlist', 
            isLoading: false 
          });
          throw error;
        }
      },

      clearWishlist: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.delete('/wishlist');
          set({ 
            items: data.items || [], 
            itemCount: data.itemCount || 0,
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to clear wishlist', 
            isLoading: false 
          });
          throw error;
        }
      },

      isInWishlist: (productId: number) => {
        return get().items.some(item => item.productId === productId);
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ 
        items: state.items,
        itemCount: state.itemCount 
      }),
    }
  )
);

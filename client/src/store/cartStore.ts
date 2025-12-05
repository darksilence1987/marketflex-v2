import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendor: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  fetchCart: () => Promise<void>;
}

// Helper to check if user is logged in
const isUserLoggedIn = (): boolean => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      return !!state?.token;
    }
  } catch {
    // Invalid JSON
  }
  return false;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      addItem: (item) => {
        // Optimistic update
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });

        // Sync with backend if logged in
        if (isUserLoggedIn()) {
          api.post(`/cart/items/${item.id}`, null, { params: { quantity: 1 } })
            .catch((error) => {
              console.error('Failed to sync cart add with backend:', error);
            });
        }
      },
      
      removeItem: (id) => {
        // Optimistic update
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));

        // Sync with backend if logged in
        if (isUserLoggedIn()) {
          api.delete(`/cart/items/${id}`)
            .catch((error) => {
              console.error('Failed to sync cart remove with backend:', error);
            });
        }
      },
      
      updateQuantity: (id, quantity) => {
        // Optimistic update
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
          ).filter((i) => i.quantity > 0),
        }));

        // Sync with backend if logged in
        if (isUserLoggedIn()) {
          if (quantity <= 0) {
            api.delete(`/cart/items/${id}`)
              .catch((error) => {
                console.error('Failed to sync cart remove with backend:', error);
              });
          } else {
            api.put(`/cart/items/${id}`, null, { params: { quantity } })
              .catch((error) => {
                console.error('Failed to sync cart update with backend:', error);
              });
          }
        }
      },
      
      clearCart: () => {
        // Always reset to empty array
        set({ items: [] });
        
        // Sync with backend if logged in
        if (isUserLoggedIn()) {
          api.delete('/cart')
            .catch((error) => {
              console.error('Failed to sync cart clear with backend:', error);
            });
        }
      },
      
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      
      getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        
      fetchCart: async () => {
        if (!isUserLoggedIn()) return;
        
        try {
          set({ isLoading: true });
          const response = await api.get('/cart');
          const backendCart = response.data;
          
          // Map backend cart items to local format
          if (backendCart?.items?.length > 0) {
            const mappedItems: CartItem[] = backendCart.items.map((item: any) => ({
              id: String(item.productId),
              name: item.productName,
              price: item.price,
              quantity: item.quantity,
              image: item.productImage || '',
              vendor: item.vendor || 'Unknown',
            }));
            set({ items: mappedItems });
          } else {
            // Backend cart is empty
            set({ items: [] });
          }
        } catch (error) {
          console.error('Failed to fetch cart from backend:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);


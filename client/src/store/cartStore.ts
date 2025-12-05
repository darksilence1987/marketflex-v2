import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

export interface CartItem {
  id: string;           // Product ID (used for adding to cart)
  cartItemId?: string;  // Backend cart item ID (used for update/delete)
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendor: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: Omit<CartItem, 'quantity' | 'cartItemId'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  syncCartOnLogin: () => Promise<void>;
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

        // Sync with backend if logged in - POST uses productId
        if (isUserLoggedIn()) {
          api.post(`/cart/items/${item.id}`, null, { params: { quantity: 1 } })
            .then((response) => {
              // Update cartItemId from backend response
              const backendCart = response.data;
              if (backendCart?.cartItems) {
                const backendItem = backendCart.cartItems.find(
                  (ci: any) => String(ci.product.id) === item.id
                );
                if (backendItem) {
                  set((state) => ({
                    items: state.items.map((i) =>
                      i.id === item.id ? { ...i, cartItemId: String(backendItem.id) } : i
                    ),
                  }));
                }
              }
            })
            .catch((error) => {
              console.error('Failed to sync cart add with backend:', error);
            });
        }
      },
      
      removeItem: (id) => {
        // Find the item to get its cartItemId
        const item = get().items.find((i) => i.id === id);
        
        // Optimistic update
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));

        // Sync with backend if logged in - DELETE uses cartItemId
        if (isUserLoggedIn() && item?.cartItemId) {
          api.delete(`/cart/items/${item.cartItemId}`)
            .catch((error) => {
              console.error('Failed to sync cart remove with backend:', error);
            });
        }
      },
      
      updateQuantity: (id, quantity) => {
        // Find the item to get its cartItemId
        const item = get().items.find((i) => i.id === id);
        
        // Optimistic update
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
          ).filter((i) => i.quantity > 0),
        }));

        // Sync with backend if logged in - PUT/DELETE use cartItemId
        if (isUserLoggedIn() && item?.cartItemId) {
          if (quantity <= 0) {
            api.delete(`/cart/items/${item.cartItemId}`)
              .catch((error) => {
                console.error('Failed to sync cart remove with backend:', error);
              });
          } else {
            api.put(`/cart/items/${item.cartItemId}`, null, { params: { quantity } })
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
        
      /**
       * Sync cart on login:
       * 1. First push all local items to backend (merge with existing backend cart)
       * 2. Then fetch the merged cart from backend
       * This preserves guest cart items after login
       */
      syncCartOnLogin: async () => {
        if (!isUserLoggedIn()) return;
        
        const localItems = get().items;
        
        try {
          set({ isLoading: true });
          
          // Step 1: Push local items to backend (if any)
          if (localItems.length > 0) {
            console.log('Syncing local cart items to backend...', localItems);
            
            // Push each local item to backend using productId
            const pushPromises = localItems.map((item) =>
              api.post(`/cart/items/${item.id}`, null, { params: { quantity: item.quantity } })
                .catch((error) => {
                  console.error(`Failed to push item ${item.id} to backend:`, error);
                })
            );
            
            await Promise.all(pushPromises);
          }
          
          // Step 2: Fetch merged cart from backend
          const response = await api.get('/cart');
          const backendCart = response.data;
          
          // Map backend cart items to local format - include cartItemId!
          // Backend structure: { cartItems: [{ id, product: { id, name, price, imageUrl }, quantity, subtotal }] }
          if (backendCart?.cartItems?.length > 0) {
            const mappedItems: CartItem[] = backendCart.cartItems.map((item: any) => ({
              id: String(item.product.id),
              cartItemId: String(item.id),  // Store backend cart item ID!
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.imageUrl || '',
              vendor: item.product.vendor || 'Unknown',
            }));
            set({ items: mappedItems });
            console.log('Cart synced from backend:', mappedItems);
          } else {
            // Backend cart is empty (unlikely after push, but handle it)
            console.log('Backend cart is empty after sync');
          }
        } catch (error) {
          console.error('Failed to sync cart on login:', error);
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


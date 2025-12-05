import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Sheet, SheetFooter } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { useUIStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export function CartDrawer() {
  const { isCartDrawerOpen, closeCartDrawer, openAuthDrawer } = useUIStore();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      closeCartDrawer();
      openAuthDrawer('login');
      return;
    }
    // Navigate to checkout
    window.location.href = '/checkout';
  };

  const totalPrice = getTotalPrice();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet
      isOpen={isCartDrawerOpen}
      onClose={closeCartDrawer}
      title={`Shopping Cart (${itemCount})`}
      width="w-full max-w-lg"
    >
      <div className="flex flex-col h-full">
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-slate-400 text-sm max-w-xs">
                Looks like you haven't added anything to your cart yet.
                Start shopping to fill it up!
              </p>
              <Button
                variant="secondary"
                className="mt-6"
                onClick={closeCartDrawer}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-800 group"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{item.name}</h4>
                    <p className="text-slate-500 text-sm">{item.vendor}</p>
                    <p className="text-emerald-400 font-semibold mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-white font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full py-2 text-sm text-slate-500 hover:text-red-400 transition-colors"
              >
                Clear all items
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <SheetFooter>
            <div className="space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              {/* Shipping */}
              <div className="flex items-center justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-emerald-400">Free</span>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-800" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-2xl font-bold text-white">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="ghost"
                className="w-full"
                onClick={closeCartDrawer}
              >
                Continue Shopping
              </Button>
            </div>
          </SheetFooter>
        )}
      </div>
    </Sheet>
  );
}

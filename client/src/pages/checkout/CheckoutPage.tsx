import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import api from '../../lib/axios';

// Payment method enum matching backend
type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';

// Validation Schema with split address fields
const checkoutSchema = z.object({
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(3, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  paymentMethod: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'CASH_ON_DELIVERY'], {
    message: 'Please select a payment method',
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// All payment methods matching backend PaymentMethod enum
const paymentMethods: { value: PaymentMethod; label: string; icon: string; description: string }[] = [
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: '💳', description: 'Pay securely with your credit card' },
  { value: 'DEBIT_CARD', label: 'Debit Card', icon: '💳', description: 'Pay directly from your bank account' },
  { value: 'PAYPAL', label: 'PayPal', icon: '🅿️', description: 'Fast and secure payment via PayPal' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '🏦', description: 'Direct bank-to-bank transfer' },
  { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', icon: '💵', description: 'Pay when your order arrives' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useProfileAddress, setUseProfileAddress] = useState(false);

  // Check if user has profile address
  const hasProfileAddress = user && (user.street || user.city || user.state || user.zipCode || user.country);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      paymentMethod: undefined,
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  // Pre-fill with profile address when checkbox is toggled
  const handleUseProfileAddress = (checked: boolean) => {
    setUseProfileAddress(checked);
    if (checked && user) {
      setValue('street', user.street || '');
      setValue('city', user.city || '');
      setValue('state', user.state || '');
      setValue('zipCode', user.zipCode || '');
      setValue('country', user.country || '');
    } else {
      setValue('street', '');
      setValue('city', '');
      setValue('state', '');
      setValue('zipCode', '');
      setValue('country', '');
    }
  };

  // Handle form submission
  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Combine address fields into shippingAddress string for backend
      const shippingAddress = [
        data.street,
        data.city,
        data.state,
        data.zipCode,
        data.country,
      ].filter(Boolean).join(', ');

      const response = await api.post('/orders/checkout', {
        shippingAddress,
        paymentMethod: data.paymentMethod,
      });

      // Clear cart after successful order
      clearCart();

      // Redirect to success page
      navigate(`/order-success/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals
  const subtotal = getTotalPrice();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center">
            <span className="text-4xl">🛒</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Your cart is empty</h1>
          <p className="text-slate-400">Add some items to your cart before checking out.</p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Input field component for cleaner code
  const InputField = ({ 
    name, 
    label, 
    placeholder 
  }: { 
    name: keyof CheckoutFormData; 
    label: string; 
    placeholder: string;
  }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <input
        id={name}
        type="text"
        {...register(name)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
          errors[name]
            ? 'border-red-500 focus:ring-red-500/50'
            : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'
        }`}
        disabled={isSubmitting}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-400">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/products" className="text-slate-400 hover:text-white transition-colors">
              ← Back to Shopping
            </Link>
            <span className="text-slate-600">/</span>
            <h1 className="text-xl font-semibold text-white">Checkout</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Shipping & Payment */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address Section */}
              <section className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 text-sm">1</span>
                  Shipping Address
                </h2>

                {/* Use Profile Address Checkbox */}
                {hasProfileAddress && (
                  <label className="flex items-center gap-3 mb-6 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={useProfileAddress}
                      onChange={(e) => handleUseProfileAddress(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                    />
                    <span className="text-slate-300 group-hover:text-white transition-colors">
                      Use my profile address
                    </span>
                  </label>
                )}

                {/* Split Address Fields */}
                <div className="space-y-4">
                  <InputField name="street" label="Street Address" placeholder="123 Main Street, Apt 4B" />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField name="city" label="City" placeholder="New York" />
                    <InputField name="state" label="State / Province" placeholder="NY" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField name="zipCode" label="ZIP / Postal Code" placeholder="10001" />
                    <InputField name="country" label="Country" placeholder="United States" />
                  </div>
                </div>
              </section>

              {/* Payment Method Section */}
              <section className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 text-sm">2</span>
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedPaymentMethod === method.value
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                      }`}
                    >
                      <input
                        type="radio"
                        value={method.value}
                        {...register('paymentMethod')}
                        className="w-5 h-5 text-emerald-500 border-slate-600 bg-slate-800 focus:ring-emerald-500 focus:ring-offset-0"
                        disabled={isSubmitting}
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{method.label}</p>
                        <p className="text-sm text-slate-400">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="mt-3 text-sm text-red-400">{errors.paymentMethod.message}</p>
                )}
              </section>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-white mb-6">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.name}</p>
                        <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                        <p className="text-emerald-400 text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-700 my-4" />

                {/* Totals */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3 flex justify-between text-white font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 50 && (
                  <p className="mt-4 text-xs text-slate-400 text-center">
                    Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order • ${total.toFixed(2)}
                    </>
                  )}
                </button>

                <p className="mt-4 text-xs text-slate-500 text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsAnimating(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Animated Checkmark */}
        <div className="relative mx-auto w-32 h-32">
          {/* Background Circle */}
          <div
            className={`absolute inset-0 bg-emerald-500/20 rounded-full transition-transform duration-700 ease-out ${
              isAnimating ? 'scale-100' : 'scale-0'
            }`}
          />
          
          {/* Main Circle */}
          <div
            className={`absolute inset-2 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${
              isAnimating ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Checkmark SVG */}
            <svg
              className={`w-16 h-16 text-white transition-all duration-500 ${
                isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{ transitionDelay: '500ms' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                className={`transition-all duration-700 ${isAnimating ? 'animate-draw-check' : ''}`}
                style={{
                  strokeDasharray: 24,
                  strokeDashoffset: isAnimating ? 0 : 24,
                  transition: 'stroke-dashoffset 0.7s ease-out 0.7s',
                }}
              />
            </svg>
          </div>

          {/* Sparkles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-emerald-400 rounded-full transition-all duration-700 ${
                isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
              style={{
                top: '50%',
                left: '50%',
                transform: isAnimating
                  ? `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-70px) scale(${0.5 + Math.random() * 0.5})`
                  : 'translate(-50%, -50%)',
                transitionDelay: `${600 + i * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* Success Message */}
        <div
          className={`space-y-3 transition-all duration-500 ${
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <h1 className="text-3xl font-bold text-white">Order Confirmed!</h1>
          <p className="text-slate-400 text-lg">
            Thank you for your purchase
          </p>
        </div>

        {/* Order ID */}
        <div
          className={`bg-slate-900/50 border border-slate-800 rounded-2xl p-6 transition-all duration-500 ${
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          <p className="text-slate-400 text-sm mb-2">Order Number</p>
          <p className="text-2xl font-mono font-bold text-emerald-400">
            #{id}
          </p>
          <p className="text-slate-500 text-sm mt-3">
            You will receive an email confirmation shortly with your order details.
          </p>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500 ${
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '1200ms' }}
        >
          <Link
            to="/products"
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30"
          >
            Continue Shopping
          </Link>
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium rounded-xl transition-all duration-200"
          >
            View Orders
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center gap-2 pt-4">
          {['🎉', '✨', '🛍️', '✨', '🎉'].map((emoji, i) => (
            <span
              key={i}
              className={`text-2xl transition-all duration-500 ${
                isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
              style={{ transitionDelay: `${1400 + i * 100}ms` }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

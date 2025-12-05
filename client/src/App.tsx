import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/LandingPage';
import ProductListingPage from './pages/public/ProductListingPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import { useAuthStore } from './store/authStore';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Dashboard placeholder
function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6 p-8">
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-3xl font-bold shadow-xl shadow-emerald-500/30">
        {user?.firstName?.[0]}{user?.lastName?.[0]}
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.firstName}! 🎉
        </h1>
        <p className="text-slate-400">
          You're now signed in to MarketFlex v2
        </p>
      </div>

      <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4 max-w-md w-full">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Account Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Email</span>
            <span className="text-white font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Role</span>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-md uppercase">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={logout}
        className="mt-4 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white font-medium transition-all duration-200"
      >
        Sign Out
      </button>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
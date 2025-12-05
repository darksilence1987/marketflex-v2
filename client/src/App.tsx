import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/LandingPage';
import ProductListingPage from './pages/public/ProductListingPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderSuccessPage from './pages/checkout/OrderSuccessPage';
import AccountLayout from './pages/account/AccountLayout';
import ProfilePage from './pages/account/ProfilePage';
import OrdersPage from './pages/account/OrdersPage';
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
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success/:id"
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />

          {/* Account Routes */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/account/profile" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
          </Route>

          {/* Legacy redirect */}
          <Route path="/dashboard" element={<Navigate to="/account/profile" replace />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
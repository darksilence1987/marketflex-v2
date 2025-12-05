import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AccountLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
    }`;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <NavLink to="/" className="text-slate-400 hover:text-white transition-colors">
                ← Back to Store
              </NavLink>
              <span className="text-slate-600">/</span>
              <h1 className="text-xl font-semibold text-white">My Account</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="hidden sm:block">
                <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-slate-400 text-sm">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4 space-y-2 sticky top-8">
              <NavLink to="/account/profile" className={navLinkClass}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile Settings
              </NavLink>

              <NavLink to="/account/orders" className={navLinkClass}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                My Orders
              </NavLink>

              <div className="border-t border-slate-700 my-4" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

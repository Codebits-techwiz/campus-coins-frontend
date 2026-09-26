import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  Target,
  BarChart3,
  Lightbulb,
  User,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  Type,
  Bookmark,
  CalendarClock
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { Toast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import api from '../api';

const links = [
  { to: '/app', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/app/categories', label: 'Categories', icon: Tags },
  { to: '/app/budgets', label: 'Budgets', icon: Target },
  { to: '/app/recurring', label: 'Recurring', icon: CalendarClock },
  { to: '/app/reports', label: 'Reports', icon: BarChart3 },
  { to: '/app/insights', label: 'Insights & Tips', icon: Lightbulb },
  { to: '/app/bookmarks', label: 'Bookmarks', icon: Bookmark },
];

export function StudentLayout() {
  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { profile, setProfile, setRole, darkMode, setDarkMode, fontSize, setFontSize } = useApp();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbText = pathnames.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    }
    setProfile(null);
    setRole('public');
    navigate('/');
  };

  const NavItems = () => (
    <>
      {links.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              isActive ? 'bg-cc-lime text-white shadow' : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <Icon className="w-4.5 h-4.5 w-5 h-5" />
          {label}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="h-screen overflow-hidden flex bg-cc-mint-soft">
      <aside className="hidden lg:flex w-64 flex-col bg-cc-forest text-white shrink-0 h-full">
          <div className="p-5 border-b border-white/10">
            <Link to="/">
              <Logo dark />
            </Link>
            <p className="text-xs text-white/50 mt-2">Student Portal</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <NavItems />
          </nav>
          <div className="p-4 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 text-xs font-medium hover:bg-white/15"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                {darkMode ? 'Light' : 'Dark'}
              </button>
              <button
                type="button"
                onClick={() => setFontSize(fontSize === 'lg' ? 'md' : fontSize === 'md' ? 'sm' : 'lg')}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 text-xs font-medium hover:bg-white/15"
                title="Font size"
              >
                <Type className="w-3.5 h-3.5" />
                {fontSize.toUpperCase()}
              </button>
            </div>
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button type="button" className="lg:hidden p-2 rounded-lg hover:bg-cc-mint" onClick={() => setOpen(!open)}>
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="lg:hidden">
                <Logo size="sm" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-cc-muted">Breadcrumb</p>
                <p className="text-sm font-semibold text-cc-forest">{breadcrumbText}</p>
              </div>
            </div>
            <div className="relative">
              <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer text-left bg-transparent border-none p-0 outline-none">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="" className="w-9 h-9 rounded-full ring-2 ring-cc-mint object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full ring-2 ring-cc-mint bg-cc-lime flex items-center justify-center text-white font-bold text-sm">
                    {profile?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-cc-forest leading-tight">{profile?.name || 'Student'}</p>
                  <p className="text-[11px] text-cc-muted">{profile?.academicYear || profile?.email || ''}</p>
                </div>
              </button>
              
              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-cc-muted font-semibold uppercase tracking-wider">Account</p>
                    </div>
                    <Link
                      to="/app/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-cc-forest font-medium hover:bg-cc-mint-soft transition"
                    >
                      <User className="w-4 h-4 text-cc-muted" /> Profile & Settings
                    </Link>
                    <button
                      onClick={() => { setProfileMenuOpen(false); logout(); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 font-medium hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </header>

          {open && (
            <div className="lg:hidden bg-cc-forest p-4 space-y-1 animate-fade-in">
              <NavItems />
              <button type="button" onClick={logout} className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm text-white/70">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      <Toast />
    </div>
  );
}

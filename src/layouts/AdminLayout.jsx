import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Tags,
  Megaphone,
  BarChart3,
  Menu,
  X,
  LogOut,
  Shield,
  FileText,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { Toast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import api from '../api';

const links = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/tip-templates', label: 'Tip Templates', icon: Shield },
  { to: '/admin/site-content', label: 'Landing Page CMS', icon: FileText },
  { to: '/admin/stats', label: 'Usage Stats', icon: BarChart3 },
];

const breadcrumbLabels = {
  admin: 'Admin',
  users: 'Users',
  categories: 'Categories',
  announcements: 'Announcements',
  'tip-templates': 'Tip Templates',
  'site-content': 'Landing Page CMS',
  stats: 'Usage Stats',
};

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setRole, setProfile } = useApp();

  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbText = pathnames
    .map((p) => breadcrumbLabels[p] || (p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ')))
    .join(' / ');

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    }
    localStorage.removeItem('cc_logged_in');
    setProfile?.(null);
    setRole('public');
    navigate('/');
  };

  const NavItems = () =>
    links.map(({ to, end, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        onClick={() => setOpen(false)}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
            isActive ? 'bg-cc-lime text-white' : 'text-white/75 hover:bg-white/10'
          }`
        }
      >
        <Icon className="w-5 h-5" />
        {label}
      </NavLink>
    ));

  return (
    <div className="h-screen overflow-hidden flex bg-gray-50">
      <aside className="hidden lg:flex w-64 flex-col bg-cc-ink text-white shrink-0 h-full">
        <div className="p-5 border-b border-white/10">
          <Link to="/">
            <Logo dark />
          </Link>
          <p className="text-xs text-cc-lime mt-2 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Admin Control Panel
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavItems />
        </nav>
        <div className="p-4 border-t border-white/10">
          <button type="button" onClick={logout} className="flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between sticky top-0 z-30">
          <button type="button" className="lg:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="min-w-0">
            <p className="text-xs text-cc-muted">Admin Control Panel</p>
            <p className="text-sm font-semibold text-cc-forest truncate">{breadcrumbText}</p>
          </div>
          <span className="text-xs bg-cc-forest text-white px-2.5 py-1 rounded-full font-bold">ADMIN</span>
        </header>
        {open && (
          <div className="lg:hidden bg-cc-ink p-4 space-y-1">
            <NavItems />
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

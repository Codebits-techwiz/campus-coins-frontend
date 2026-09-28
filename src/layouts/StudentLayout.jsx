import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  CalendarClock,
  Bell,
  Megaphone,
  CheckCheck,
  Sparkles,
  AlertTriangle,
  Languages,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { Toast } from '../components/Toast';
import { FaqChatbot } from '../components/FaqChatbot';
import { useApp } from '../context/AppContext';
import api from '../api';
import { getAvatarUrl } from '../utils/avatarUrl';

const links = [
  { to: '/app', end: true, key: 'dashboard', icon: LayoutDashboard },
  { to: '/app/transactions', key: 'transactions', icon: ArrowLeftRight },
  { to: '/app/categories', key: 'categories', icon: Tags },
  { to: '/app/budgets', key: 'budgets', icon: Target },
  { to: '/app/recurring', key: 'recurring', icon: CalendarClock },
  { to: '/app/reports', key: 'reports', icon: BarChart3 },
  { to: '/app/insights', key: 'insights', icon: Lightbulb },
  { to: '/app/bookmarks', key: 'bookmarks', icon: Bookmark },
];

export function StudentLayout() {
  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { profile, setProfile, setRole, darkMode, setDarkMode, fontSize, setFontSize, announcements, refreshAllAppData } = useApp();
  const location = useLocation();

  // Soft refresh live data whenever user switches tabs
  useEffect(() => {
    if (typeof refreshAllAppData === 'function') {
      refreshAllAppData();
    }
  }, [location.pathname, refreshAllAppData]);

  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbLabels = {
    app: t('studentNav.studentPortal'),
    transactions: t('studentNav.transactions'),
    categories: t('studentNav.categories'),
    budgets: t('studentNav.budgets'),
    recurring: t('studentNav.recurring'),
    reports: t('studentNav.reports'),
    insights: t('studentNav.insights'),
    bookmarks: t('studentNav.bookmarks'),
    profile: t('studentNav.profile'),
  };
  const breadcrumbText = pathnames
    .map((p) => breadcrumbLabels[p] || (p.charAt(0).toUpperCase() + p.slice(1)))
    .join(' / ');

  const userKey = profile?._id || profile?.id || 'default';
  const storageKey = `cc_read_announcements_${userKey}`;

  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const activeAnnouncements = (announcements || []).filter(
    (a) => a.isActive !== false && a.active !== false
  );

  const unreadAnnouncements = activeAnnouncements.filter(
    (a) => !readIds.includes(a._id || a.id)
  );

  const unreadCount = unreadAnnouncements.length;

  const handleMarkAllRead = () => {
    const allActiveIds = activeAnnouncements.map((a) => a._id || a.id);
    const updated = Array.from(new Set([...readIds, ...allActiveIds]));
    setReadIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save read announcements to localStorage:', e);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    }
    localStorage.removeItem('cc_logged_in');
    setProfile(null);
    setRole('public');
    navigate('/');
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ur' ? 'en' : 'ur';
    i18n.changeLanguage(nextLang);
  };

  const NavItems = () => (
    <>
      {links.map(({ to, end, key, icon: Icon }) => (
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
          <Icon className="w-5 h-5" />
          {t(`studentNav.${key}`)}
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
          <p className="text-xs text-white/50 mt-2">{t('studentNav.studentPortal')}</p>
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
              {darkMode ? t('nav.themeLight') : t('nav.themeDark')}
            </button>
            <button
              type="button"
              onClick={() => setFontSize(fontSize === 'lg' ? 'md' : fontSize === 'md' ? 'sm' : 'lg')}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 text-xs font-medium hover:bg-white/15"
              title={t('studentNav.fontSize')}
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
            <LogOut className="w-4 h-4" /> {t('studentNav.logout')}
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
              <p className="text-xs text-cc-muted">{t('studentNav.studentPortal')}</p>
              <p className="text-sm font-semibold text-cc-forest">{breadcrumbText}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher Button */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-cc-forest hover:bg-cc-mint transition text-xs font-bold"
              title={t('nav.language')}
            >
              <Languages className="w-4 h-4" />
              <span>{i18n.language === 'ur' ? t('nav.english') : t('nav.urdu')}</span>
            </button>
            {/* Header Bell Icon Button & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setBellOpen(!bellOpen);
                  setProfileMenuOpen(false);
                }}
                className="relative p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-cc-forest hover:bg-cc-mint hover:text-cc-forest transition flex items-center justify-center"
                title={t('studentNav.announcements')}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Announcements Overlay Dropdown */}
              {bellOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setBellOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in space-y-3">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-cc-forest text-cc-lime rounded-lg">
                          <Megaphone className="w-4 h-4" />
                        </div>
                        <h3 className="font-extrabold text-sm text-cc-forest">{t('studentNav.announcements')}</h3>
                      </div>
                      {unreadCount > 0 ? (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="text-[11px] font-bold text-cc-forest hover:text-cc-lime flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5 text-cc-lime" /> {t('studentNav.markRead')}
                        </button>
                      ) : (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">{t('studentNav.upToDate')}</span>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
                      {activeAnnouncements.length === 0 ? (
                        <div className="py-8 text-center space-y-2">
                          <Sparkles className="w-8 h-8 text-cc-muted mx-auto opacity-30" />
                          <p className="text-xs text-cc-muted font-medium">{t('studentNav.noAnnouncements')}</p>
                        </div>
                      ) : (
                        activeAnnouncements.map((a) => {
                          const isUrgent = a.priority === 'urgent';
                          const isImportant = a.priority === 'important';

                          return (
                            <div
                              key={a._id || a.id}
                              className={`p-3 rounded-xl border transition ${
                                isUrgent
                                  ? 'bg-red-50/60 border-red-200 text-red-950'
                                  : isImportant
                                  ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                                  : 'bg-gray-50/70 border-gray-100 text-cc-forest'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span
                                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                    isUrgent
                                      ? 'bg-red-500 text-white'
                                      : isImportant
                                      ? 'bg-amber-400 text-cc-forest'
                                      : 'bg-cc-mint text-cc-forest'
                                  }`}
                                >
                                  {a.category || t('studentNav.general')} • {(a.priority || 'normal').toUpperCase()}
                                </span>
                                <span className="text-[10px] text-cc-muted">
                                  {a.createdAt ? new Date(a.createdAt).toLocaleDateString(i18n.language === 'ur' ? 'ur-PK' : 'en-US', { month: 'short', day: 'numeric' }) : t('studentNav.recent')}
                                </span>
                              </div>

                              <h4 className="font-extrabold text-xs text-cc-forest">{a.title}</h4>
                              <p className="text-xs text-cc-muted mt-1 leading-relaxed whitespace-pre-line">{a.message || a.body}</p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button onClick={() => { setProfileMenuOpen(!profileMenuOpen); setBellOpen(false); }} className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer text-left bg-transparent border-none p-0 outline-none">
                {getAvatarUrl(profile?.avatar) ? (
                  <img src={getAvatarUrl(profile.avatar)} alt="" className="w-9 h-9 rounded-full ring-2 ring-cc-mint object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full ring-2 ring-cc-mint bg-cc-lime flex items-center justify-center text-white font-bold text-sm">
                    {profile?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-cc-forest leading-tight">{profile?.name || t('studentNav.student')}</p>
                  <p className="text-[11px] text-cc-muted">
                    {({
                      'Year 1': t('app.profile.year1'),
                      'Year 2': t('app.profile.year2'),
                      'Year 3': t('app.profile.year3'),
                      'Year 4': t('app.profile.year4'),
                      Graduate: t('app.profile.graduate'),
                    })[profile?.academicYear] || profile?.academicYear || profile?.email || ''}
                  </p>
                </div>
              </button>
              
              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-cc-muted font-semibold uppercase tracking-wider">{t('studentNav.account')}</p>
                    </div>
                    <Link
                      to="/app/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-cc-forest font-medium hover:bg-cc-mint-soft transition"
                    >
                      <User className="w-4 h-4 text-cc-muted" /> {t('studentNav.profile')}
                    </Link>
                    <button
                      onClick={() => { setProfileMenuOpen(false); logout(); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 font-medium hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" /> {t('studentNav.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {open && (
          <div className="lg:hidden bg-cc-forest p-4 space-y-1 animate-fade-in">
            <NavItems />
            <button type="button" onClick={logout} className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm text-white/70">
              <LogOut className="w-4 h-4" /> {t('studentNav.logout')}
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <FaqChatbot />
      <Toast />
    </div>
  );
}


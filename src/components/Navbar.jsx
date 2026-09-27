import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Moon, Sun, Languages, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';
import { Button } from './Button';
import { useApp } from '../context/AppContext';
import api from '../api';
import { getAvatarUrl } from '../utils/avatarUrl';

const navLinkDefs = [
  { key: 'home', to: '/' },
  { key: 'features', to: '/features' },
  { key: 'howItWorks', to: '/how-it-works' },
  { key: 'userGuide', to: '/user-guide' },
  { key: 'testimonials', to: '/testimonials' },
  { key: 'sitemap', to: '/sitemap' },
];

function getInitials(name) {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { darkMode, setDarkMode, openChat, chatOpen, role, profile, setProfile, setRole } = useApp();

  const isLoggedIn = role === 'student' || role === 'admin';
  const dashboardPath = role === 'admin' ? '/admin' : '/app';

  const handleFaqClick = () => {
    setOpen(false);
    openChat();
  };

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const linkClass = (to) =>
    `transition ${isActive(to) ? 'text-cc-forest font-semibold' : 'hover:text-cc-forest'}`;

  const setLang = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  const logout = async () => {
    setProfileMenuOpen(false);
    setOpen(false);
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

  const Avatar = ({ size = 'md' }) => {
    const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm';
    const src = getAvatarUrl(profile?.avatar);
    if (src) {
      return (
        <img
          src={src}
          alt=""
          className={`${sizeClass} rounded-full ring-2 ring-cc-mint object-cover`}
        />
      );
    }
    return (
      <div
        className={`${sizeClass} rounded-full ring-2 ring-cc-mint bg-cc-lime flex items-center justify-center text-white font-bold`}
      >
        {getInitials(profile?.name)}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        <Link to="/" onClick={() => setOpen(false)} className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-cc-muted">
          {navLinkDefs.map((l) => (
            <Link key={l.to} to={l.to} className={linkClass(l.to)}>
              {t(`nav.${l.key}`)}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleFaqClick}
            className={`transition ${chatOpen ? 'text-cc-forest font-semibold' : 'hover:text-cc-forest'}`}
          >
            {t('nav.faq')}
          </button>
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-full border border-gray-200 text-cc-forest hover:bg-cc-mint transition text-xs font-bold"
              aria-label={t('nav.language')}
              title={t('nav.language')}
            >
              <Languages className="w-4 h-4" />
              <span>{i18n.language === 'ur' ? 'UR' : 'EN'}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-cc-mint ${i18n.language === 'en' ? 'font-bold text-cc-forest' : 'text-cc-muted'}`}
                >
                  {t('nav.english')}
                </button>
                <button
                  type="button"
                  onClick={() => setLang('ur')}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-cc-mint ${i18n.language === 'ur' ? 'font-bold text-cc-forest' : 'text-cc-muted'}`}
                >
                  {t('nav.urdu')}
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full border border-gray-200 text-cc-forest hover:bg-cc-mint transition"
            aria-label={darkMode ? t('nav.themeLight') : t('nav.themeDark')}
            title={darkMode ? t('nav.themeLight') : t('nav.themeDark')}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((v) => !v);
                  setLangOpen(false);
                }}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-cc-mint transition"
              >
                <Avatar />
                <span className="hidden md:block text-sm font-semibold text-cc-forest max-w-[120px] truncate">
                  {profile?.name || 'User'}
                </span>
                <ChevronDown className="w-4 h-4 text-cc-muted" />
              </button>

              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-sm font-bold text-cc-forest truncate">{profile?.name || 'User'}</p>
                      <p className="text-[11px] text-cc-muted truncate">{profile?.email || ''}</p>
                    </div>
                    <Link
                      to={dashboardPath}
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-cc-forest font-medium hover:bg-cc-mint-soft transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-cc-muted" />
                      {t('studentNav.dashboard')}
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 font-medium hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('studentNav.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-semibold px-2 transition ${
                  isActive('/login') ? 'text-cc-lime' : 'text-cc-forest hover:text-cc-lime'
                }`}
              >
                {t('nav.login')}
              </Link>
              <Button onClick={() => navigate('/register')} className="!rounded-full !px-5">
                {t('nav.signUp')} <ArrowRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 sm:hidden">
          <button
            type="button"
            onClick={() => setLang(i18n.language === 'ur' ? 'en' : 'ur')}
            className="p-2 rounded-lg text-cc-forest hover:bg-cc-mint text-xs font-bold"
            aria-label={t('nav.language')}
          >
            {i18n.language === 'ur' ? 'EN' : 'UR'}
          </button>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-cc-forest hover:bg-cc-mint"
            aria-label={darkMode ? t('nav.themeLight') : t('nav.themeDark')}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => {
                setProfileMenuOpen((v) => !v);
                setOpen(false);
              }}
              className="p-0.5 rounded-full"
              aria-label="Account menu"
            >
              <Avatar size="sm" />
            </button>
          )}
          <button
            type="button"
            className="p-2 rounded-lg text-cc-forest hover:bg-cc-mint"
            onClick={() => {
              setOpen(!open);
              setProfileMenuOpen(false);
            }}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {profileMenuOpen && isLoggedIn && (
        <div className="sm:hidden relative z-50">
          <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
          <div className="absolute right-4 mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <p className="text-sm font-bold text-cc-forest truncate">{profile?.name || 'User'}</p>
              <p className="text-[11px] text-cc-muted truncate">{profile?.email || ''}</p>
            </div>
            <Link
              to={dashboardPath}
              onClick={() => setProfileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-cc-forest font-medium hover:bg-cc-mint-soft transition"
            >
              <LayoutDashboard className="w-4 h-4 text-cc-muted" />
              {t('studentNav.dashboard')}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 font-medium hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
              {t('studentNav.logout')}
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-3 animate-fade-in">
          {navLinkDefs.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block w-full py-2.5 font-medium ${
                isActive(l.to) ? 'text-cc-forest' : 'text-cc-ink'
              }`}
            >
              {t(`nav.${l.key}`)}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleFaqClick}
            className={`block w-full py-2.5 text-left font-medium ${
              chatOpen ? 'text-cc-forest' : 'text-cc-ink'
            }`}
          >
            {t('nav.faq')}
          </button>
          <div className="pt-3 border-t border-gray-100 flex gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 text-center bg-cc-forest text-white rounded-xl font-semibold"
                >
                  {t('studentNav.dashboard')}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex-1 py-2.5 text-center border-2 border-red-400 text-red-500 rounded-xl font-semibold"
                >
                  {t('studentNav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 text-center border-2 border-cc-forest text-cc-forest rounded-xl font-semibold"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 text-center bg-cc-forest text-white rounded-xl font-semibold"
                >
                  {t('nav.signUp')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

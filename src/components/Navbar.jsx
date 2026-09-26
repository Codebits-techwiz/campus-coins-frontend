import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Moon, Sun, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';
import { Button } from './Button';
import { useApp } from '../context/AppContext';

const navLinkDefs = [
  { key: 'home', to: '/' },
  { key: 'features', to: '/features' },
  { key: 'howItWorks', to: '/how-it-works' },
  { key: 'pricing', to: '/pricing' },
  { key: 'testimonials', to: '/testimonials' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { darkMode, setDarkMode, openChat, chatOpen } = useApp();

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
          <button
            type="button"
            className="p-2 rounded-lg text-cc-forest hover:bg-cc-mint"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

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
          </div>
        </div>
      )}
    </header>
  );
}

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';

function IconX({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.717-8.739L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function IconInstagram({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconLinkedIn({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconYouTube({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186 31.247 31.247 0 000 12.017c0 2.038.197 4.026.502 5.83a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136c.305-1.804.502-3.792.502-5.83 0-2.038-.197-4.026-.502-5.831zM9.545 15.568V8.465l6.273 3.552-6.273 3.551z" />
    </svg>
  );
}

const socials = [
  { label: 'X / Twitter', href: 'https://x.com', Icon: IconX },
  { label: 'Instagram', href: 'https://instagram.com', Icon: IconInstagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: IconLinkedIn },
  { label: 'YouTube', href: 'https://youtube.com', Icon: IconYouTube },
];

const footerLinkDefs = [
  { key: 'home', to: '/' },
  { key: 'features', to: '/features' },
  { key: 'howItWorks', to: '/how-it-works' },
  { key: 'userGuide', to: '/user-guide' },
  { key: 'privacyPolicy', to: '/privacy-policy' },
  { key: 'testimonials', to: '/testimonials' },
  { key: 'sitemap', to: '/sitemap' },
  { key: 'login', to: '/login' },
  { key: 'signUp', to: '/register' },
];

export function Footer() {
  const { t } = useTranslation();
  const { openChat } = useApp();

  return (
    <footer className="bg-cc-forest text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8 mb-10">
          <div className="max-w-xs space-y-3">
            <Logo dark />
            <p className="text-sm text-white/70 leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-5 shrink-0">
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-cc-lime hover:border-cc-lime hover:text-white transition"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <nav className="flex flex-wrap items-center justify-start sm:justify-end gap-x-5 gap-y-2 text-sm text-white/80">
              {footerLinkDefs.map((l) => (
                <Link key={l.to} to={l.to} className="hover:text-cc-lime transition whitespace-nowrap">
                  {t(`nav.${l.key}`)}
                </Link>
              ))}
              <button
                type="button"
                onClick={openChat}
                className="hover:text-cc-lime transition whitespace-nowrap"
              >
                {t('nav.faq')}
              </button>
            </nav>
          </div>
        </div>

        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/50">
          <p>{t('footer.brandLine')}</p>
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}

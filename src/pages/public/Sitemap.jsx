import { Link } from 'react-router-dom';
import { Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHero } from '../../components/PageHero';
import { useApp } from '../../context/AppContext';

export default function Sitemap() {
  const { t } = useTranslation();
  const { openChat } = useApp();

  const sections = [
    {
      titleKey: 'sitemapPage.public',
      links: [
        { to: '/', labelKey: 'nav.home' },
        { to: '/features', labelKey: 'nav.features' },
        { to: '/how-it-works', labelKey: 'nav.howItWorks' },
        { to: '/user-guide', labelKey: 'nav.userGuide' },
        { to: '/privacy-policy', labelKey: 'nav.privacyPolicy' },
        { to: '/pricing', labelKey: 'nav.pricing' },
        { to: '/testimonials', labelKey: 'nav.testimonials' },
        { action: 'faq', labelKey: 'nav.faq' },
        { to: '/sitemap', labelKey: 'nav.sitemap' },
      ],
    },
    {
      titleKey: 'sitemapPage.auth',
      links: [
        { to: '/login', labelKey: 'nav.login' },
        { to: '/register', labelKey: 'nav.signUp' },
        { to: '/forgot-password', labelKey: 'auth.forgotTitle' },
        { to: '/admin-login', labelKey: 'auth.adminTitle' },
      ],
    },
    {
      titleKey: 'sitemapPage.student',
      links: [
        { to: '/app', labelKey: 'studentNav.dashboard' },
        { to: '/app/transactions', labelKey: 'studentNav.transactions' },
        { to: '/app/categories', labelKey: 'studentNav.categories' },
        { to: '/app/budgets', labelKey: 'studentNav.budgets' },
        { to: '/app/reports', labelKey: 'studentNav.reports' },
        { to: '/app/insights', labelKey: 'studentNav.insights' },
        { to: '/app/profile', labelKey: 'studentNav.profile' },
      ],
    },
    {
      titleKey: 'sitemapPage.admin',
      links: [
        { to: '/admin', label: 'Admin Dashboard' },
        { to: '/admin/users', label: 'Users' },
        { to: '/admin/categories', label: 'Categories' },
        { to: '/admin/announcements', label: 'Announcements' },
        { to: '/admin/stats', label: 'Stats' },
      ],
    },
  ];

  return (
    <div className="animate-fade-in min-h-[70vh]">
      <PageHero
        eyebrow={t('sitemapPage.eyebrow')}
        title={t('sitemapPage.title')}
        subtitle={t('sitemapPage.subtitle')}
      />

      <section className="py-16 bg-cc-mint-soft">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Map className="w-6 h-6 text-cc-lime" />
            <p className="text-sm text-cc-muted">{t('sitemapPage.hint')}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {sections.map((sec) => (
              <div key={sec.titleKey} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-cc-forest text-lg mb-4 pb-2 border-b border-cc-mint">
                  {t(sec.titleKey)}
                </h2>
                <ul className="space-y-2.5">
                  {sec.links.map((l) => (
                    <li key={l.to || l.action}>
                      {l.action === 'faq' ? (
                        <button
                          type="button"
                          onClick={openChat}
                          className="text-sm text-cc-muted hover:text-cc-lime font-medium transition flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cc-lime" />
                          {l.labelKey ? t(l.labelKey) : l.label}
                        </button>
                      ) : (
                        <Link
                          to={l.to}
                          className="text-sm text-cc-muted hover:text-cc-lime font-medium transition flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cc-lime" />
                          {l.labelKey ? t(l.labelKey) : l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

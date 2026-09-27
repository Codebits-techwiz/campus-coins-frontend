import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Wallet,
  LayoutGrid,
  Sparkles,
  BarChart3,
  Lightbulb,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Award,
  GraduationCap,
  Building2,
  CreditCard,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { PageHero } from '../../components/PageHero';
import { features as defaultFeatures } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const iconMap = {
  wallet: Wallet,
  Wallet: Wallet,
  layout: LayoutGrid,
  LayoutGrid: LayoutGrid,
  sparkles: Sparkles,
  Sparkles: Sparkles,
  chart: BarChart3,
  BarChart3: BarChart3,
  lightbulb: Lightbulb,
  Lightbulb: Lightbulb,
  smartphone: Smartphone,
  Smartphone: Smartphone,
  ShieldCheck: ShieldCheck,
  TrendingUp: TrendingUp,
  Award: Award,
  GraduationCap: GraduationCap,
  Building2: Building2,
  CreditCard: CreditCard,
  Zap: Zap,
};

export default function Features() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { siteContent } = useApp();
  const isUr = i18n.language === 'ur';

  const dynamicItems = siteContent?.features?.items;
  const itemsToRender = (!isUr && dynamicItems && dynamicItems.length > 0) ? dynamicItems : defaultFeatures;

  const eyebrow = isUr ? t('features.eyebrow') : (siteContent?.features?.badge || t('features.eyebrow'));
  const heroTitle = isUr ? t('features.title') : (siteContent?.features?.title || t('features.title'));
  const heroSubtitle = isUr ? t('features.subtitle') : (siteContent?.features?.subtitle || t('features.subtitle'));

  return (
    <div className="animate-fade-in min-h-[70vh]">
      <PageHero
        eyebrow={eyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
        cta={{ to: '/register', label: t('common.getStartedFree') }}
      />

      <section className="py-16 sm:py-20 bg-cc-mint-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsToRender.map((f, idx) => {
              const IconComponent = iconMap[f.icon] || Wallet;
              const title = f.title || (f.titleKey ? t(f.titleKey) : `Feature ${idx + 1}`);
              const desc = f.desc || (f.descKey ? t(f.descKey) : '');

              return (
                <div
                  key={f.id || idx}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-cc-lime/30 hover:-translate-y-0.5 transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cc-mint text-cc-lime flex items-center justify-center mb-4 group-hover:bg-cc-lime group-hover:text-white transition">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-cc-forest mb-2">{title}</h2>
                  <p className="text-sm text-cc-muted leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button className="!rounded-full !px-7" onClick={() => navigate('/register')}>
              {t('features.cta')} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}


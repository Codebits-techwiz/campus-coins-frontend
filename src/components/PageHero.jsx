import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export function PageHero({ eyebrow, title, subtitle, cta, variant = 'light' }) {
  const { t } = useTranslation();
  const isLight = variant === 'light';

  return (
    <div className={`relative overflow-hidden transition-colors ${
      isLight
        ? 'bg-gradient-to-b from-[#E8F5E9] via-[#F0FAF2] to-[#FAFCFB] dark:from-[#12241d] dark:via-[#162b23] dark:to-[#0f1f1a] text-cc-forest dark:text-white border-b border-[#E8F5E9] dark:border-[#2a4538]'
        : 'bg-gradient-to-br from-cc-forest via-[#0f4a38] to-cc-forest-light text-white'
    }`}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-cc-lime/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cc-forest/5 dark:bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 text-center">
        {eyebrow && (
          <span className={`inline-flex px-3.5 py-1 rounded-full text-xs font-extrabold tracking-widest uppercase mb-4 shadow-xs ${
            isLight
              ? 'bg-[#E8F5E9] dark:bg-emerald-950/80 text-cc-forest dark:text-cc-lime border border-cc-lime/30'
              : 'bg-white/10 text-cc-lime border border-white/20'
          }`}>
            {eyebrow}
          </span>
        )}
        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight ${
          isLight ? 'text-cc-forest dark:text-white' : 'text-white'
        }`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium ${
            isLight ? 'text-cc-muted dark:text-gray-300' : 'text-white/80'
          }`}>
            {subtitle}
          </p>
        )}
        {cta && (
          <div className="mt-8">
            <Link to={cta.to || '/register'}>
              <Button variant={isLight ? 'primary' : 'white'} className="!rounded-full !px-7 font-bold">
                {cta.label || t('common.getStartedFree')} <ArrowRight className="w-4 h-4 rtl:rotate-180 ltr:ml-2 rtl:mr-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

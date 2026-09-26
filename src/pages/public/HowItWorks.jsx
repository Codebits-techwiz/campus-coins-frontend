import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { PageHero } from '../../components/PageHero';
import { useApp } from '../../context/AppContext';

export default function HowItWorks() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { siteContent } = useApp();

  const defaultSteps = [
    { n: '1', title: t('howItWorks.steps.1.title'), desc: t('howItWorks.steps.1.desc') },
    { n: '2', title: t('howItWorks.steps.2.title'), desc: t('howItWorks.steps.2.desc') },
    { n: '3', title: t('howItWorks.steps.3.title'), desc: t('howItWorks.steps.3.desc') },
  ];

  const dynamicItems = siteContent?.howItWorks?.items;
  const steps = (dynamicItems && dynamicItems.length > 0)
    ? dynamicItems.map((item, idx) => ({
        n: (idx + 1).toString(),
        title: item.title,
        desc: item.desc,
      }))
    : defaultSteps;

  const eyebrow = siteContent?.howItWorks?.badge || t('howItWorks.eyebrow');
  const title = siteContent?.howItWorks?.title || t('howItWorks.title');
  const subtitle = siteContent?.howItWorks?.subtitle || t('howItWorks.subtitle');

  return (
    <div className="animate-fade-in min-h-[70vh]">
      <PageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
      />

      <section className="py-16 sm:py-20 bg-cc-mint-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {steps.map((s) => (
                  <div key={s.n} className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-cc-forest text-white font-bold flex items-center justify-center shrink-0">
                      {s.n}
                    </div>
                    <div>
                      <h2 className="font-bold text-cc-forest">{s.title}</h2>
                      <p className="text-sm text-cc-muted mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-8 !rounded-full" onClick={() => navigate('/register')}>
                {t('common.startTracking')} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-cc-lime" />
                  <span className="ml-2 text-xs text-cc-muted font-medium">{t('home.dashboardTitle')}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-cc-mint rounded-xl p-4 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-8 border-cc-lime border-t-cc-forest flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-[10px] text-cc-muted">{t('home.spent')}</p>
                        <p className="font-extrabold text-cc-forest text-sm">Rs 28,250</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-cc-muted uppercase">{t('home.recent')}</p>
                    {[t('home.txFood'), t('home.txTransport'), t('home.txAcademics')].map((r) => (
                      <div key={r} className="bg-gray-50 rounded-lg px-3 py-2 text-xs font-medium text-cc-ink">
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-2 sm:-right-6 bg-white rounded-2xl shadow-lg border border-cc-lime/30 p-4 max-w-[220px]">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-cc-lime" />
                  <span className="text-xs font-bold text-cc-forest">{t('home.aiInsightShort')}</span>
                </div>
                <p className="text-xs text-cc-muted leading-relaxed" dir="auto">
                  {t('home.aiInsightBody')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


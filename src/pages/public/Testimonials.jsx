import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHero } from '../../components/PageHero';
import { testimonials as defaultTestimonials } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const { siteContent } = useApp();
  const isUr = i18n.language === 'ur';

  const dynamicItems = siteContent?.testimonials?.items;
  const itemsToRender = (!isUr && dynamicItems && dynamicItems.length > 0) ? dynamicItems : defaultTestimonials;

  const eyebrow = isUr ? t('testimonialsPage.eyebrow') : (siteContent?.testimonials?.badge || t('testimonialsPage.eyebrow'));
  const title = isUr ? t('testimonialsPage.title') : (siteContent?.testimonials?.title || t('testimonialsPage.title'));
  const subtitle = isUr ? t('testimonialsPage.subtitle') : (siteContent?.testimonials?.subtitle || t('testimonialsPage.subtitle'));

  return (
    <div className="animate-fade-in min-h-[70vh]">
      <PageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {itemsToRender.map((item, idx) => {
              const quote = item.quote || (item.quoteKey ? t(item.quoteKey) : '');
              const name = item.name || `Student ${idx + 1}`;
              const role = item.role || (item.roleKey ? t(item.roleKey) : 'University Student');
              const avatar = item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
              const rating = item.rating || 5;

              return (
                <div
                  key={item.id || idx}
                  className="bg-cc-mint-soft/60 border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-cc-lime/30 transition flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={avatar}
                      alt={name}
                      className="w-14 h-14 rounded-full object-cover mb-4 ring-2 ring-cc-mint"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                    <p className="text-sm text-cc-muted italic leading-relaxed mb-4">
                      &ldquo;{quote}&rdquo;
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-cc-forest">{name}</p>
                    <p className="text-xs text-cc-muted mb-2">{role}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-cc-lime text-cc-lime" />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}


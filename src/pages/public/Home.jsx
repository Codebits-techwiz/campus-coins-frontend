import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ShieldCheck,
  Tags,
  Bot,
  Sparkles,
  BarChart3,
  Check,
  Zap,
  Coffee,
  BookOpen,
  GraduationCap,
  Bus,
  Lock,
  Users,
  Star,
  ChevronDown,
  Gift,
  User,
  Wallet,
  Smartphone,
  Target,
  FileText,
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { useApp } from '../../context/AppContext';
import api from '../../api';

function formatPkr(amount) {
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
}

const iconMap = {
  Wallet,
  Tags,
  Bot,
  BarChart3,
  Sparkles,
  Smartphone,
  Lock,
  ShieldCheck,
  Users,
  GraduationCap,
  Coffee,
  Bus,
  BookOpen,
};

function HeroDashboard() {
  const { t } = useTranslation();
  const txs = [
    { name: t('home.foodCanteen'), pct: 72, amt: t('home.foodCap'), color: 'bg-amber-400' },
    { name: t('home.academicsBooks'), pct: 35, amt: t('home.academicsCap'), color: 'bg-cc-lime' },
  ];

  return (
    <div className="relative w-full max-w-lg">
      <div className="rounded-3xl bg-cc-forest text-white p-6 shadow-[0_20px_50px_-15px_rgba(11,61,46,0.28)] border border-white/20">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div>
            <p className="text-[10px] uppercase font-bold text-white/60 tracking-wider">{t('home.currentBalance')}</p>
            <p className="text-2xl font-extrabold text-white tracking-tight mt-0.5">{formatPkr(34250)}</p>
          </div>
          <span className="text-[10px] font-bold text-cc-lime bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
            {t('home.activeMonth')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
            <p className="text-[9px] text-white/60 uppercase font-semibold">{t('home.monthlyIncome')}</p>
            <p className="text-sm font-extrabold text-cc-lime mt-0.5">+Rs 65,000</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
            <p className="text-[9px] text-white/60 uppercase font-semibold">{t('home.totalSpent')}</p>
            <p className="text-sm font-extrabold text-red-300 mt-0.5">-Rs 30,750</p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {txs.map((tx) => (
            <div key={tx.name} className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold">
                <span>{tx.name}</span>
                <span className="text-white/70">{tx.amt}</span>
              </div>
              <div className="h-2 bg-white/15 rounded-full overflow-hidden">
                <div className={`h-full ${tx.color} rounded-full`} style={{ width: `${tx.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2 border-t border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">{t('home.recentLogs')}</p>
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-2.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cc-mint/20 text-cc-lime flex items-center justify-center">
                <Gift className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-white">{t('home.monthlyAllowance')}</p>
                <p className="text-[9px] text-white/60">{t('home.incomeParent')}</p>
              </div>
            </div>
            <span className="font-bold text-cc-lime">+Rs 40,000</span>
          </div>
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-2.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <Coffee className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-white">{t('home.campusCafe')}</p>
                <p className="text-[9px] text-white/60">{t('home.foodAiTagged')}</p>
              </div>
            </div>
            <span className="font-bold text-red-300">-Rs 450</span>
          </div>
        </div>
      </div>

      <div className="absolute -top-4 -left-4 sm:-left-6 bg-white rounded-2xl shadow-xl border border-cc-lime/40 p-3 max-w-52 animate-float z-20">
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-4 h-4 text-cc-lime shrink-0" />
          <span className="text-[11px] font-extrabold text-cc-forest">{t('home.aiInsightLabel')}</span>
        </div>
        <p className="text-[10px] text-cc-muted leading-tight">
          {t('home.aiInsightBody')}
        </p>
      </div>

      <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 max-w-48 animate-float-alt z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-cc-mint text-cc-lime flex items-center justify-center font-bold text-xs">
            🎯
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-cc-muted">{t('home.monthlyGoal')}</p>
            <p className="text-[11px] font-bold text-cc-forest mt-0.5">{t('home.goalMet')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPreviewCard() {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  return (
    <div className="relative rounded-3xl bg-white p-6 shadow-[0_20px_50px_-15px_rgba(11,61,46,0.18)] border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cc-forest text-white font-extrabold flex items-center justify-center text-sm">
            AK
          </div>
          <div>
            <p className="text-xs text-cc-muted font-medium">{t('home.trust')}</p>
            <p className="text-sm font-bold text-cc-forest">{t('home.dashboardTitle')}</p>
          </div>
        </div>
        <span className="text-xs font-bold text-cc-forest bg-cc-mint px-3 py-1 rounded-full border border-cc-lime/30">
          {t('home.noBank')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-cc-mint-soft rounded-2xl p-4 border border-cc-mint">
          <p className="text-[10px] font-bold uppercase text-cc-muted tracking-wider">{t('home.monthlyAllowance')}</p>
          <p className="text-lg font-extrabold text-cc-forest mt-0.5">Rs 45,000</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <p className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">{t('home.monthlyGoal')}</p>
          <p className="text-lg font-extrabold text-emerald-800 mt-0.5">Rs 12,000</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-cc-muted">{t('home.recentLogs')}</p>
        {[
          { name: isUr ? 'کینٹین چائے اور سنیک' : 'Canteen Chai & Snack', cat: isUr ? 'کھانا اور کینٹین' : 'Food & Dining', amt: '-Rs 350' },
          { name: isUr ? 'سمسٹر فوٹو کاپیاں' : 'Semester Photocopies', cat: isUr ? 'پڑھائی' : 'Academics', amt: '-Rs 850' },
          { name: isUr ? 'ہاسٹل گروسری' : 'Hostel Shared Grocery', cat: isUr ? 'ہاسٹل بل' : 'Hostel Bill', amt: '-Rs 2,400' },
        ].map((tx) => (
          <div key={tx.name} className="flex items-center justify-between bg-gray-50 rounded-xl p-2.5 text-xs">
            <div>
              <p className="font-bold text-cc-forest">{tx.name}</p>
              <p className="text-[10px] text-cc-muted">{tx.cat}</p>
            </div>
            <span className="font-bold text-red-600">{tx.amt}</span>
          </div>
        ))}
      </div>

      <div className="bg-cc-forest text-white rounded-2xl p-3.5 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-cc-lime shrink-0" />
        <p className="text-xs text-white/90 leading-snug">
          <strong className="text-cc-lime">{t('home.aiInsightShort')}:</strong> {t('home.aiInsightCafe')}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [openFaq, setOpenFaq] = useState(0);
  const [siteContent, setSiteContent] = useState(null);

  const isUr = i18n.language === 'ur';

  useEffect(() => {
    const fetchSiteContent = async () => {
      try {
        const res = await api.get('/api/site-content');
        if (res.data.success && res.data.data) {
          setSiteContent(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load site content', err);
      }
    };
    fetchSiteContent();
  }, []);

  const hero = siteContent?.hero || {};
  const stats = siteContent?.stats || {};
  const madeForStudents = siteContent?.madeForStudents || {};
  const featuresData = siteContent?.features || {};
  const howItWorksData = siteContent?.howItWorks || {};
  const hustleCardsData = siteContent?.hustleCards || {};
  const trustBadgesData = siteContent?.trustBadges || {};
  const ctaBannerData = siteContent?.ctaBanner || {};

  const heroBadge = isUr ? t('home.badge') : (hero.badge || t('home.badge'));
  const heroHeadline1 = isUr ? t('home.headline1') : (hero.headline1 || t('home.headline1'));
  const heroHeadline2 = isUr ? t('home.headline2') : (hero.headline2 || t('home.headline2'));
  const heroSubtext = isUr ? t('home.sub') : (hero.subtext || t('home.sub'));
  const heroCtaPrimary = isUr ? t('common.getStartedFree') : (hero.ctaPrimary || t('common.getStartedFree'));
  const heroCtaSecondary = isUr ? t('common.seeHowItWorks') : (hero.ctaSecondary || t('common.seeHowItWorks'));

  const statsItems = isUr
    ? [
        { value: '۱۰۰٪', label: 'مفت اور کھلی رسائی' },
        { value: '۲۴/۷', label: 'اے آئی اخراجات انسائٹس' },
        { value: '۰', label: 'بینک کریڈنشلز کی ضرورت نہیں' },
        { value: '۱۰+', label: 'طلبہ کے لیے بجٹ کیٹیگریز' },
      ]
    : (stats.items || [
        { value: '100%', label: 'Free & Open Access' },
        { value: '24/7', label: 'AI Expense Insights' },
        { value: '0', label: 'Bank Credentials Needed' },
        { value: '10+', label: 'Student Budget Categories' },
      ]);

  const featuresList = isUr
    ? [
        { id: '1', title: t('features.items.track.title'), desc: t('features.items.track.desc'), icon: 'Wallet' },
        { id: '2', title: t('features.items.categories.title'), desc: t('features.items.categories.desc'), icon: 'Tags' },
        { id: '3', title: t('features.items.ai.title'), desc: t('features.items.ai.desc'), icon: 'Bot' },
        { id: '4', title: t('features.items.reports.title'), desc: t('features.items.reports.desc'), icon: 'BarChart3' },
        { id: '5', title: t('features.items.tips.title'), desc: t('features.items.tips.desc'), icon: 'Sparkles' },
        { id: '6', title: t('features.items.access.title'), desc: t('features.items.access.desc'), icon: 'Smartphone' },
      ]
    : (featuresData.items || [
        { id: '1', title: 'Track Income & Expenses', desc: 'Log allowance, gig pay, food, transport, and more in seconds. No bank account required.', icon: 'Wallet' },
        { id: '2', title: 'Smart Categories', desc: 'Student-focused categories for hostel, academics, subscriptions, and entertainment.', icon: 'Tags' },
        { id: '3', title: 'AI Assistant', desc: 'Get automatic category suggestions as you type, and override anytime.', icon: 'Bot' },
        { id: '4', title: 'Visual Reports', desc: 'See monthly trends, category breakdowns, and income vs expense at a glance.', icon: 'BarChart3' },
        { id: '5', title: 'Personalized Saving Tips', desc: 'Tips ranked by impact, based on your own history and budget goals.', icon: 'Sparkles' },
        { id: '6', title: 'Access Anywhere', desc: 'Responsive web app that works smoothly on phone, tablet, and desktop.', icon: 'Smartphone' },
      ]);

  const stepsList = isUr
    ? [
        { step: '۱', title: t('howItWorks.steps.1.title'), desc: t('howItWorks.steps.1.desc') },
        { step: '۲', title: t('howItWorks.steps.2.title'), desc: t('howItWorks.steps.2.desc') },
        { step: '۳', title: t('howItWorks.steps.3.title'), desc: t('howItWorks.steps.3.desc') },
      ]
    : (howItWorksData.steps || [
        { step: '1', title: 'Create Your Account', desc: 'Sign up with your campus email and set your monthly allowance baseline in PKR.' },
        { step: '2', title: 'Add Your Transactions', desc: 'Quick-add income and expenses. AI suggests categories as you type.' },
        { step: '3', title: 'See Your Insights', desc: 'Review charts, budgets, and plain saving tips every month.' },
      ]);

  const hustleList = isUr
    ? [
        { id: '1', title: t('home.undergrads'), desc: t('home.undergradsDesc'), tag: 'Undergrad', icon: 'GraduationCap' },
        { id: '2', title: t('home.hostel'), desc: t('home.hostelDesc'), tag: 'Hostel', icon: 'Coffee' },
        { id: '3', title: t('home.commuters'), desc: t('home.commutersDesc'), tag: 'Commute', icon: 'Bus' },
        { id: '4', title: t('home.partTimers'), desc: t('home.partTimersDesc'), tag: 'Gig Work', icon: 'BookOpen' },
      ]
    : (hustleCardsData.items || [
        { id: '1', title: 'Undergrads', desc: 'Track allowance, books, and weekend plans without the stress.', tag: 'Undergrad', icon: 'GraduationCap' },
        { id: '2', title: 'Hostel life', desc: 'Rent, laundry, shared groceries. Keep fixed costs in check.', tag: 'Hostel', icon: 'Coffee' },
        { id: '3', title: 'Commuters', desc: 'Bus passes vs ride-shares: see what actually saves money.', tag: 'Commute', icon: 'Bus' },
        { id: '4', title: 'Part-timers', desc: 'Log gig pay and scholarships next to everyday spending.', tag: 'Gig Work', icon: 'BookOpen' },
      ]);

  const trustBadgesList = isUr
    ? [
        { id: '1', title: t('home.trustNoBank'), desc: t('home.trustNoBankDesc'), icon: 'Lock' },
        { id: '2', title: t('home.trustPrivate'), desc: t('home.trustPrivateDesc'), icon: 'ShieldCheck' },
        { id: '3', title: t('home.trustStudents'), desc: t('home.trustStudentsDesc'), icon: 'Users' },
      ]
    : (trustBadgesData.items || [
        { id: '1', title: 'No bank linking', desc: 'Manual entry and optional CSV import. Your banking stays yours.', icon: 'Lock' },
        { id: '2', title: 'Private by design', desc: 'You control what is logged. Insights stay in your account.', icon: 'ShieldCheck' },
        { id: '3', title: 'Built with students', desc: 'Categories, tips, and flows shaped by real campus money habits.', icon: 'Users' },
      ]);

  const testimonialsList = isUr
    ? [
        { id: '1', name: 'علی رضا', role: t('testimonials.ali.role'), quote: t('testimonials.ali.quote'), rating: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { id: '2', name: 'سارہ احمد', role: t('testimonials.sara.role'), quote: t('testimonials.sara.quote'), rating: 5, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
        { id: '3', name: 'عمر فاروق', role: t('testimonials.omar.role'), quote: t('testimonials.omar.quote'), rating: 5, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
      ]
    : (siteContent?.testimonials?.items || [
        { id: '1', name: 'Zara Ahmed', role: 'Computer Science Student', quote: 'Campus Coin helped me manage my monthly allowance without stressing over canteen expenses.', rating: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { id: '2', name: 'Hamza Malik', role: 'Business Student', quote: 'The AI monthly insights showed me exactly how much I was spending on food delivery each week.', rating: 5, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
        { id: '3', name: 'Sania Mirza', role: 'Engineering Student', quote: 'Setting category caps for transport and books kept my savings goal on track all semester.', rating: 5, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
      ]);

  const faqList = isUr
    ? [
        { id: '1', question: t('faq.bank.q'), answer: t('faq.bank.a') },
        { id: '2', question: t('faq.ai.q'), answer: t('faq.ai.a') },
        { id: '3', question: t('faq.budgets.q'), answer: t('faq.budgets.a') },
        { id: '4', question: t('faq.admin.q'), answer: t('faq.admin.a') },
      ]
    : (siteContent?.faqs?.items || [
        { id: '1', question: 'Is Campus Coin completely free?', answer: 'Yes! Campus Coin is 100% free for all students. There are no subscription fees or premium tiers.' },
        { id: '2', question: 'Do I need to link my bank account?', answer: 'No bank linking required. You can manually log transactions or upload CSV exports safely and privately.' },
        { id: '3', question: 'How do AI monthly insights work?', answer: 'Our system analyzes your expense patterns and generates personalized tips and budget advisories to help you save.' },
        { id: '4', question: 'Can I export my financial data?', answer: 'Yes, you can export your monthly reports as PDF or PNG images anytime.' },
      ]);

  return (
    <div className="animate-fade-in">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-br from-cc-mint-soft via-cc-cream to-cc-mint pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="absolute top-20 right-0 w-96 h-96 bg-cc-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cc-forest/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-6 text-center lg:text-left relative z-10">
            <span className="inline-flex items-center gap-2 bg-cc-mint text-cc-forest text-xs font-bold px-4 py-1.5 rounded-full border border-cc-lime/30">
              <Sparkles className="w-3.5 h-3.5 text-cc-lime" /> {heroBadge}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.15] tracking-tight">
              <span className="text-cc-forest">{heroHeadline1}</span>{' '}
              <span className="text-cc-lime">{heroHeadline2}</span>
            </h1>
            <p className="text-cc-muted text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {heroSubtext}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Button onClick={() => navigate('/register')} className="rounded-full! px-7! py-3.5! w-full sm:w-auto">
                {heroCtaPrimary} <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full! px-7! py-3.5! w-full sm:w-auto"
                onClick={() => navigate('/how-it-works')}
              >
                {heroCtaSecondary}
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-4 text-xs sm:text-sm text-cc-muted font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cc-lime" /> {t('home.noBank')}
              </div>
              <div className="flex items-center gap-2">
                <Tags className="w-4 h-4 text-cc-lime" /> {t('home.studentCats')}
              </div>
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cc-lime" /> {t('home.aiInsights')}
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end items-center overflow-visible px-2 sm:px-4">
            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* 2. MARQUEE SECTION */}
      <section className="border-y border-gray-100 bg-white py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-cc-muted">
            {t('home.trust')}
          </p>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="campus-marquee flex w-max animate-marquee gap-x-12 sm:gap-x-16 font-extrabold text-lg sm:text-xl tracking-tight whitespace-nowrap hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, loop) => (
              <div key={loop} className="flex items-center gap-x-12 sm:gap-x-16 shrink-0 px-6">
                {(isUr ? ['الاؤنس ٹریکنگ', 'ہاسٹل اخراجات مینیجمنٹ', 'اے آئی ایڈوائزری', 'پرسنل کیمپس فنانس'] : (stats.partners || ['Student Allowance Tracking', 'Hostel Expense Management', 'AI Spending Advisory', 'Personal Campus Finance'])).map((name) => (
                  <span key={`${loop}-${name}`} className="campus-marquee-item transition">
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STATS SECTION */}
      <section className="py-14 bg-cc-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
          {stats.disclaimer && (
            <p className="text-xs font-bold uppercase tracking-widest text-cc-lime mb-2">
              {stats.disclaimer}
            </p>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {statsItems.map((s, idx) => (
              <div key={idx}>
                <p className="text-3xl sm:text-4xl font-extrabold text-cc-lime">{s.value}</p>
                <p className="text-sm text-white/65 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MADE FOR STUDENTS SECTION */}
      <section className="py-20 lg:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <DashboardPreviewCard />
          </div>
          <div className="order-1 lg:order-2 space-y-5">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">
              {isUr ? t('home.madeFor') : (madeForStudents.eyebrow || t('home.madeFor'))}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest leading-tight">
              {isUr ? t('home.allowanceTitle') : (madeForStudents.title || t('home.allowanceTitle'))}
            </h2>
            <p className="text-cc-muted leading-relaxed text-base sm:text-lg">
              {isUr ? t('home.allowanceBody') : (madeForStudents.description || t('home.allowanceBody'))}
            </p>
            <ul className="space-y-3">
              {(isUr ? [t('home.bullet1'), t('home.bullet2'), t('home.bullet3')] : (madeForStudents.bullets || [
                'Categories that match real campus life',
                'Budgets that warn you before you overspend',
                'Tips written like a friend, not a bank',
              ])).map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-cc-ink font-medium">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-cc-mint text-cc-lime flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Button className="rounded-full! mt-2" onClick={() => navigate('/register')}>
              {t('common.createFreeAccount')} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 5. FEATURES GRID */}
      <section id="features" className="py-20 bg-cc-mint-soft scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">
              {isUr ? t('home.featuresEyebrow') : (featuresData.eyebrow || t('home.featuresEyebrow'))}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">
              {isUr ? t('home.featuresTitle') : (featuresData.title || t('home.featuresTitle'))}
            </h2>
            <p className="text-cc-muted mt-3">
              {isUr ? t('home.featuresSub') : (featuresData.subtitle || t('home.featuresSub'))}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((f) => {
              const Icon = iconMap[f.icon] || Wallet;
              return (
                <div
                  key={f.id || f.title}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-cc-lime/30 transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cc-mint text-cc-lime flex items-center justify-center mb-4 group-hover:bg-cc-lime group-hover:text-white transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-cc-forest mb-2">{f.title}</h3>
                  <p className="text-sm text-cc-muted leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">
                {isUr ? t('home.howEyebrow') : (howItWorksData.eyebrow || t('home.howEyebrow'))}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2 mb-8">
                {isUr ? t('home.howTitle') : (howItWorksData.title || t('home.howTitle'))}
              </h2>
              <div className="space-y-6">
                {stepsList.map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-cc-forest text-white font-bold flex items-center justify-center shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-cc-forest">{s.title}</h3>
                      <p className="text-sm text-cc-muted mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-8 rounded-full!" onClick={() => navigate('/register')}>
                {t('common.startTracking')} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(11,61,46,0.18)] border border-gray-100 p-5 overflow-hidden">
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
                        <p className="font-extrabold text-cc-forest">Rs 28,250</p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-cc-forest mt-2">{t('home.spendingOverview')}</p>
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
              <div className="absolute -bottom-4 -right-2 sm:-right-6 bg-white rounded-2xl shadow-lg border border-cc-lime/30 p-4 max-w-55 animate-float">
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

      {/* 7. HUSTLE CARDS SECTION */}
      <section id="for-you" className="py-20 bg-cc-mint-soft scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">
              {isUr ? t('home.forYouEyebrow') : (hustleCardsData.eyebrow || t('home.forYouEyebrow'))}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">
              {isUr ? t('home.forYouTitle') : (hustleCardsData.title || t('home.forYouTitle'))}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {hustleList.map((item) => {
              const Icon = iconMap[item.icon] || BookOpen;
              return (
                <div key={item.title} className="group relative overflow-hidden rounded-2xl bg-cc-forest p-6 text-white min-h-[200px] flex flex-col justify-between shadow-md hover:shadow-xl transition">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-cc-lime flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-xs text-white/75 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. TRUST BADGES SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {trustBadgesList.map((item) => {
              const Icon = iconMap[item.icon] || ShieldCheck;
              return (
                <div key={item.title} className="text-center px-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-cc-mint text-cc-lime flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-cc-forest text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-cc-muted leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 bg-cc-mint-soft scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">{t('testimonialsPage.eyebrow')}</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">{t('testimonialsPage.title')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonialsList.map((item, idx) => (
              <div key={item.id || idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <img src={item.avatar} alt={item.name} className="w-14 h-14 rounded-full object-cover mb-4 ring-2 ring-cc-mint" />
                <p className="text-sm text-cc-muted italic leading-relaxed mb-4">&ldquo;{item.quote}&rdquo;</p>
                <p className="font-bold text-cc-forest">{item.name}</p>
                <p className="text-xs text-cc-muted mb-2">{item.role}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-cc-lime text-cc-lime" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. SINGLE CONSOLIDATED CTA BANNER */}
      <section className="relative h-95 sm:h-105 overflow-hidden bg-cc-forest">
        <div className="absolute inset-0 bg-linear-to-br from-cc-forest via-[#0d4534] to-[#082a20]" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold max-w-2xl leading-tight">
            {isUr ? t('home.ctaTitle') : (ctaBannerData.title || t('home.ctaTitle'))}
          </h2>
          <p className="mt-4 text-white/80 max-w-lg">
            {isUr ? t('home.ctaSub') : (ctaBannerData.subtext || t('home.ctaSub'))}
          </p>
          <Button variant="white" className="rounded-full! px-8! mt-8" onClick={() => navigate('/register')}>
            {isUr ? t('home.joinCampus') : (ctaBannerData.buttonText || t('home.joinCampus'))} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* 11. FAQ SECTION */}
      <section id="faq" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">{t('faqPage.eyebrow')}</span>
            <h2 className="text-3xl font-extrabold text-cc-forest mt-2">{t('faqPage.title')}</h2>
          </div>
          <div className="space-y-3">
            {faqList.map((item, i) => (
              <div key={item.id || i} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-cc-forest"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  {item.question}
                  <ChevronDown className={`w-5 h-5 text-cc-lime transition ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-cc-muted leading-relaxed animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

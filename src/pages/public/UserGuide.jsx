import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  Shield,
  Sparkles,
  Wallet,
  PieChart,
  Target,
  ArrowRight,
  Search,
  Zap,
  Lightbulb,
  GraduationCap,
  Home,
  Bus,
  Laptop,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHero } from '../../components/PageHero';
import { Button } from '../../components/Button';

const GUIDE_SECTIONS = [
  {
    id: 'getting-started',
    title: '1. Quick Start & Setup',
    icon: Wallet,
    summary: 'Set up your student profile and baseline monthly allowance in PKR.',
    steps: [
      {
        title: 'Sign Up with Campus Email',
        desc: 'Create your account using your email, select your academic year, and accept the Privacy Policy.',
      },
      {
        title: 'Set Monthly Allowance',
        desc: 'Enter your monthly budget baseline (e.g. PKR 40,000 allowance or pocket money).',
      },
      {
        title: 'Define Savings Goal',
        desc: 'Set a target savings goal (e.g. PKR 10,000) so Campus Coin can track your monthly progress.',
      },
    ],
  },
  {
    id: 'logging-transactions',
    title: '2. Logging Expenses & Income',
    icon: Zap,
    summary: 'Track every rupee spent or earned in seconds without linking bank accounts.',
    steps: [
      {
        title: 'Quick Add Button',
        desc: 'Tap "+ Add Transaction" on your dashboard to open the fast entry form.',
      },
      {
        title: 'AI Category Autocomplete',
        desc: 'Type "Canteen biryani" or "Hostel rent", and our AI automatically selects the best category.',
      },
      {
        title: 'Categorize & Save',
        desc: 'Choose whether it is Income (Allowance/Gig) or Expense, add an optional note, and save.',
      },
    ],
  },
  {
    id: 'budgets-alerts',
    title: '3. Smart Budgets & Overspend Alerts',
    icon: Target,
    summary: 'Set limits on food delivery, entertainment, or hostel expenses before midterms.',
    steps: [
      {
        title: 'Create Category Budgets',
        desc: 'Assign maximum spending limits in PKR for specific categories (e.g. PKR 12,000 for Food).',
      },
      {
        title: 'Visual Progress Bars',
        desc: 'Monitor real-time progress bars that turn amber at 80% and red when exceeded.',
      },
      {
        title: 'In-App Alerts',
        desc: 'Receive proactive alerts on your dashboard when nearing category spending limits.',
      },
    ],
  },
  {
    id: 'reports-ai-tips',
    title: '4. Visual Reports & AI Saving Tips',
    icon: PieChart,
    summary: 'Gain clarity into income vs expenses with pie charts, monthly trends, and plain-English tips.',
    steps: [
      {
        title: 'Monthly Breakdown',
        desc: 'View income vs expense charts and interactive category pie charts under the Reports tab.',
      },
      {
        title: 'Personalized AI Tips',
        desc: 'Get smart suggestions like "Food delivery rose 40%. Capping weekly orders saves PKR 3,500."',
      },
      {
        title: 'Bookmark & Pin Tips',
        desc: 'Save important savings tips or insights to your Bookmarks tab for exam week reference.',
      },
    ],
  },
];

const USE_CASES = [
  {
    title: 'Hostel Resident',
    icon: Home,
    bg: 'bg-emerald-50 text-emerald-600',
    desc: 'Keep rent, laundry, shared mess bills, and weekend takeaways organized under specific category caps.',
  },
  {
    title: 'Commuter Student',
    icon: Bus,
    bg: 'bg-blue-50 text-blue-600',
    desc: 'Compare daily van fares vs ride-shares to calculate monthly transport savings in PKR.',
  },
  {
    title: 'Allowance & Pocket Money Manager',
    icon: GraduationCap,
    bg: 'bg-purple-50 text-purple-600',
    desc: 'Never run out of money mid-semester. Track pocket money distribution day by day.',
  },
  {
    title: 'Gig Worker & Freelancer',
    icon: Laptop,
    bg: 'bg-amber-50 text-amber-600',
    desc: 'Log irregular freelance income, tutoring fees, and scholarships alongside regular expenses.',
  },
];

const FAQS = [
  {
    q: 'Do I need to connect my bank account to Campus Coin?',
    a: 'No! Campus Coin is 100% bank-free. You log transactions manually or import CSV files, keeping your credentials totally safe.',
  },
  {
    q: 'Is my financial data stored securely in PKR?',
    a: 'Yes. All data is encrypted and tied exclusively to your account. We never share or sell personal information.',
  },
  {
    q: 'Can I use Campus Coin in Urdu?',
    a: 'Absolutely! Campus Coin supports full bilingual toggle between English and Urdu (اردو) anytime from the top navigation bar.',
  },
];

export default function UserGuide() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isUr = i18n.language === 'ur';

  const guideSections = [
    {
      id: 'getting-started',
      title: isUr ? '۱. فوری شروعات اور سیٹ اپ' : '1. Quick Start & Setup',
      icon: Wallet,
      summary: isUr ? 'پی کے آر میں اپنا سٹوڈنٹ پروفائل اور ماہانہ الاؤنس سیٹ کریں۔' : 'Set up your student profile and baseline monthly allowance in PKR.',
      steps: [
        {
          title: isUr ? 'کیمپس ای میل سے سائن اَپ' : 'Sign Up with Campus Email',
          desc: isUr ? 'اپنے ای میل سے اکاؤنٹ بنائیں، تعلیمی سال منتخب کریں اور پرائیویسی پالیسی قبول کریں۔' : 'Create your account using your email, select your academic year, and accept the Privacy Policy.',
        },
        {
          title: isUr ? 'ماہانہ الاؤنس درج کریں' : 'Set Monthly Allowance',
          desc: isUr ? 'اپنا ماہانہ الاؤنس یا جیب خرچ درج کریں (مثلاً ۴۰،۰۰۰ روپے)۔' : 'Enter your monthly budget baseline (e.g. PKR 40,000 allowance or pocket money).',
        },
        {
          title: isUr ? 'بچت کا ہدف منتخب کریں' : 'Define Savings Goal',
          desc: isUr ? 'ماہانہ بچت کا ہدف سیٹ کریں تاکہ کیمپس کوائن آپ کی پیشرفت دیکھ سکے۔' : 'Set a target savings goal (e.g. PKR 10,000) so Campus Coin can track your monthly progress.',
        },
      ],
    },
    {
      id: 'logging-transactions',
      title: isUr ? '۲. آمدنی اور اخراجات درج کرنا' : '2. Logging Expenses & Income',
      icon: Zap,
      summary: isUr ? 'بینک اکاؤنٹ لنک کیے بغیر ہر روپیہ سیکنڈز میں ٹریک کریں۔' : 'Track every rupee spent or earned in seconds without linking bank accounts.',
      steps: [
        {
          title: isUr ? 'فوری شامل کرنے کا بٹن' : 'Quick Add Button',
          desc: isUr ? 'ڈیش بورڈ پر "+ ٹرانزیکشن شامل کریں" پر کلک کریں۔' : 'Tap "+ Add Transaction" on your dashboard to open the fast entry form.',
        },
        {
          title: isUr ? 'اے آئی کیٹیگری کی تجویز' : 'AI Category Autocomplete',
          desc: isUr ? '"کینٹین بریانی" یا "ہاسٹل کرایہ" لکھیں، اے آئی آپ کے لیے کیٹیگری منتخب کرے گا۔' : 'Type "Canteen biryani" or "Hostel rent", and our AI automatically selects the best category.',
        },
        {
          title: isUr ? 'کیٹیگری منتخب اور محفوظ کریں' : 'Categorize & Save',
          desc: isUr ? 'آمدنی یا خرچ منتخب کریں، نوٹ شامل کریں اور محفوظ کریں۔' : 'Choose whether it is Income (Allowance/Gig) or Expense, add an optional note, and save.',
        },
      ],
    },
    {
      id: 'budgets-alerts',
      title: isUr ? '۳. سمارٹ بجٹس اور الرٹس' : '3. Smart Budgets & Overspend Alerts',
      icon: Target,
      summary: isUr ? 'امتحانات سے پہلے فوڈ ڈیلیوری یا ہاسٹل خرچ پر حدود لگائیں۔' : 'Set limits on food delivery, entertainment, or hostel expenses before midterms.',
      steps: [
        {
          title: isUr ? 'کیٹیگری بجٹ بنائیں' : 'Create Category Budgets',
          desc: isUr ? 'مخصوص کیٹیگریز پر پی کے آر میں حد لگائیں (مثلاً ۱۲،۰۰۰ روپے کھانے پر)۔' : 'Assign maximum spending limits in PKR for specific categories (e.g. PKR 12,000 for Food).',
        },
        {
          title: isUr ? 'بصری پیشرفت بارز' : 'Visual Progress Bars',
          desc: isUr ? '۸۰٪ پر پیلی اور حد سے تجاوز پر سرخ ہونے والی بارز دیکھیں۔' : 'Monitor real-time progress bars that turn amber at 80% and red when exceeded.',
        },
        {
          title: isUr ? 'ایپ الرٹس' : 'In-App Alerts',
          desc: isUr ? 'حد کے قریب پہنچنے پر ڈیش بورڈ پر بروقت خبردار رہیں۔' : 'Receive proactive alerts on your dashboard when nearing category spending limits.',
        },
      ],
    },
    {
      id: 'reports-ai-tips',
      title: isUr ? '۴. بصری رپورٹس اور اے آئی ٹپس' : '4. Visual Reports & AI Saving Tips',
      icon: PieChart,
      summary: isUr ? 'پائی چارٹس اور آسان ٹپس سے آمدنی بمقابلہ اخراجات واضح دیکھیں۔' : 'Gain clarity into income vs expenses with pie charts, monthly trends, and plain-English tips.',
      steps: [
        {
          title: isUr ? 'ماہانہ جائزہ' : 'Monthly Breakdown',
          desc: isUr ? 'رپورٹس ٹیب میں آمدنی اور اخراجات کا چارٹ اور کیٹیگری بریک ڈاؤن دیکھیں۔' : 'View income vs expense charts and interactive category pie charts under the Reports tab.',
        },
        {
          title: isUr ? 'ذاتی اے آئی ٹپس' : 'Personalized AI Tips',
          desc: isUr ? 'سمارٹ تجاویز پائیں جیسے "فوڈ ڈیلیوری ۴۰٪ بڑھ گئی۔ ۳،۵۰۰ روپے بچائیں۔"' : 'Get smart suggestions like "Food delivery rose 40%. Capping weekly orders saves PKR 3,500."',
        },
        {
          title: isUr ? 'ٹپس پن اور بک مارک کریں' : 'Bookmark & Pin Tips',
          desc: isUr ? 'اہم ٹپس کو بک مارکس میں امتحان کے ہفتے کے لیے محفوظ کریں۔' : 'Save important savings tips or insights to your Bookmarks tab for exam week reference.',
        },
      ],
    },
  ];

  const useCases = [
    {
      title: isUr ? 'ہاسٹل کے طلبہ' : 'Hostel Resident',
      icon: Home,
      desc: isUr ? 'کرایہ، لانڈری اور مشترکہ گروسری کے اخراجات منظم رکھیں۔' : 'Keep rent, laundry, shared mess bills, and weekend takeaways organized under specific category caps.',
    },
    {
      title: isUr ? 'سفر کرنے والے طلبہ' : 'Commuter Student',
      icon: Bus,
      desc: isUr ? 'بس پاس اور رائیڈ شیئرز کا موازنہ کر کے ماہانہ بچت کا حساب لگائیں۔' : 'Compare daily van fares vs ride-shares to calculate monthly transport savings in PKR.',
    },
    {
      title: isUr ? 'الاؤنس مینیجر' : 'Allowance & Pocket Money Manager',
      icon: GraduationCap,
      desc: isUr ? 'سمسٹر کے درمیان جیب خرچ ختم نہ ہونے دیں۔' : 'Never run out of money mid-semester. Track pocket money distribution day by day.',
    },
    {
      title: isUr ? 'پارٹ ٹائم یا فری لانسر' : 'Gig Worker & Freelancer',
      icon: Laptop,
      desc: isUr ? 'فری لانس آمدنی اور اسکالرشپ روزمرہ اخراجات کے ساتھ لاگ کریں۔' : 'Log irregular freelance income, tutoring fees, and scholarships alongside regular expenses.',
    },
  ];

  const faqs = [
    {
      q: isUr ? 'کیا بینک اکاؤنٹ جوڑنا ضروری ہے؟' : 'Do I need to connect my bank account to Campus Coin?',
      a: isUr ? 'نہیں۔ کیمپس کوائن ۱۰۰٪ بینک فری ہے۔ آپ دستی ٹرانزیکشنز یا سی ایس وی امپورٹ استعمال کر سکتے ہیں۔' : 'No! Campus Coin is 100% bank-free. You log transactions manually or import CSV files, keeping your credentials totally safe.',
    },
    {
      q: isUr ? 'کیا میرا ڈیٹا پی کے آر میں محفوظ ہے؟' : 'Is my financial data stored securely in PKR?',
      a: isUr ? 'ہاں، تمام ڈیٹا انکرپٹڈ ہے اور صرف آپ کے اکاؤنٹ تک محدود ہے۔' : 'Yes. All data is encrypted and tied exclusively to your account. We never share or sell personal information.',
    },
    {
      q: isUr ? 'کیا میں اردو میں استعمال کر سکتا ہوں؟' : 'Can I use Campus Coin in Urdu?',
      a: isUr ? 'جی بالکل! اوپر نیویگیشن بار سے کسی بھی وقت انگریزی اور اردو کے درمیان سوئچ کریں۔' : 'Absolutely! Campus Coin supports full bilingual toggle between English and Urdu anytime from the top navigation bar.',
    },
  ];

  const [activeTab, setActiveTab] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = guideSections.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.steps.some(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="animate-fade-in min-h-[70vh] pb-16">
      <PageHero
        eyebrow={isUr ? 'رہنمائی اور مدد' : 'Documentation & Help'}
        title={isUr ? 'کیمپس کوائن یوزر گائیڈ' : 'Campus Coin User Guide'}
        subtitle={
          isUr
            ? 'الاؤنس سنبھالنے، بجٹ بنانے اور اے آئی ٹپس استعمال کرنے کے لیے سب کچھ۔'
            : 'Everything you need to master your student allowance, set budgets, log expenses in PKR, and use AI tips.'
        }
      />

      {/* Floating Sleek Search Bar */}
      <section className="-mt-7 sm:-mt-8 max-w-2xl mx-auto px-4 relative z-20">
        <div className="bg-white rounded-full shadow-xl border border-gray-100 p-2 sm:p-2.5 flex items-center gap-3 ring-1 ring-black/5 transition-all focus-within:ring-2 focus-within:ring-cc-lime">
          <div className="w-10 h-10 rounded-full bg-cc-mint text-cc-forest flex items-center justify-center shrink-0 ltr:ml-1 rtl:mr-1">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isUr ? 'تلاش کریں (مثلاً بجٹ، الاؤنس، اے آئی ٹپس)...' : 'Search guide topics (e.g. budgets, allowance, AI tips, PKR)...'}
            className="w-full bg-transparent border-none outline-none text-sm font-medium text-cc-forest placeholder-gray-400 text-start px-1"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-cc-muted hover:text-cc-forest px-3 py-1.5 rounded-full bg-gray-100 transition shrink-0 ltr:mr-1 rtl:ml-1"
            >
              {isUr ? 'صاف کریں' : 'Clear'}
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 text-center text-xs font-semibold text-cc-muted">
            {isUr ? `"${searchQuery}" کے لیے نتائج` : `Showing topics matching "${searchQuery}"`}
          </div>
        )}
      </section>

      {/* Quick Stats Strip (Matching Home Page dark green banner bar) */}
      <section className="mt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cc-forest text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md border border-cc-forest-light grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-extrabold text-cc-lime">100%</div>
            <div className="text-xs text-white/80 font-medium">{isUr ? 'بینک فری اور محفوظ' : 'Bank-Free & Secure'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-extrabold text-cc-lime">24/7</div>
            <div className="text-xs text-white/80 font-medium">{isUr ? 'اے آئی بجٹ اسسٹنٹ' : 'AI Budget Helper'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-extrabold text-cc-lime">PKR</div>
            <div className="text-xs text-white/80 font-medium">{isUr ? 'مقامیت پر مبنی لاگنگ' : 'Localized PKR Tracking'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-extrabold text-cc-lime">10+</div>
            <div className="text-xs text-white/80 font-medium">{isUr ? 'طلبہ کیٹیگریز' : 'Student Categories'}</div>
          </div>
        </div>
      </section>

      {/* Main Guide Content */}
      <section className="mt-10 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
            {guideSections.map((sec) => {
              const Icon = sec.icon;
              const isSelected = activeTab === sec.id && !searchQuery;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveTab(sec.id);
                    setSearchQuery('');
                  }}
                  className={`group relative p-5 sm:p-6 rounded-2xl text-start transition-all duration-200 border flex flex-col justify-between h-full min-h-[140px] cursor-pointer ${
                    isSelected
                      ? 'bg-white text-cc-forest border-cc-lime shadow-md ring-2 ring-cc-lime/40 -translate-y-0.5'
                      : 'bg-white text-cc-forest border-gray-100 hover:border-cc-lime/40 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className={`p-2.5 rounded-xl border transition ${
                      isSelected
                        ? 'bg-cc-mint text-cc-forest border-cc-lime/40'
                        : 'bg-cc-mint text-cc-forest border-cc-lime/20 group-hover:bg-cc-lime/10'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cc-mint text-cc-forest border border-cc-lime/40 shadow-xs">
                        {isUr ? 'فعال' : 'Active'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base leading-snug text-cc-forest">
                      {sec.title}
                    </h3>
                    <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed text-cc-muted">
                      {sec.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Guide Section Display */}
          {filteredSections.map((sec) => {
            if (!searchQuery && sec.id !== activeTab) return null;
            const Icon = sec.icon;
            return (
              <div
                key={sec.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 lg:p-10 space-y-8 animate-fade-in"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-cc-mint text-cc-forest border border-cc-lime/30 shrink-0">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="text-start">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-cc-forest tracking-tight">
                        {sec.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-cc-muted mt-1 font-medium">
                        {sec.summary}
                      </p>
                    </div>
                  </div>
                  <div className="self-start sm:self-center shrink-0">
                    <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-cc-mint text-cc-forest border border-cc-lime/30">
                      {isUr ? '۳ آسان مراحل' : '3 Step Guide'}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                  {sec.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-cc-mint-soft border border-cc-mint hover:border-cc-lime/50 hover:shadow-md transition space-y-3 flex flex-col justify-start text-start h-full"
                    >
                      <div className="w-9 h-9 rounded-xl bg-cc-lime/20 text-cc-forest font-black text-sm flex items-center justify-center shrink-0 border border-cc-lime/30">
                        0{idx + 1}
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-cc-forest leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-cc-muted leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredSections.length === 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-cc-muted mx-auto" />
              <h3 className="text-lg font-bold text-cc-forest">
                {isUr ? 'کوئی نتائج نہیں ملے' : 'No matching guide topics found'}
              </h3>
              <p className="text-xs text-cc-muted max-w-sm mx-auto">
                {isUr ? 'براہ کرم کوئی دوسرا لفظ تلاش کریں یا سرچ بار صاف کریں۔' : 'Try searching for different keywords like "budget", "allowance", or "reports".'}
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-bold px-4 py-2 rounded-xl bg-cc-forest text-white hover:bg-cc-forest-light transition"
              >
                {isUr ? 'تمام گائیڈز دیکھیں' : 'View All Guides'}
              </button>
            </div>
          )}

          {/* Student Use Cases Grid (Solid Dark Forest Green Cards matching Home.jsx "Whatever your campus hustle looks like" section) */}
          <div className="space-y-6 pt-4">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-cc-mint text-cc-forest border border-cc-lime/30 inline-block">
                {isUr ? 'آپ کے لیے خاص' : 'Tailored For You'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-cc-forest tracking-tight">
                {isUr ? 'کیمپس کوائن آپ کے لائف سٹائل کے ساتھ کیسے چلتا ہے' : 'How Campus Coin Fits Your Student Lifestyle'}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {useCases.map((uc) => {
                const Icon = uc.icon;
                return (
                  <div
                    key={uc.title}
                    className="p-6 rounded-2xl bg-cc-forest text-white border border-cc-forest-light shadow-md hover:border-cc-lime hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between text-start h-full"
                  >
                    <div>
                      <div className="p-3 rounded-xl w-fit mb-4 bg-white/10 text-cc-lime border border-white/15">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base text-white mb-2 leading-snug">
                        {uc.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                        {uc.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 lg:p-10 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 rounded-xl bg-cc-mint text-cc-forest border border-cc-lime/30 shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-cc-forest text-start tracking-tight">
                {isUr ? 'عام سوالات و جوابات' : 'Frequently Asked User Questions'}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-cc-mint-soft space-y-3 flex flex-col justify-start text-start h-full border border-cc-mint hover:border-cc-lime/40 transition"
                >
                  <h3 className="font-bold text-sm sm:text-base text-cc-forest leading-snug">
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-cc-muted leading-relaxed font-normal">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner (Matching Home Page bottom dark banner) */}
          <div className="bg-cc-forest rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden border border-cc-forest-light">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cc-lime/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-2 text-center md:text-start max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {isUr ? 'کیمپس پیسے کا کنٹرول سنبھالنے کے لیے تیار؟' : 'Ready to take control of your campus money?'}
              </h2>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                {isUr ? 'مفت اکاؤنٹ بنائیں، پرائیویسی پالیسی قبول کریں اور آج ہی پی کے آر الاؤنس ٹریک کریں۔' : 'Create your free account, accept the Privacy Policy, and start tracking your PKR allowance today.'}
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center justify-center md:justify-end gap-3 shrink-0">
              <Button
                onClick={() => navigate('/register')}
                className="!rounded-full h-12 !px-7 flex items-center justify-center font-bold text-sm shadow-lg !bg-white !text-cc-forest hover:!bg-cc-mint"
              >
                {t('common.createFreeAccount')} <ArrowRight className="w-4 h-4 rtl:rotate-180 ltr:ml-2 rtl:mr-2 text-cc-forest" />
              </Button>
              <Link
                to="/privacy-policy"
                className="h-12 px-6 rounded-full border border-white/30 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition flex items-center justify-center"
              >
                {t('nav.privacyPolicy')}
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

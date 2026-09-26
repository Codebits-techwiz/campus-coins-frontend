import { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  BarChart3,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  Layout,
  Tag,
  ShieldCheck,
  Layers,
  Heart,
  Palette,
  Upload,
  RotateCcw,
  Info,
  Coins,
  GraduationCap,
  Wallet,
  TrendingUp,
  Building2,
  CreditCard,
  Award,
} from 'lucide-react';
import api from '../../api';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';

export default function AdminSiteContent() {
  const { showToast, refreshSiteContent } = useApp();
  const [activeTab, setActiveTab] = useState('branding');
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(null);

  const [brandingData, setBrandingData] = useState({
    logoText: 'CampusCoin',
    logoImageUrlLight: '',
    logoImageUrlDark: '',
    logoImageUrl: '',
    faviconEmoji: '🪙',
  });

  const [heroData, setHeroData] = useState({
    badge: '',
    headline1: '',
    headline2: '',
    subtext: '',
    ctaPrimary: '',
    ctaSecondary: '',
  });

  const [statsData, setStatsData] = useState({
    disclaimer: '',
    items: [],
    partners: [],
  });

  const [madeForStudentsData, setMadeForStudentsData] = useState({
    eyebrow: 'Made for students',
    title: '',
    description: '',
    bullets: [],
  });

  const [featuresData, setFeaturesData] = useState({
    eyebrow: 'Features',
    title: '',
    subtitle: '',
    items: [],
  });

  const [howItWorksData, setHowItWorksData] = useState({
    eyebrow: 'How It Works',
    title: '',
    steps: [],
  });

  const [hustleCardsData, setHustleCardsData] = useState({
    eyebrow: 'Made for you',
    title: '',
    items: [],
  });

  const [trustBadgesData, setTrustBadgesData] = useState({
    items: [],
  });

  const [ctaBannerData, setCtaBannerData] = useState({
    title: '',
    subtext: '',
    buttonText: '',
  });

  const [testimonialsData, setTestimonialsData] = useState({
    items: [],
  });

  const [faqsData, setFaqsData] = useState({
    items: [],
  });

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/site-content');
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        if (d.branding) setBrandingData(d.branding);
        if (d.hero) setHeroData(d.hero);
        if (d.stats) setStatsData(d.stats);
        if (d.madeForStudents) setMadeForStudentsData(d.madeForStudents);
        if (d.features) setFeaturesData(d.features);
        if (d.howItWorks) setHowItWorksData(d.howItWorks);
        if (d.hustleCards) setHustleCardsData(d.hustleCards);
        if (d.trustBadges) setTrustBadgesData(d.trustBadges);
        if (d.ctaBanner) setCtaBannerData(d.ctaBanner);
        if (d.testimonials) setTestimonialsData(d.testimonials);
        if (d.faqs) setFaqsData(d.faqs);
      }
    } catch (err) {
      console.error('Failed to load site content', err);
      showToast('Failed to load site content', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const saveSection = async (section, dataPayload) => {
    setSavingSection(section);
    try {
      const res = await api.put(`/api/admin/site-content/${section}`, dataPayload);
      if (res.data.success) {
        showToast(`'${section}' section saved successfully!`, 'success');
        if (refreshSiteContent) refreshSiteContent();
      }
    } catch (err) {
      console.error(`Failed to save ${section}`, err);
      showToast(err.response?.data?.error || `Failed to save ${section}`, 'error');
    }
    setSavingSection(null);
  };

  const handleLogoFileUpload = (e, targetKey) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Logo image file must be under 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result;
      if (base64Url) {
        setBrandingData((prev) => ({
          ...prev,
          [targetKey]: base64Url,
          ...(targetKey === 'logoImageUrlLight' && !prev.logoImageUrlDark ? { logoImageUrlDark: base64Url } : {}),
        }));
        showToast('Logo image uploaded successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // List Item Add & Remove Handlers for Dynamic Sections
  const addStatItem = () => {
    setStatsData((prev) => ({
      ...prev,
      items: [...prev.items, { value: '100%', label: 'New Metric' }],
    }));
  };
  const removeStatItem = (index) => {
    setStatsData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const addFeatureItem = () => {
    setFeaturesData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: `f_${Date.now()}`, title: 'New Feature', desc: 'Feature description details.', icon: 'Sparkles' },
      ],
    }));
  };
  const removeFeatureItem = (index) => {
    setFeaturesData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const addHowItWorksStep = () => {
    setHowItWorksData((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        { step: String(prev.steps.length + 1), title: 'New Step Title', desc: 'Step instructions.' },
      ],
    }));
  };
  const removeHowItWorksStep = (index) => {
    setHowItWorksData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index).map((s, idx) => ({ ...s, step: String(idx + 1) })),
    }));
  };

  const addHustleCard = () => {
    setHustleCardsData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: `h_${Date.now()}`, title: 'New Campus Persona', desc: 'Description of student persona.', tag: 'Student', icon: 'GraduationCap' },
      ],
    }));
  };
  const removeHustleCard = (index) => {
    setHustleCardsData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const addTrustBadge = () => {
    setTrustBadgesData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: `t_${Date.now()}`, title: 'New Trust Highlight', desc: 'Privacy & security feature.', icon: 'ShieldCheck' },
      ],
    }));
  };
  const removeTrustBadge = (index) => {
    setTrustBadgesData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const addTestimonialItem = () => {
    setTestimonialsData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `t_${Date.now()}`,
          name: 'New Student',
          role: 'University Student',
          quote: 'Campus Coin helped me track my expenses effortlessly!',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
      ],
    }));
  };
  const removeTestimonialItem = (index) => {
    setTestimonialsData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const addFaqItem = () => {
    setFaqsData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: `faq_${Date.now()}`, question: 'New Question?', answer: 'Answer explanation text.' },
      ],
    }));
  };
  const removeFaqItem = (index) => {
    setFaqsData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const tabs = [
    { id: 'branding', label: 'Branding & Logo', icon: Palette },
    { id: 'hero', label: 'Hero Banner', icon: Sparkles },
    { id: 'stats', label: 'Stats Counter', icon: BarChart3 },
    { id: 'madeForStudents', label: 'Made For Students', icon: Heart },
    { id: 'features', label: 'Features Grid', icon: Tag },
    { id: 'howItWorks', label: 'How It Works', icon: Layers },
    { id: 'hustleCards', label: 'Hustle Cards', icon: Layout },
    { id: 'trustBadges', label: 'Trust Badges', icon: ShieldCheck },
    { id: 'ctaBanner', label: 'CTA Banner', icon: MessageSquare },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-cc-lime" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner & Navigation */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-cc-forest tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-cc-lime shrink-0" />
            Landing Page Content Editor
          </h1>
          <p className="text-xs sm:text-sm text-cc-muted mt-1">
            Manage and customize all live content sections for the public Home page dynamically.
          </p>
        </div>

        {/* Single Navigation Tab Bar */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-cc-forest text-white shadow-md ring-2 ring-cc-lime/30'
                      : 'bg-gray-50/80 text-cc-muted hover:bg-gray-100 hover:text-cc-forest border border-gray-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cc-lime' : 'text-cc-muted'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB 1: BRANDING */}
      {activeTab === 'branding' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-cc-forest flex items-center gap-2">
                <Palette className="w-5 h-5 text-cc-lime" />
                Branding & Dynamic Logo Editor
              </h2>
              <p className="text-xs text-cc-muted">
                Configure application logo text, upload custom logo images, or pick professional vector brand icons for your presentation.
              </p>
            </div>
            <Button onClick={() => saveSection('branding', brandingData)} disabled={savingSection === 'branding'}>
              {savingSection === 'branding' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Branding
            </Button>
          </div>

          {/* User-Friendly Quick Guide */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-start gap-2.5">
              <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm text-emerald-950">How to customize your logo for event demo:</span>
                <span className="text-emerald-800">
                  You can <strong>Upload an Image file</strong> (PNG, SVG, JPG) directly from your computer, <strong>Select a Professional Vector Badge</strong>, or <strong>Paste a Web Image URL</strong>.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setBrandingData({
                  logoText: 'CampusCoin',
                  logoImageUrlLight: '',
                  logoImageUrlDark: '',
                  logoImageUrl: '',
                  faviconEmoji: 'Coins',
                })
              }
              className="px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold transition flex items-center gap-1.5 shrink-0 border border-emerald-200/60 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Default Coin Logo
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Logo Text */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-cc-muted">Logo Brand Text</label>
              <input
                type="text"
                value={brandingData.logoText}
                onChange={(e) => setBrandingData({ ...brandingData, logoText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime font-extrabold text-cc-forest"
                placeholder="CampusCoin"
              />
              <p className="text-[11px] text-cc-muted">Leave as "CampusCoin" for default green/lime brand styling.</p>
            </div>

            {/* Professional Vector Brand Icon Selector */}
            <div className="space-y-2 sm:col-span-2 bg-gray-50/60 border border-gray-200/80 rounded-2xl p-4">
              <label className="block text-xs font-bold uppercase text-cc-forest tracking-wider">
                Select Professional Vector Brand Badge
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {[
                  { id: 'Coins', label: 'Default Coin', icon: Coins },
                  { id: 'GraduationCap', label: 'Academic', icon: GraduationCap },
                  { id: 'Wallet', label: 'Allowance', icon: Wallet },
                  { id: 'ShieldCheck', label: 'Security', icon: ShieldCheck },
                  { id: 'Sparkles', label: 'AI Advisor', icon: Sparkles },
                  { id: 'TrendingUp', label: 'Savings', icon: TrendingUp },
                  { id: 'Building2', label: 'Campus', icon: Building2 },
                  { id: 'CreditCard', label: 'Student Card', icon: CreditCard },
                  { id: 'Award', label: 'Honor Badge', icon: Award },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  const isSelected =
                    brandingData.faviconEmoji === item.id ||
                    (item.id === 'Coins' && (!brandingData.faviconEmoji || brandingData.faviconEmoji === '🪙'));
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBrandingData({ ...brandingData, faviconEmoji: item.id })}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-cc-forest text-white border-cc-forest shadow-md ring-2 ring-cc-lime/40'
                          : 'bg-white text-cc-forest border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <ItemIcon className={`w-6 h-6 mb-1 ${isSelected ? 'text-cc-lime' : 'text-cc-forest'}`} />
                      <span className="text-[10px] font-bold tracking-tight text-center truncate w-full">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-cc-muted">
                Choose a vector brand badge preset for clean, event-ready presentation rendering.
              </p>
            </div>

            {/* Light Mode Logo File / URL */}
            <div className="space-y-2 sm:col-span-1 bg-gray-50/70 border border-gray-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-cc-forest">Light Mode Custom Logo</label>
                {(brandingData.logoImageUrlLight || brandingData.logoImageUrl) && (
                  <button
                    type="button"
                    onClick={() => setBrandingData({ ...brandingData, logoImageUrlLight: '', logoImageUrl: '' })}
                    className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove Custom Logo
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-cc-forest hover:bg-cc-forest/90 text-white text-xs font-bold transition flex items-center gap-2 shrink-0 shadow-xs">
                  <Upload className="w-4 h-4 text-cc-lime" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLogoFileUpload(e, 'logoImageUrlLight')}
                  />
                </label>
                <input
                  type="text"
                  value={brandingData.logoImageUrlLight || brandingData.logoImageUrl || ''}
                  onChange={(e) =>
                    setBrandingData({
                      ...brandingData,
                      logoImageUrlLight: e.target.value,
                      logoImageUrl: e.target.value,
                    })
                  }
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-cc-lime bg-white"
                  placeholder="Or paste image URL (https://...)"
                />
              </div>
              <p className="text-[11px] text-cc-muted">
                Used on Navbar and Light Mode backgrounds. Supports uploaded PNG, SVG, JPG or Image URL.
              </p>
            </div>

            {/* Dark Mode Logo File / URL */}
            <div className="space-y-2 sm:col-span-1 bg-gray-900/90 text-white border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-gray-300">Dark Mode Custom Logo</label>
                {brandingData.logoImageUrlDark && (
                  <button
                    type="button"
                    onClick={() => setBrandingData({ ...brandingData, logoImageUrlDark: '' })}
                    className="text-[11px] font-bold text-red-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove Custom Logo
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-2 shrink-0 border border-white/20">
                  <Upload className="w-4 h-4 text-cc-lime" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLogoFileUpload(e, 'logoImageUrlDark')}
                  />
                </label>
                <input
                  type="text"
                  value={brandingData.logoImageUrlDark || ''}
                  onChange={(e) => setBrandingData({ ...brandingData, logoImageUrlDark: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-700 text-xs focus:outline-none focus:border-cc-lime bg-gray-800 text-white placeholder:text-gray-500"
                  placeholder="Or paste image URL (https://...)"
                />
              </div>
              <p className="text-[11px] text-gray-400">
                Used on Footer and Dark Mode backgrounds. Defaults to Light Mode logo if left empty.
              </p>
            </div>
          </div>

          {/* Real-time Logo Previews */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase text-cc-forest tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cc-lime" />
                Live Logo Previews
              </h3>
              <span className="text-[11px] text-cc-muted font-semibold">Updates instantly in Navbar & Footer</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] font-bold uppercase text-cc-muted tracking-widest">Light Background (Navbar / Light Mode)</span>
                <div className="p-4 bg-white rounded-xl shadow-xs border border-gray-100 w-full flex items-center justify-center min-h-[70px]">
                  <Logo dark={false} branding={brandingData} size="md" />
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Dark Background (Footer / Dark Mode)</span>
                <div className="p-4 bg-cc-forest rounded-xl shadow-xs border border-white/10 w-full flex items-center justify-center min-h-[70px]">
                  <Logo dark={true} branding={brandingData} size="md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HERO */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-cc-forest">Hero Section Content</h2>
              <p className="text-xs text-cc-muted">Edit headlines, badge tag, and main call-to-action text.</p>
            </div>
            <Button onClick={() => saveSection('hero', heroData)} disabled={savingSection === 'hero'}>
              {savingSection === 'hero' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Hero Section
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Top Badge Text</label>
              <input
                type="text"
                value={heroData.badge}
                onChange={(e) => setHeroData({ ...heroData, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Headline Part 1 (Dark)</label>
                <input
                  type="text"
                  value={heroData.headline1}
                  onChange={(e) => setHeroData({ ...heroData, headline1: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Headline Part 2 (Green Highlight)</label>
                <input
                  type="text"
                  value={heroData.headline2}
                  onChange={(e) => setHeroData({ ...heroData, headline2: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Subtext Narrative</label>
              <textarea
                rows={3}
                value={heroData.subtext}
                onChange={(e) => setHeroData({ ...heroData, subtext: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Primary CTA Button Label</label>
                <input
                  type="text"
                  value={heroData.ctaPrimary}
                  onChange={(e) => setHeroData({ ...heroData, ctaPrimary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Secondary CTA Button Label</label>
                <input
                  type="text"
                  value={heroData.ctaSecondary}
                  onChange={(e) => setHeroData({ ...heroData, ctaSecondary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STATS */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-cc-forest">Stats Counter & Marquee</h2>
              <p className="text-xs text-cc-muted">Edit metrics, disclaimers, and campus feature marquee items.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addStatItem}
                className="px-3.5 py-2 rounded-xl bg-cc-forest hover:bg-cc-forest/90 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-cc-lime" /> Add Stat Metric
              </button>
              <Button onClick={() => saveSection('stats', statsData)} disabled={savingSection === 'stats'}>
                {savingSection === 'stats' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Stats Section
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Stats Section Disclaimer / Header</label>
              <input
                type="text"
                value={statsData.disclaimer}
                onChange={(e) => setStatsData({ ...statsData, disclaimer: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase text-cc-forest">Stat Metric Cards</label>
                <span className="text-xs text-cc-muted font-bold">{statsData.items.length} Metrics Total</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {statsData.items.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase text-cc-muted tracking-wider">Metric #{i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeStatItem(i)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => {
                          const updated = [...statsData.items];
                          updated[i].value = e.target.value;
                          setStatsData({ ...statsData, items: updated });
                        }}
                        className="w-28 px-3 py-2 rounded-lg border border-gray-200 text-sm font-extrabold text-cc-forest bg-white"
                        placeholder="e.g. 100%"
                      />
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...statsData.items];
                          updated[i].label = e.target.value;
                          setStatsData({ ...statsData, items: updated });
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                        placeholder="Metric Label"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addStatItem}
                className="w-full mt-4 py-3.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-cc-lime hover:bg-emerald-50/40 text-cc-forest text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-cc-lime" /> Add New Stat Metric Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MADE FOR STUDENTS */}
      {activeTab === 'madeForStudents' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-cc-forest">Made For Students Section</h2>
              <p className="text-xs text-cc-muted">Edit narrative, headline, and check-list bullets.</p>
            </div>
            <Button onClick={() => saveSection('madeForStudents', madeForStudentsData)} disabled={savingSection === 'madeForStudents'}>
              {savingSection === 'madeForStudents' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Section
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Eyebrow Tag</label>
              <input
                type="text"
                value={madeForStudentsData.eyebrow}
                onChange={(e) => setMadeForStudentsData({ ...madeForStudentsData, eyebrow: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Headline</label>
              <input
                type="text"
                value={madeForStudentsData.title}
                onChange={(e) => setMadeForStudentsData({ ...madeForStudentsData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Description Narrative</label>
              <textarea
                rows={3}
                value={madeForStudentsData.description}
                onChange={(e) => setMadeForStudentsData({ ...madeForStudentsData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FEATURES GRID */}
      {activeTab === 'features' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-cc-forest">Features Grid</h2>
              <p className="text-xs text-cc-muted">Edit section title and feature cards.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addFeatureItem}
                className="px-3.5 py-2 rounded-xl bg-cc-forest hover:bg-cc-forest/90 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-cc-lime" /> Add Feature Card
              </button>
              <Button onClick={() => saveSection('features', featuresData)} disabled={savingSection === 'features'}>
                {savingSection === 'features' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Features Grid
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={featuresData.eyebrow}
                  onChange={(e) => setFeaturesData({ ...featuresData, eyebrow: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Title</label>
                <input
                  type="text"
                  value={featuresData.title}
                  onChange={(e) => setFeaturesData({ ...featuresData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuresData.items.map((item, idx) => (
                <div key={item.id || idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-cc-muted tracking-wider">Feature #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFeatureItem(idx)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...featuresData.items];
                      updated[idx].title = e.target.value;
                      setFeaturesData({ ...featuresData, items: updated });
                    }}
                    placeholder="Feature Title"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-cc-forest bg-white"
                  />
                  <textarea
                    rows={2}
                    value={item.desc}
                    onChange={(e) => {
                      const updated = [...featuresData.items];
                      updated[idx].desc = e.target.value;
                      setFeaturesData({ ...featuresData, items: updated });
                    }}
                    placeholder="Feature Description"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-cc-muted bg-white"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addFeatureItem}
              className="w-full mt-4 py-3.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-cc-lime hover:bg-emerald-50/40 text-cc-forest text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-cc-lime" /> Add New Feature Card
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: HOW IT WORKS */}
      {activeTab === 'howItWorks' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-cc-forest">How It Works ({howItWorksData.steps.length} Steps)</h2>
              <p className="text-xs text-cc-muted">Edit step titles and instructions.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addHowItWorksStep}
                className="px-3.5 py-2 rounded-xl bg-cc-forest hover:bg-cc-forest/90 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-cc-lime" /> Add Step
              </button>
              <Button onClick={() => saveSection('howItWorks', howItWorksData)} disabled={savingSection === 'howItWorks'}>
                {savingSection === 'howItWorks' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Steps
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {howItWorksData.steps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-cc-forest text-white font-bold flex items-center justify-center shrink-0">
                  {step.step}
                </span>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const updated = [...howItWorksData.steps];
                      updated[idx].title = e.target.value;
                      setHowItWorksData({ ...howItWorksData, steps: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-cc-forest"
                  />
                  <input
                    type="text"
                    value={step.desc}
                    onChange={(e) => {
                      const updated = [...howItWorksData.steps];
                      updated[idx].desc = e.target.value;
                      setHowItWorksData({ ...howItWorksData, steps: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-cc-muted"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: HUSTLE CARDS */}
      {activeTab === 'hustleCards' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-cc-forest">Campus Hustle Cards</h2>
              <p className="text-xs text-cc-muted">Edit titles and descriptions for student personas.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addHustleCard}
                className="px-3.5 py-2 rounded-xl bg-cc-forest hover:bg-cc-forest/90 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-cc-lime" /> Add Persona Card
              </button>
              <Button onClick={() => saveSection('hustleCards', hustleCardsData)} disabled={savingSection === 'hustleCards'}>
                {savingSection === 'hustleCards' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Hustle Cards
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {hustleCardsData.items.map((card, idx) => (
                <div key={card.id || idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={card.tag || ''}
                      onChange={(e) => {
                        const updated = [...hustleCardsData.items];
                        updated[idx].tag = e.target.value;
                        setHustleCardsData({ ...hustleCardsData, items: updated });
                      }}
                      placeholder="Tag (e.g. Undergrad)"
                      className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeHustleCard(idx)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const updated = [...hustleCardsData.items];
                      updated[idx].title = e.target.value;
                      setHustleCardsData({ ...hustleCardsData, items: updated });
                    }}
                    placeholder="Persona Title"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-cc-forest bg-white"
                  />
                  <textarea
                    rows={2}
                    value={card.desc}
                    onChange={(e) => {
                      const updated = [...hustleCardsData.items];
                      updated[idx].desc = e.target.value;
                      setHustleCardsData({ ...hustleCardsData, items: updated });
                    }}
                    placeholder="Persona Narrative"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-cc-muted bg-white"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addHustleCard}
              className="w-full mt-4 py-3.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-cc-lime hover:bg-emerald-50/40 text-cc-forest text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-cc-lime" /> Add New Campus Persona Card
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: TRUST BADGES */}
      {activeTab === 'trustBadges' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-cc-forest">Trust & Privacy Badges</h2>
              <p className="text-xs text-cc-muted">Edit security highlights.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addTrustBadge}
                className="px-3.5 py-2 rounded-xl bg-cc-forest hover:bg-cc-forest/90 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-cc-lime" /> Add Trust Badge
              </button>
              <Button onClick={() => saveSection('trustBadges', trustBadgesData)} disabled={savingSection === 'trustBadges'}>
                {savingSection === 'trustBadges' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Trust Badges
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              {trustBadgesData.items.map((badge, idx) => (
                <div key={badge.id || idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-cc-muted tracking-wider">Badge #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeTrustBadge(idx)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={badge.title}
                    onChange={(e) => {
                      const updated = [...trustBadgesData.items];
                      updated[idx].title = e.target.value;
                      setTrustBadgesData({ ...trustBadgesData, items: updated });
                    }}
                    placeholder="Badge Title"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-cc-forest bg-white"
                  />
                  <textarea
                    rows={2}
                    value={badge.desc}
                    onChange={(e) => {
                      const updated = [...trustBadgesData.items];
                      updated[idx].desc = e.target.value;
                      setTrustBadgesData({ ...trustBadgesData, items: updated });
                    }}
                    placeholder="Security details"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-cc-muted bg-white"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addTrustBadge}
              className="w-full mt-4 py-3.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-cc-lime hover:bg-emerald-50/40 text-cc-forest text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-cc-lime" /> Add New Trust Badge
            </button>
          </div>
        </div>
      )}

      {/* TAB 9: CTA BANNER */}
      {activeTab === 'ctaBanner' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-cc-forest">CTA Banner Section</h2>
              <p className="text-xs text-cc-muted">Edit call-to-action banner headline and button text.</p>
            </div>
            <Button onClick={() => saveSection('ctaBanner', ctaBannerData)} disabled={savingSection === 'ctaBanner'}>
              {savingSection === 'ctaBanner' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save CTA Banner
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Banner Headline</label>
              <input
                type="text"
                value={ctaBannerData.title}
                onChange={(e) => setCtaBannerData({ ...ctaBannerData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Subtext Narrative</label>
              <textarea
                rows={2}
                value={ctaBannerData.subtext}
                onChange={(e) => setCtaBannerData({ ...ctaBannerData, subtext: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-cc-muted mb-1">Button Text</label>
              <input
                type="text"
                value={ctaBannerData.buttonText}
                onChange={(e) => setCtaBannerData({ ...ctaBannerData, buttonText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cc-lime"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-cc-forest">Student Testimonials</h2>
              <p className="text-xs text-cc-muted">Manage real student quotes, roles, and ratings.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addTestimonialItem}
                className="px-3.5 py-2 rounded-xl bg-cc-forest hover:bg-cc-forest/90 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-cc-lime" /> Add Testimonial
              </button>
              <Button onClick={() => saveSection('testimonials', testimonialsData)} disabled={savingSection === 'testimonials'}>
                {savingSection === 'testimonials' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Testimonials
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {testimonialsData.items.map((item, idx) => (
              <div key={item.id || idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cc-forest uppercase">Testimonial #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeTestimonialItem(idx)}
                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-cc-muted mb-1">Student Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const updated = [...testimonialsData.items];
                        updated[idx].name = e.target.value;
                        setTestimonialsData({ ...testimonialsData, items: updated });
                      }}
                      placeholder="Student Name"
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-cc-forest bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-cc-muted mb-1">Role / Major</label>
                    <input
                      type="text"
                      value={item.role}
                      onChange={(e) => {
                        const updated = [...testimonialsData.items];
                        updated[idx].role = e.target.value;
                        setTestimonialsData({ ...testimonialsData, items: updated });
                      }}
                      placeholder="Role (e.g. Computer Science Student)"
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-cc-muted mb-1">Student Quote</label>
                  <textarea
                    rows={2}
                    value={item.quote}
                    onChange={(e) => {
                      const updated = [...testimonialsData.items];
                      updated[idx].quote = e.target.value;
                      setTestimonialsData({ ...testimonialsData, items: updated });
                    }}
                    placeholder="Student Quote"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-cc-muted bg-white"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTestimonialItem}
              className="w-full mt-4 py-3.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-cc-lime hover:bg-emerald-50/40 text-cc-forest text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-cc-lime" /> Add New Testimonial Quote
            </button>
          </div>
        </div>
      )}

      {/* TAB 11: FAQS */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-cc-forest">Frequently Asked Questions</h2>
              <p className="text-xs text-cc-muted">Edit questions and answers shown in accordion.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addFaqItem}
                className="px-3.5 py-2 rounded-xl bg-cc-forest hover:bg-cc-forest/90 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-cc-lime" /> Add FAQ
              </button>
              <Button onClick={() => saveSection('faqs', faqsData)} disabled={savingSection === 'faqs'}>
                {savingSection === 'faqs' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save FAQs
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {faqsData.items.map((item, idx) => (
              <div key={item.id || idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-cc-muted tracking-wider">FAQ #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFaqItem(idx)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => {
                    const updated = [...faqsData.items];
                    updated[idx].question = e.target.value;
                    setFaqsData({ ...faqsData, items: updated });
                  }}
                  placeholder="Question text"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-cc-forest bg-white"
                />
                <textarea
                  rows={2}
                  value={item.answer}
                  onChange={(e) => {
                    const updated = [...faqsData.items];
                    updated[idx].answer = e.target.value;
                    setFaqsData({ ...faqsData, items: updated });
                  }}
                  placeholder="Answer explanation"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-cc-muted bg-white"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addFaqItem}
              className="w-full mt-4 py-3.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-cc-lime hover:bg-emerald-50/40 text-cc-forest text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-cc-lime" /> Add New FAQ Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

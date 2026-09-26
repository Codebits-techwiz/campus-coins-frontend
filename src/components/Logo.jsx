import { useContext, useState, useEffect } from 'react';
import {
  Coins,
  GraduationCap,
  Wallet,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Building2,
  CreditCard,
  Award,
} from 'lucide-react';
import AppContext from '../context/AppContext';

const ICON_MAP = {
  GraduationCap,
  '🎓': GraduationCap,
  Wallet,
  '⚡': Wallet,
  CreditCard,
  '💳': CreditCard,
  ShieldCheck,
  '🛡️': ShieldCheck,
  Sparkles,
  '✨': Sparkles,
  TrendingUp,
  '📈': TrendingUp,
  Building2,
  '🏛️': Building2,
  Award,
  '🏆': Award,
};

export function Logo({ className = '', dark = false, size = 'md', branding = null }) {
  const ctx = useContext(AppContext);
  const activeBranding = branding || ctx?.branding;

  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' };
  const uid = dark ? 'logoDark' : 'logoLight';

  const logoText = activeBranding?.logoText || 'CampusCoin';
  const logoImageUrlLight = activeBranding?.logoImageUrlLight || activeBranding?.logoImageUrl || '';
  const logoImageUrlDark = activeBranding?.logoImageUrlDark || activeBranding?.logoImageUrl || activeBranding?.logoImageUrlLight || '';
  const activeLogoImageUrl = dark ? logoImageUrlDark : logoImageUrlLight;
  const faviconEmoji = activeBranding?.faviconEmoji || '';

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [activeLogoImageUrl]);

  let iconNode = null;
  if (activeLogoImageUrl && !imageError) {
    iconNode = (
      <img
        src={activeLogoImageUrl}
        alt={logoText}
        onError={() => setImageError(true)}
        className={`${sizes[size]} object-contain relative shrink-0`}
      />
    );
  } else if (faviconEmoji && faviconEmoji !== '🪙' && faviconEmoji !== 'Coins' && ICON_MAP[faviconEmoji]) {
    const VectorIcon = ICON_MAP[faviconEmoji];
    iconNode = (
      <div
        className={`${sizes[size]} rounded-xl bg-gradient-to-br ${
          dark ? 'from-emerald-500 to-teal-800 text-cc-lime' : 'from-cc-forest to-emerald-900 text-cc-lime'
        } flex items-center justify-center shadow-xs shrink-0 border border-white/20 p-2`}
      >
        <VectorIcon className="w-full h-full object-contain" />
      </div>
    );
  } else if (faviconEmoji && faviconEmoji !== '🪙' && faviconEmoji !== 'Coins' && !ICON_MAP[faviconEmoji] && faviconEmoji.length <= 2) {
    iconNode = (
      <span className={`${sizes[size]} flex items-center justify-center text-2xl relative shrink-0`}>
        {faviconEmoji}
      </span>
    );
  } else {
    iconNode = (
      <div className={`${sizes[size]} relative shrink-0 drop-shadow-sm`}>
        <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden>
          <defs>
            <linearGradient id={`${uid}-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE566" />
              <stop offset="45%" stopColor="#F5C518" />
              <stop offset="100%" stopColor="#C9A012" />
            </linearGradient>
            <linearGradient id={`${uid}-face`} x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor={dark ? '#6BC86B' : '#145A43'} />
              <stop offset="100%" stopColor={dark ? '#3D9B3D' : '#0B3D2E'} />
            </linearGradient>
            <linearGradient id={`${uid}-shine`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          <circle cx="24" cy="24" r="22" fill={`url(#${uid}-rim)`} />
          <circle cx="24" cy="24" r="17.5" fill={`url(#${uid}-face)`} />
          <circle
            cx="24"
            cy="24"
            r="15.2"
            fill="none"
            stroke={dark ? 'rgba(255,255,255,0.22)' : 'rgba(245,197,24,0.45)'}
            strokeWidth="1.2"
          />
          <path
            d="M28.8 16.2c-1.1-.7-2.4-1.1-3.8-1.1-4.2 0-7.6 3.2-7.6 7.2s3.4 7.2 7.6 7.2c1.4 0 2.7-.4 3.8-1.1"
            fill="none"
            stroke="#F5C518"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M32.2 18.4c-.85-.55-1.85-.85-2.95-.85-3.25 0-5.9 2.45-5.9 5.55s2.65 5.55 5.9 5.55c1.1 0 2.1-.3 2.95-.85"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.92"
          />
          <circle cx="33.5" cy="24.1" r="2.1" fill="#F5C518" />
          <circle cx="33.5" cy="24.1" r="1" fill="#0B3D2E" />
          <ellipse cx="18" cy="16" rx="8" ry="5" fill={`url(#${uid}-shine)`} />
        </svg>
      </div>
    );
  }

  // Format text logo: if "CampusCoin", split to "Campus" + "Coin" with lime highlight
  let textNode = null;
  if (logoText.toLowerCase() === 'campuscoin') {
    textNode = (
      <>
        Campus
        <span className="text-cc-lime">Coin</span>
      </>
    );
  } else {
    textNode = logoText;
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {iconNode}
      <span
        className={`${textSizes[size]} font-extrabold tracking-tight ${
          dark ? 'text-white' : 'text-cc-forest'
        }`}
      >
        {textNode}
      </span>
    </div>
  );
}


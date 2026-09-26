import React from 'react';
import {
  Utensils, Car, Home, BookOpen, Gamepad2, ShoppingBag, Wallet, Plane,
  Smartphone, Shirt, Gift, HeartPulse, GraduationCap, Coffee, Zap, Wifi,
  PiggyBank, TrendingUp, Tag, Briefcase
} from 'lucide-react';

export const iconMap = {
  utensils: Utensils,
  car: Car,
  home: Home,
  "book-open": BookOpen,
  "gamepad-2": Gamepad2,
  "shopping-bag": ShoppingBag,
  wallet: Wallet,
  plane: Plane,
  smartphone: Smartphone,
  shirt: Shirt,
  gift: Gift,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  coffee: Coffee,
  zap: Zap,
  wifi: Wifi,
  "piggy-bank": PiggyBank,
  "trending-up": TrendingUp,
  tag: Tag,
  briefcase: Briefcase
};

export const PRESET_COLORS = [
  '#4ade80', // green
  '#3b82f6', // blue
  '#f97316', // orange
  '#ef4444', // red
  '#a855f7', // purple
  '#0ea5e9', // sky
  '#eab308', // yellow
  '#14b8a6', // teal
  '#f43f5e', // rose
  '#6366f1'  // indigo
];

export const CategoryIcon = ({ iconKey, color, className = "w-4 h-4" }) => {
  const IconComponent = iconMap[iconKey] || Tag;
  const safeColor = color || '#6B7280';
  
  return (
    <div 
      className="flex items-center justify-center shrink-0 rounded-lg"
      style={{ 
        backgroundColor: `${safeColor}20`, 
        color: safeColor,
        width: '36px',
        height: '36px'
      }}
    >
      <IconComponent className={className} strokeWidth={2.5} />
    </div>
  );
};

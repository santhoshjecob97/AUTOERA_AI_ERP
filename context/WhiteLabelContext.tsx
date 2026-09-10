import React, { createContext, useContext, useState, useEffect } from 'react';

export type BrandPreset = 'autoera' | 'tata' | 'hyundai' | 'mahindra' | 'luxury';

export interface BrandTheme {
  id: BrandPreset;
  name: string;
  oemGroup: string;
  logoUrl: string;
  primaryColor: string;
  primaryHover: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

export const BRAND_PRESETS: Record<BrandPreset, BrandTheme> = {
  autoera: {
    id: 'autoera',
    name: 'AutoEra AI Standard',
    oemGroup: 'Multi-Brand Platform',
    logoUrl: '/assets/autoera-ai-logo.png',
    primaryColor: '#f97316',
    primaryHover: '#ea580c',
    accentColor: '#fb923c',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    badgeText: '#fb923c',
  },
  tata: {
    id: 'tata',
    name: 'Tata Motors Network',
    oemGroup: 'Tata Passenger Electric Mobility',
    logoUrl: '/assets/autoera-ai-logo.png',
    primaryColor: '#0284c7',
    primaryHover: '#0369a1',
    accentColor: '#38bdf8',
    badgeBg: 'rgba(2, 132, 199, 0.15)',
    badgeText: '#38bdf8',
  },
  hyundai: {
    id: 'hyundai',
    name: 'Hyundai Mobility Network',
    oemGroup: 'Hyundai Motor India',
    logoUrl: '/assets/autoera-ai-logo.png',
    primaryColor: '#0d9488',
    primaryHover: '#0f766e',
    accentColor: '#2dd4bf',
    badgeBg: 'rgba(13, 148, 136, 0.15)',
    badgeText: '#2dd4bf',
  },
  mahindra: {
    id: 'mahindra',
    name: 'Mahindra Auto Rise',
    oemGroup: 'Mahindra & Mahindra Ltd',
    logoUrl: '/assets/autoera-ai-logo.png',
    primaryColor: '#e11d48',
    primaryHover: '#be123c',
    accentColor: '#fb7185',
    badgeBg: 'rgba(225, 29, 72, 0.15)',
    badgeText: '#fb7185',
  },
  luxury: {
    id: 'luxury',
    name: 'Apex Luxury Syndicate',
    oemGroup: 'Apex Global Imports',
    logoUrl: '/assets/autoera-ai-logo.png',
    primaryColor: '#d97706',
    primaryHover: '#b45309',
    accentColor: '#fbbf24',
    badgeBg: 'rgba(217, 119, 6, 0.15)',
    badgeText: '#fbbf24',
  },
};

interface WhiteLabelContextType {
  currentBrand: BrandTheme;
  preset: BrandPreset;
  setPreset: (preset: BrandPreset) => void;
  availablePresets: BrandTheme[];
}

const WhiteLabelContext = createContext<WhiteLabelContextType | undefined>(undefined);

export const WhiteLabelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preset, setPresetState] = useState<BrandPreset>(() => {
    return (localStorage.getItem('autoera_brand_preset') as BrandPreset) || 'autoera';
  });

  const currentBrand = BRAND_PRESETS[preset] || BRAND_PRESETS.autoera;

  const setPreset = (newPreset: BrandPreset) => {
    setPresetState(newPreset);
    localStorage.setItem('autoera_brand_preset', newPreset);
  };

  useEffect(() => {
    // Inject dynamic CSS variables into document root
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', currentBrand.primaryColor);
    root.style.setProperty('--brand-primary-hover', currentBrand.primaryHover);
    root.style.setProperty('--brand-accent', currentBrand.accentColor);
    root.style.setProperty('--brand-badge-bg', currentBrand.badgeBg);
    root.style.setProperty('--brand-badge-text', currentBrand.badgeText);
  }, [currentBrand]);

  return (
    <WhiteLabelContext.Provider
      value={{
        currentBrand,
        preset,
        setPreset,
        availablePresets: Object.values(BRAND_PRESETS),
      }}
    >
      {children}
    </WhiteLabelContext.Provider>
  );
};

export const useWhiteLabel = (): WhiteLabelContextType => {
  const context = useContext(WhiteLabelContext);
  if (!context) {
    throw new Error('useWhiteLabel must be used within a WhiteLabelProvider');
  }
  return context;
};

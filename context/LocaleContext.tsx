import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLocale = 'en' | 'hi' | 'ta' | 'te' | 'ar';
export type SupportedCurrency = 'INR' | 'AED' | 'USD';

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  defaultCurrency: SupportedCurrency;
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleInfo> = {
  en: {
    code: 'en',
    name: 'English (India & Global)',
    nativeName: 'English',
    dir: 'ltr',
    defaultCurrency: 'INR',
  },
  hi: {
    code: 'hi',
    name: 'Hindi (National)',
    nativeName: 'हिन्दी',
    dir: 'ltr',
    defaultCurrency: 'INR',
  },
  ta: {
    code: 'ta',
    name: 'Tamil (Chennai / TN)',
    nativeName: 'தமிழ்',
    dir: 'ltr',
    defaultCurrency: 'INR',
  },
  te: {
    code: 'te',
    name: 'Telugu (AP / Telangana)',
    nativeName: 'తెలుగు',
    dir: 'ltr',
    defaultCurrency: 'INR',
  },
  ar: {
    code: 'ar',
    name: 'Arabic (UAE / GCC Expansion)',
    nativeName: 'العربية',
    dir: 'rtl',
    defaultCurrency: 'AED',
  },
};

export const DICTIONARY: Record<SupportedLocale, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    salesEngine: 'Sales Engine',
    serviceEngine: 'Service Engine',
    aiCopilot: 'AI Copilot Hub',
    financeEngine: 'Finance Engine',
    insuranceEngine: 'Insurance Engine',
    fleetTelemetry: 'Fleet Telemetry',
    evIntelligence: 'EV Intelligence',
    oemPortal: 'OEM Portal',
    developerPortal: 'Developer Portal',
    workforce: 'Workforce Engine',
    plans: 'Plans & Pricing',
    signOut: 'Sign Out',
    search: 'Search (Cmd+K)...',
    activeBays: 'Active Bays',
    liveTelemetry: 'Live Telemetry',
    warrantyDefects: 'Warranty Defects',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    salesEngine: 'बिक्री इंजन',
    serviceEngine: 'सेवा इंजन',
    aiCopilot: 'एआई कोपायलट हब',
    financeEngine: 'वित्त इंजन',
    insuranceEngine: 'बीमा इंजन',
    fleetTelemetry: 'फ्लीट टेलीमेट्री',
    evIntelligence: 'ईवी इंटेलिजेंस',
    oemPortal: 'ओईएम पोर्टल',
    developerPortal: 'डेवलपर पोर्टल',
    workforce: 'कार्यबल इंजन',
    plans: 'योजनाएं और मूल्य',
    signOut: 'लॉग आउट',
    search: 'खोजें (Cmd+K)...',
    activeBays: 'सक्रिय बे',
    liveTelemetry: 'लाइव टेलीमेट्री',
    warrantyDefects: 'वारंटी दोष',
  },
  ta: {
    dashboard: 'முகப்பு பலகை',
    salesEngine: 'விற்பனை இயந்திரம்',
    serviceEngine: 'சேவை இயந்திரம்',
    aiCopilot: 'ஏஐ காப்பிலட் மையம்',
    financeEngine: 'நிதி இயந்திரம்',
    insuranceEngine: 'காப்பீட்டு இயந்திரம்',
    fleetTelemetry: 'வாகன குழு டெலிமெட்ரி',
    evIntelligence: 'மின்சார வாகன நுண்ணறிவு',
    oemPortal: 'ஓஇஎம் போர்ட்டல்',
    developerPortal: 'டெவலப்பர் போர்ட்டல்',
    workforce: 'பணியாளர் இயந்திரம்',
    plans: 'திட்டங்கள் & கட்டணம்',
    signOut: 'வெளியேறு',
    search: 'தேடுக (Cmd+K)...',
    activeBays: 'செயலில் உள்ள சர்வீஸ் பே',
    liveTelemetry: 'நேரலை டெலிமெட்ரி',
    warrantyDefects: 'உத்தரவாத குறைபாடுகள்',
  },
  te: {
    dashboard: 'డాష్‌బోర్డ్',
    salesEngine: 'సేల్స్ ఇంజిన్',
    serviceEngine: 'సర్వీస్ ఇంజిన్',
    aiCopilot: 'ఏఐ కోపైలట్ హబ్',
    financeEngine: 'ఫైనాన్స్ ఇంజిన్',
    insuranceEngine: 'భీమా ఇంజిన్',
    fleetTelemetry: 'ఫ్లీట్ టెలిమెట్రీ',
    evIntelligence: 'ఈవీ ఇంటెలిజెన్స్',
    oemPortal: 'ఓఈఎమ్ పోర్టల్',
    developerPortal: 'డెవలపర్ పోర్టల్',
    workforce: 'వర్క్‌ఫోర్స్ ఇంజిన్',
    plans: 'ప్లాన్‌లు & ధరలు',
    signOut: 'లాగ్ అవుట్',
    search: 'వెతకండి (Cmd+K)...',
    activeBays: 'యాక్టివ్ బేలు',
    liveTelemetry: 'లైవ్ టెలిమెట్రీ',
    warrantyDefects: 'వారంటీ లోపాలు',
  },
  ar: {
    dashboard: 'لوحة القيادة',
    salesEngine: 'محرك المبيعات',
    serviceEngine: 'محرك الخدمة والورشة',
    aiCopilot: 'مركز الذكاء الاصطناعي',
    financeEngine: 'محرك التمويل والأقساط',
    insuranceEngine: 'محرك التأمين والمطالبات',
    fleetTelemetry: 'تتبع وإدارة الأساطيل',
    evIntelligence: 'ذكاء بطاريات المركبات الكهربائية',
    oemPortal: 'بوابة المصنعين OEM',
    developerPortal: 'بوابة المطورين والواجهات',
    workforce: 'محرك إدارة الفنيين',
    plans: 'الباقات والاشتراكات',
    signOut: 'تسجيل الخروج',
    search: 'بحث (Cmd+K)...',
    activeBays: 'ورش العمل النشطة',
    liveTelemetry: 'بيانات التتبع المباشر',
    warrantyDefects: 'عيوب الضمان المصنعية',
  },
};

interface LocaleContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  currency: SupportedCurrency;
  setCurrency: (curr: SupportedCurrency) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number, overrideCurrency?: SupportedCurrency) => string;
  currentLocaleInfo: LocaleInfo;
  availableLocales: LocaleInfo[];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    return (localStorage.getItem('autoera_locale') as SupportedLocale) || 'en';
  });

  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => {
    return (localStorage.getItem('autoera_currency') as SupportedCurrency) || 'INR';
  });

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('autoera_locale', newLocale);
    if (SUPPORTED_LOCALES[newLocale]?.defaultCurrency) {
      setCurrency(SUPPORTED_LOCALES[newLocale].defaultCurrency);
    }
  };

  const setCurrency = (newCurr: SupportedCurrency) => {
    setCurrencyState(newCurr);
    localStorage.setItem('autoera_currency', newCurr);
  };

  const currentLocaleInfo = SUPPORTED_LOCALES[locale] || SUPPORTED_LOCALES.en;

  // Handle dynamic RTL and language attribute on documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', locale);
    root.setAttribute('dir', currentLocaleInfo.dir);
  }, [locale, currentLocaleInfo]);

  const t = (key: string): string => {
    return DICTIONARY[locale]?.[key] || DICTIONARY.en[key] || key;
  };

  const formatCurrency = (amount: number, overrideCurrency?: SupportedCurrency): string => {
    const curr = overrideCurrency || currency;
    if (curr === 'INR') {
      // Indian numbering system format (₹ 1,25,000)
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(amount);
    } else if (curr === 'AED') {
      return `AED ${amount.toLocaleString('en-US')}`;
    } else {
      return `$ ${amount.toLocaleString('en-US')}`;
    }
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        currency,
        setCurrency,
        t,
        formatCurrency,
        currentLocaleInfo,
        availableLocales: Object.values(SUPPORTED_LOCALES),
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

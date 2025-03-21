'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enUS from './locales/en-US.json';
import esMX from './locales/es-MX.json';

type Translations = {
  [key: string]: any;
};

type LanguageContextType = {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const translations: Translations = {
  'en-US': enUS,
  'es-MX': esMX,
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en-US',
  changeLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en-US');

  // Initialize from localStorage on mount (client-side only)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language];

    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        // Fallback to English if the key is not found in the current language
        result = key;
        break;
      }
    }

    return typeof result === 'string' ? result : key;
  };

  const contextValue: LanguageContextType = {
    language,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}; 
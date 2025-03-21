'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/language-provider';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

export default function LanguageToggle() {
  const { language, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (lang: string) => {
    changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        {language === 'en-US' ? '🇺🇸' : '🇲🇽'}
        <span className="hidden sm:inline">{t(`language.${language}`)}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <button
            onClick={() => selectLanguage('en-US')}
            className={`block w-full px-4 py-2 text-left text-sm ${
              language === 'en-US' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            🇺🇸 {t('language.en-US')}
          </button>
          <button
            onClick={() => selectLanguage('es-MX')}
            className={`block w-full px-4 py-2 text-left text-sm ${
              language === 'es-MX' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            🇲🇽 {t('language.es-MX')}
          </button>
        </div>
      )}
    </div>
  );
} 
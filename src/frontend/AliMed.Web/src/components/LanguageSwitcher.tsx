import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../context/LanguageContext';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const languages: { code: Language; label: string; flag: string; nativeName: string }[] = [
  { code: 'pl', label: 'Polski', flag: '', nativeName: 'Polish' },
  { code: 'szl', label: 'Ślōnski', flag: '', nativeName: 'Silesian' },
];

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-alimed-blue hover:shadow-md transition-all duration-300 ease-in-out"
        aria-label="Change language"
      >
        <GlobeAltIcon className="w-5 h-5 text-alimed-blue group-hover:scale-110 transition-transform duration-300" />
        <span className="text-2xl leading-none">{currentLanguage.flag}</span>
        <span className="text-sm font-semibold text-gray-700 group-hover:text-alimed-blue transition-colors">
          {currentLanguage.label}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
            <div className="bg-gradient-to-r from-alimed-blue to-alimed-light-blue p-3">
              <p className="text-white text-xs font-medium flex items-center gap-2">
                <GlobeAltIcon className="w-4 h-4" />
                Wybierz język / Choose language
              </p>
            </div>
            <div className="p-2 space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    language === lang.code 
                      ? 'bg-gradient-to-r from-alimed-blue/10 to-alimed-light-blue/10 border-l-4 border-alimed-blue shadow-sm' 
                      : 'hover:bg-gray-50 hover:translate-x-1'
                  }`}
                >
                  <span className="text-2xl leading-none">{lang.flag}</span>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-semibold ${
                      language === lang.code ? 'text-alimed-blue' : 'text-gray-800'
                    }`}>
                      {lang.label}
                    </p>
                    <p className="text-xs text-gray-500">{lang.nativeName}</p>
                  </div>
                  {language === lang.code && (
                    <svg className="w-5 h-5 text-alimed-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;

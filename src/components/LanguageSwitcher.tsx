// src/components/LanguageSwitcher.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const languages = [
  { code: 'it', label: 'IT', flagCode: 'it' },
  { code: 'en', label: 'EN', flagCode: 'gb' },
  { code: 'es', label: 'ES', flagCode: 'es' },
  { code: 'fr', label: 'FR', flagCode: 'fr' },
  { code: 'de', label: 'DE', flagCode: 'de' },
];

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLang = languages.find((l) => l.code === currentLocale) || languages[0];

  const handleLanguageChange = (newLocale: string) => {
    setIsOpen(false);
    if (!pathname || newLocale === currentLocale) return;

    if (pathname === '/' || pathname === `/${currentLocale}`) {
      router.push(`/${newLocale}`);
      return;
    }

    const segments = pathname.split('/');
    if (segments[1] === currentLocale) {
      segments[1] = newLocale;
    } else {
      segments.unshift('', newLocale);
    }

    const newPath = segments.join('/') || '/';
    router.push(newPath);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Main trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition"
      >
        <img
          src={`https://flagcdn.com/w20/${selectedLang.flagCode}.png`}
          alt={selectedLang.label}
          className="w-4 h-3 object-cover rounded-sm shadow-xs"
        />
        <span>{selectedLang.label}</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-28 rounded-lg bg-white shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-indigo-50 hover:text-indigo-600 transition ${
                lang.code === currentLocale ? 'bg-indigo-50/60 text-indigo-600 font-semibold' : 'text-gray-700'
              }`}
            >
              <img
                src={`https://flagcdn.com/w20/${lang.flagCode}.png`}
                alt={lang.label}
                className="w-4 h-3 object-cover rounded-sm shadow-xs"
              />
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
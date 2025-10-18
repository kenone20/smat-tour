import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

// Define the shape of the context
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define available languages and their properties
const languages = {
  en: { name: 'English', dir: 'ltr' },
  fr: { name: 'Français', dir: 'ltr' },
  es: { name: 'Español', dir: 'ltr' },
  ar: { name: 'العربية', dir: 'rtl' },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadTranslations = async () => {
      const langConfig = languages[language as keyof typeof languages];
      if (langConfig) {
        try {
          const response = await fetch(`./locales/${language}.json`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setTranslations(data);
          document.documentElement.lang = language;
          document.documentElement.dir = langConfig.dir;
        } catch (error) {
            console.error(`Failed to load translations for ${language}:`, error);
        }
      }
    };
    loadTranslations();
  }, [language]);

  const setLanguage = (lang: string) => {
    if (languages[lang as keyof typeof languages]) {
      setLanguageState(lang);
    }
  };

  const t = useCallback((key: string, options?: Record<string, string | number>): string => {
    let translation = translations[key] || key;
    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{${optionKey}}`, String(options[optionKey]));
      });
    }
    return translation;
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export const availableLanguages = Object.entries(languages).map(([code, { name }]) => ({ code, name }));
import React, { useState } from 'react';
import { useTranslation, availableLanguages } from '../contexts/LanguageContext';
import { LanguageIcon } from './IconComponents';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 rtl:space-x-reverse text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <LanguageIcon className="w-5 h-5" />
        <span className="text-sm font-medium uppercase">{language}</span>
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      {isOpen && (
        <ul
          className="absolute ltr:right-0 rtl:left-0 mt-2 w-32 bg-white dark:bg-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          onMouseLeave={() => setIsOpen(false)}
        >
          {availableLanguages.map(({ code, name }) => (
            <li key={code}>
              <button
                onClick={() => {
                  setLanguage(code);
                  setIsOpen(false);
                }}
                className={`w-full ltr:text-left rtl:text-right px-4 py-2 text-sm ${
                  language === code
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-slate-700 dark:text-slate-200'
                } hover:bg-slate-100 dark:hover:bg-slate-600`}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;

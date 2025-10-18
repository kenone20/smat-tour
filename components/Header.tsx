import React from 'react';
import { GlobeAltIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  onShowHowToUse: () => void;
  onShowAbout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowHowToUse, onShowAbout }) => {
  const { t } = useTranslation();
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <GlobeAltIcon className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-secondary">{t('header_title')}</h1>
        </div>
        <nav className="flex items-center space-x-4 rtl:space-x-reverse">
          <button onClick={onShowHowToUse} className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">{t('header_howToUse')}</button>
          <button onClick={onShowAbout} className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">{t('header_about')}</button>
          <div className="relative group">
            <span className="text-sm font-medium text-slate-400 cursor-not-allowed">{t('header_pricing')}</span>
            <div className="absolute hidden group-hover:block bg-slate-700 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              {t('header_comingSoon')}
            </div>
          </div>
          
          <div className="w-px h-6 bg-slate-200"></div>

          <a href="#" className="text-slate-600 hover:text-primary transition-colors">
            {t('header_signIn')}
          </a>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};

export default Header;

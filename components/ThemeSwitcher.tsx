import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const title = theme === 'light' ? t('toggle_theme_dark') : t('toggle_theme_light');

  return (
    <button
      onClick={toggleTheme}
      title={title}
      aria-label={title}
      className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/10 rounded-full transition-colors"
    >
      {theme === 'light' ? (
        <MoonIcon className="w-5 h-5" />
      ) : (
        <SunIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeSwitcher;

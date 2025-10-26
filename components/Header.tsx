import React, { useState, useEffect, useRef } from 'react';
import { GlobeAltIcon, MagnifyingGlassIcon, MicrophoneIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { getDestinationSuggestions } from '../services/geminiService';
import ThemeSwitcher from './ThemeSwitcher';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface HeaderProps {
  onShowHowToUse: () => void;
  onShowAbout: () => void;
  destination: string;
  onDestinationChange: (destination: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onShowHowToUse, onShowAbout, destination, onDestinationChange }) => {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(destination);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const isSpeechRecognitionSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    setSearchQuery(destination);
  }, [destination]);

  useEffect(() => {
    if (searchQuery.trim().length < 2 || searchQuery === destination) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const handler = setTimeout(() => {
      setIsSearching(true);
      getDestinationSuggestions(searchQuery)
        .then(results => {
          setSuggestions(results);
          setIsDropdownOpen(results.length > 0);
        })
        .catch(console.error)
        .finally(() => setIsSearching(false));
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, destination]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onDestinationChange(suggestion);
    setSearchQuery(suggestion);
    setIsDropdownOpen(false);
  };
  
  const handleVoiceSearch = () => {
    if (!isSpeechRecognitionSupported) {
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onDestinationChange(transcript);
      setSearchQuery(transcript);
      setIsDropdownOpen(false);
    };

    recognition.start();
  };


  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm dark:shadow-none border-b border-transparent dark:border-slate-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse flex-shrink-0">
          <GlobeAltIcon className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-secondary dark:text-slate-200">{t('header_title')}</h1>
        </div>

        <div className="relative flex-grow max-w-md mx-4" ref={searchContainerRef}>
          <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center ltr:pl-3 rtl:pr-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => { if (suggestions.length > 0) setIsDropdownOpen(true); }}
            placeholder={t('header_search_placeholder')}
            className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-12 rtl:pl-12 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-transparent transition-colors"
          />
          <div className="absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center ltr:pr-3 rtl:pl-3">
            {isSearching ? (
              <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
                <button
                    type="button"
                    onClick={handleVoiceSearch}
                    disabled={isRecording || !isSpeechRecognitionSupported}
                    title={isSpeechRecognitionSupported ? t('header_voice_search_title') : t('header_voice_search_unsupported')}
                    className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-focus focus:outline-none focus:ring-1 focus:ring-primary-focus disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <MicrophoneIcon className={`w-5 h-5 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
                </button>
            )}
          </div>

          {isDropdownOpen && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 rounded-md shadow-lg max-h-60 overflow-auto border border-slate-200 dark:border-slate-600">
              {suggestions.map((s, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full ltr:text-left rtl:text-right px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav className="flex items-center space-x-2 md:space-x-4 rtl:space-x-reverse flex-shrink-0">
          <button onClick={onShowHowToUse} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">{t('header_howToUse')}</button>
          <button onClick={onShowAbout} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">{t('header_about')}</button>
          <div className="relative group">
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500 cursor-not-allowed">{t('header_pricing')}</span>
            <div className="absolute hidden group-hover:block bg-slate-700 dark:bg-slate-600 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              {t('header_comingSoon')}
            </div>
          </div>
          
          <LanguageSwitcher />
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
};

export default Header;
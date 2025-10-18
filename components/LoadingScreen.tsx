
import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const { t } = useTranslation();

  const loadingMessages = [
    t('loading_message1'),
    t('loading_message2'),
    t('loading_message3'),
    t('loading_message4'),
    t('loading_message5'),
    t('loading_message6'),
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-lg mt-12 w-full min-h-[50vh]">
      <SparklesIcon className="w-16 h-16 text-primary animate-pulse" />
      <h2 className="text-3xl font-bold text-secondary mt-6">{t('loading_title')}</h2>
      <div className="mt-4 text-slate-500 h-6">
        <p className="transition-opacity duration-500 ease-in-out">{loadingMessages[messageIndex]}</p>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5 mt-8 overflow-hidden">
        <div className="bg-primary h-2.5 rounded-full animate-progress"></div>
      </div>
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
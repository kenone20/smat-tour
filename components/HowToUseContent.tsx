import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const HowToUseContent: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4 text-slate-600">
      <div className="space-y-1">
        <h3 className="font-semibold text-lg text-secondary">{t('howToUse_step1_title')}</h3>
        <p>{t('howToUse_step1_desc')}</p>
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-lg text-secondary">{t('howToUse_step2_title')}</h3>
        <p>{t('howToUse_step2_desc')}</p>
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-lg text-secondary">{t('howToUse_step3_title')}</h3>
        <p>{t('howToUse_step3_desc')}</p>
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-lg text-secondary">{t('howToUse_step4_title')}</h3>
        <p>{t('howToUse_step4_desc')}</p>
      </div>
    </div>
  );
};

export default HowToUseContent;

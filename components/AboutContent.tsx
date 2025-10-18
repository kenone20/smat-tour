import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const AboutContent: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-4 text-slate-600">
            <p>{t('about_p1')}</p>
            <p>{t('about_p2')}</p>
        </div>
    );
};

export default AboutContent;

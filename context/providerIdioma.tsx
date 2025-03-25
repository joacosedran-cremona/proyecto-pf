'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const ClientLanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const { i18n } = useTranslation();
    
    useEffect(() => {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage && i18n.language !== savedLanguage) {
        i18n.changeLanguage(savedLanguage);
        }
    }, [i18n]);

    return <>{children}</>;
};
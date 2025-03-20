import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esHeader from './locales/es/header.json';
import enHeader from './locales/en/header.json';

import esLayout from './locales/es/layout.json';
import enLayout from './locales/en/layout.json';

import esMonitoreo from './locales/es/monitoreo.json';
import enMonitoreo from './locales/en/monitoreo.json';

import esGrafico from './locales/es/grafico.json';
import enGrafico from './locales/en/grafico.json';

const resources = {
    es: { 
        header: esHeader,
        layout: esLayout,
        monitoreo: esMonitoreo,
        grafico: esGrafico,
    },
    en: { 
        header: enHeader,
        layout: enLayout,
        monitoreo: enMonitoreo,
        grafico: enGrafico,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    ns: ['header', 'layout', 'monitoreo', 'grafico'],
    interpolation: { 
        escapeValue: false,
        skipOnVariables: false,
    },
});

export default i18n;

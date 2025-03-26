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

import esSelectores from './locales/es/selectores.json';
import enSelectores from './locales/en/selectores.json';

import esBotones from './locales/es/botones.json';
import enBotones from './locales/en/botones.json';

import esHistAlert from './locales/es/hist_alert_tit.json';
import enHistAlert from './locales/en/hist_alert_tit.json';

import esTabla from './locales/es/tabla.json';
import enTabla from './locales/en/tabla.json';

const resources = {
    es: { 
        header: esHeader,
        layout: esLayout,
        monitoreo: esMonitoreo,
        grafico: esGrafico,
        selectores: esSelectores,
        botones: esBotones,
        hist_alert_tit: esHistAlert,
        tabla: esTabla,
    },
    en: { 
        header: enHeader,
        layout: enLayout,
        monitoreo: enMonitoreo,
        grafico: enGrafico,
        selectores: enSelectores,
        botones: enBotones,
        hist_alert_tit: enHistAlert,
        tabla: enTabla,
    },
};

const getInitialLanguage = () => {
    if (typeof window === 'undefined') {
        const cookies = require('next/headers').cookies();
        return cookies.get('selectedLanguage')?.value || 'es';
    }
    return localStorage.getItem('selectedLanguage') || document.cookie.replace(/(?:(?:^|.*;\s*)selectedLanguage\s*=\s*([^;]*).*$)|^.*$/, '$1') || 'es';
};

i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'es',
    ns: ['header', 'layout', 'monitoreo', 'grafico', 'selectores', 'botones', 'hist_alert_tit', 'tabla'],
    interpolation: { 
        escapeValue: false,
        skipOnVariables: false,
    },
});

export default i18n;

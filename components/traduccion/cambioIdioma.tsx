import { useTranslation } from 'react-i18next';

export const CambioIdioma = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        document.cookie = `selectedLanguage=${lng}; path=/; max-age=31536000`;
        localStorage.setItem('selectedLanguage', lng); // Opcional para acceso rápido en cliente
    };

    return (
        <div className="flex gap-2">
            <button onClick={() => changeLanguage('es')}>🇪🇸</button>
            <button onClick={() => changeLanguage('en')}>🇺🇸</button>
        </div>
    );
};
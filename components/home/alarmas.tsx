import { useTranslation } from 'react-i18next';

export function Alarmas() {
    const { t } = useTranslation("layout");
    return (
        <div className="w-[100%] h-[100%]">
            <h1 className="flex justify-center w-[100%] text-4xl text-white font-semibold">
                {t('titulo2')}
            </h1>
            <p className="flex justify-center w-[100%] text-xl text-white">
                {t('subtitulo2')}
            </p>
            
        </div>
    );
}
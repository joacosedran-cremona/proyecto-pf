import { useTranslation } from 'react-i18next';
import ContenedorAlertas from './contenedorAlertas';

export function Alarmas() {
    const { t } = useTranslation("layout");
    return (
        <div className="w-[100%] h-[100%]">
            <div className="h-[8%]">
                <h1 className="flex justify-center w-[100%] text-4xl text-white font-semibold">
                    {t('titulo2')}
                </h1>
                <p className="flex justify-center w-[100%] text-xl text-white">
                    {t('subtitulo2')}
                </p>
            </div>
            
            <div className="w-[100%] h-[92%] py-[20px] flex flex-col justify-between items-center">
                <ContenedorAlertas />
                <ContenedorAlertas />
            </div>
            
        </div>
    );
}
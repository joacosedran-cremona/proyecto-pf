"use client"

import { useLinea } from "@/context/LineaContext";
import GraficoMonitoreo from "@/components/graficos/graficoMonitoreo";
import Selector from "@/components/selectores/selectorLineas";
import { useTranslation } from 'react-i18next';

const lineas = {
    1: { cocinas: [1, 2, 3], enfriadores: [7, 8, 9, 10] },
    2: { cocinas: [4, 5, 6], enfriadores: [11, 12, 13, 14] }
} as const;

const Monitoreo = () => {
    const { t } = useTranslation('monitoreo');

    const { lineaSeleccionada } = useLinea();
    const linea = lineas[lineaSeleccionada as keyof typeof lineas];

    return (
        <section className="flex flex-col min-h-[650px] h-[90vh] w-[100%] min-w-[720px] items-center justify-center gap-[20px]">
            <div className="flex w-[100%] justify-between">
                <h1 className="text-2xl font-semibold text-white">{t('monitoreo')}</h1>
                <div className="w-1/5">
                    <Selector />
                </div>
            </div>

            <div className="flex flex-row gap-[20px] h-1/2 w-[100%]">
                {linea.cocinas.map((id) => (
                    <GraficoMonitoreo key={`equipo-${id}`} id={id} />
                ))}
            </div>
                
            <div className="flex flex-row gap-[20px] h-1/2 w-[100%]">
                {linea.enfriadores.map((id) => (
                    <GraficoMonitoreo key={`equipo-${id}`} id={id} />
                ))}
            </div>
        </section>
    );
};

export default Monitoreo;

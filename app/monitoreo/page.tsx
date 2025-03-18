"use client"

import { useLinea } from "@/context/LineaContext";
import Grafico from "@/components/graficos/graficoMonitoreo";
import Selector from "@/components/selectores/selector";

const lineas = {
    1: { cocinas: [1, 2, 3], enfriadores: [1, 2, 3, 4] },
    2: { cocinas: [4, 5, 6], enfriadores: [5, 6, 7, 8] }
} as const;

const Monitoreo = () => {
    const { lineaSeleccionada, lineasData } = useLinea();
    if (!lineasData) return <div>Loading...</div>;

    const linea = lineas[lineaSeleccionada as keyof typeof lineas];

    return (
        <section className="flex flex-col min-h-[650px] h-[90vh] w-full min-w-[720px] items-center justify-center gap-20">
            <div className="flex w-full justify-between">
                <h1 className="text-3xl text-white">MONITOREO DE EQUIPOS</h1>
                <Selector selectClasses="bg-[#0001] h-full w-1/4 px-20 border-b-2 border-green focus:border-green focus:outline-none text-lg text-green hover:text-green transition-colors cursor-pointer"/>
            </div>

            <div className="flex flex-row gap-20 h-1/2 w-full">
                {linea.cocinas.map((id) => (
                    <Grafico key={`cocina-${id}`} contextType="cocinas" id={id} />
                ))}
            </div>
                
            <div className="flex flex-row gap-20 h-1/2 w-full">
                {linea.enfriadores.map((id) => (
                    <Grafico key={`enfriador-${id}`} contextType="enfriadores" id={id} />
                ))}
            </div>
        </section>
    );
};

export default Monitoreo;

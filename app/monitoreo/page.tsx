"use client"

import { useLinea } from "@/context/LineaContext";
import Grafico from "@/components/graficoMonitoreo";
import Selector from "./selector";

const lineas = {
    1: { cocinas: [1, 2, 3], enfriadores: [1, 2, 3, 4] },
    2: { cocinas: [4, 5, 6], enfriadores: [5, 6, 7, 8] }
} as const;

const Monitoreo = () => {
    const { lineaSeleccionada, lineasData } = useLinea();
    if (!lineasData) return <div>Loading...</div>;

    const linea = lineas[lineaSeleccionada as keyof typeof lineas];

    return (
        <section className="flex flex-col h-[85vh] w-full items-center justify-center gap-20">
            <div className="flex w-full justify-between">
                <h1 className="text-4xl">MONITOREO DE EQUIPOS</h1>
                <Selector />
            </div>

            <div className="grid grid-cols-3 gap-20 h-1/2 w-full">
                {linea.cocinas.map((id) => (
                    <Grafico key={`cocina-${id}`} contextType="cocinas" id={id} />
                ))}
            </div>
                
            <div className="grid grid-cols-4 gap-20 h-1/2 w-full">
                {linea.enfriadores.map((id) => (
                    <Grafico key={`enfriador-${id}`} contextType="enfriadores" id={id} />
                ))}
            </div>
        </section>
    );
};

export default Monitoreo;

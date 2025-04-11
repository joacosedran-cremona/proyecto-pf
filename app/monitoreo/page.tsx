"use client"

import { useLinea } from "@/context/LineaContext";
import Grafico from "@/components/graficos/graficoMonitoreo";
import Selector from "@/components/selectores/selectorLineas";

const lineas = {
    1: { cocinas: [1, 2, 3], enfriadores: [7, 8, 9, 10] },
    2: { cocinas: [4, 5, 6], enfriadores: [11, 12, 13, 14] }
} as const;

const Monitoreo = () => {
    const { lineaSeleccionada } = useLinea();
    const linea = lineas[lineaSeleccionada as keyof typeof lineas];

    return (
        <section className="flex flex-col min-h-[650px] h-[90vh] w-full min-w-[720px] items-center justify-center gap-20">
            <div className="flex w-full justify-between">
                <h1 className="text-3xl text-white">MONITOREO DE EQUIPOS</h1>
                <Selector />
            </div>

            <div className="flex flex-row gap-20 h-1/2 w-full">
                {linea.cocinas.map((id) => (
                    <Grafico key={`equipo-${id}`} id={id} />
                ))}
            </div>
                
            <div className="flex flex-row gap-20 h-1/2 w-full">
                {linea.enfriadores.map((id) => (
                    <Grafico key={`equipo-${id}`} id={id} />
                ))}
            </div>
        </section>
    );
};

export default Monitoreo;

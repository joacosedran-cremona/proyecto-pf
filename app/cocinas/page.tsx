"use client";

import { useCocina } from "@/context/CocinaContext";
import Selector from "./selector";

export default function Home() {
    const { cocinaData } = useCocina();

    function displayData(data: string | number | null, unit: string) {
        return data === "N/A" || data === null ? data : `${data}${unit}`;
    }

    const datosCocina = [
        { label: "Temp. Ingreso", value: cocinaData.tempIng, unit: "°C" },
        { label: "Temp. Agua", value: cocinaData.tempAgua, unit: "°C" },
        { label: "Temp. Producto", value: cocinaData.tempProd, unit: "°C" },
        { label: "Nivel Agua", value: cocinaData.nivAgua, unit: "mm" }
    ];

    return (
        <section className="flex flex-col w-full h-full gap-20">
            <Selector />
            <div className="w-100 flex flex-row h-full gap-20">
                <div className="w-1/3 flex flex-col h-full gap-20">
                    <div className="w-100 flex flex-row h-3/4 gap-20">
                        <div className="bg-black flex flex-col p-20 w-1/2 h-full rounded-md">
                            <h2 className="flex justify-start text-center w-full h-50 py-auto text-xl">
                                Estado Equipo
                            </h2>
                            <ul className="flex flex-col h-full w-full gap-1h">
                                {datosCocina.map((dato) => (
                                    <li key={dato.label} className="bg-grey flex flex-col w-full h-full px-20 py-1h rounded-md items-center">
                                        <p className="h-1/2 w-full mb-[1.5wv] ">{`${dato.label}`}</p>
                                        <p className="h-1/2 w-full">{`${displayData(dato.value, dato.unit)}`}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col w-1/2 gap-20">
                            <p className="bg-oranget flex justify-start items-center h-50 p-15 border-1 border-orange rounded-md">
                                Receta: {cocinaData.nom_receta ?? "N/A"}
                            </p>
                            <div className="bg-black h-auto p-20 rounded-md">Ciclo Activo</div>
                        </div>
                    </div>
                    <div className="bg-black h-1/4 p-20 rounded-md">Sector IO</div>
                </div>
                <div className="bg-black p-20 w-2/3 rounded-md">Gráfico</div>
            </div>
        </section>
    );
}

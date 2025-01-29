"use client";

import { useState } from "react";
import Selector from "./selector";

interface CocinaData {
    tempIng: string | number | null;
    tempAgua: string | number | null;
    tempProd: string | number | null;
    nivAgua: string | number | null;
}

// Este componente ahora va a recibir los datos de la cocina desde el selector
export default function Home() {
    const [cocinaId, setCocinaId] = useState<number>(1); // Establecemos el valor inicial en 1 (Cocina 1)
    const [cocinaData, setCocinaData] = useState<CocinaData>({
        tempIng: null,
        tempAgua: null,
        tempProd: null,
        nivAgua: null
    });

    // Función para mostrar los datos de la cocina
    function displayData(data: string | number | null, unit: string) {
        return data === "N/A" || data === null ? data : `${data}${unit}`;
    }

    // Datos y unidades correspondientes
    const datosCocina = [
        { label: "Temp. Ingreso", value: cocinaData.tempIng, unit: "°C" },
        { label: "Temp. Agua", value: cocinaData.tempAgua, unit: "°C" },
        { label: "Temp. Producto", value: cocinaData.tempProd, unit: "°C" },
        { label: "Nivel Agua", value: cocinaData.nivAgua, unit: "mm" }
    ];

    return (
        <section className="flex flex-col w-full h-full gap-20">
            <Selector
                cocinaId={cocinaId}
                setCocinaId={setCocinaId}
                setCocinaData={setCocinaData}
            />

            <div className="w-100 flex flex-row h-full gap-20">
                <div className="w-1/4 flex flex-col h-full gap-20">
                    <div className="w-100 flex flex-row h-3/4 gap-20">
                        <div className="bg-black p-20 w-1/2 h-full grid justify-between">
                            <h2 className="text-xl h-1/4">Estado Equipo</h2>
                            <ul
                                className="grid h-full justify-between gap-5"
                            >
                                {datosCocina.map((dato) => (
                                    <li
                                        key={dato.label}
                                        className="bg-grey p-5"
                                    >
                                        {`${dato.label}: ${displayData(dato.value, dato.unit)}`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid w-1/2 gap-20">
                            <div className="bg-oranget h-1/4 p-5">Receta</div>
                            <div className="bg-black h-3/4 p-20">Ciclo Activo</div>
                        </div>
                    </div>
                    <div className="bg-black h-1/4 p-20">Sector IO</div>
                </div>
                <div className="bg-black p-20 w-3/4">Grafico</div>
            </div>
        </section>
    );
}

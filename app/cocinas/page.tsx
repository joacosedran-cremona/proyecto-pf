"use client";

import { useState } from "react";
import Selector from "./selector";

interface CocinaData {
    tempIng: string | number | null;
    tempAgua: string | number | null;
    tempProd: string | number | null;
    nivAgua: string | number | null;
    nom_receta: string | null;
}

export default function Home() {
    const [cocinaId, setCocinaId] = useState<number>(1);
    const [cocinaData, setCocinaData] = useState<CocinaData>({
        tempIng: null,
        tempAgua: null,
        tempProd: null,
        nivAgua: null,
        nom_receta: null,
    });

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
            <Selector
                cocinaId={cocinaId}
                setCocinaId={setCocinaId}
                setCocinaData={setCocinaData}
            />

            <div className="w-100 flex flex-row h-full gap-20">
                <div className="w-1/4 flex flex-col h-full gap-20">
                    <div className="w-100 flex flex-row h-3/4 gap-20">
                        <div className="bg-black p-20 w-1/2 h-full grid rounded-md">
                            <h2 className="flex justify-start text-center w-full py-auto text-xl h-30">
                                Estado Equipo
                            </h2>
                            <ul className="flex flex-col h-full w-full justify-between gap-5">
                                {datosCocina.map((dato) => (
                                    <li key={dato.label} className="bg-grey w-full p-5 rounded-md">
                                        {`${dato.label}: ${displayData(dato.value, dato.unit)}`}
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
                <div className="bg-black p-20 w-3/4 rounded-md">Gráfico</div>
            </div>
        </section>
    );
}

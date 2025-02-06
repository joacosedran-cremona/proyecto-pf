"use client";
import React from 'react';
import { useCocina } from "@/context/CocinaContext";
import Selector from "./selector";
import Grafico from "@/components/grafico";
import CicloActivo from '@/components/cicloActivo';
import EstadoEquipo from '@/components/estadoEquipo';
import SectorIO from '@/components/sectorIO';
import { getColorClass } from '@/utils/logicaColores';
import { displayData } from '@/utils/displayData';

export default function Home() {
    const { cocinaData } = useCocina();

    const datosCocina = [
        { label: "Temp. Ingreso", value: cocinaData.tempIng ?? "N/A", unit: "°C" },
        { label: "Temp. Agua", value: cocinaData.ultimoPaso?.temp_Agua ?? "N/A", unit: "°C" },
        { label: "Temp. Producto", value: cocinaData.tempProd ?? "N/A", unit: "°C" },
        { label: "Nivel Agua", value: cocinaData.nivAgua ?? "N/A", unit: "mm" }
    ];

    const datosCiclo = [
        { label: "Paso N°", value: cocinaData.ultimoPaso?.id ?? "N/A" },
        { label: "N° Receta", value: cocinaData.num_receta ?? "N/A" },
        { label: "Cant. Torres", value: cocinaData.cant_torres ?? "N/A" },
        { label: "Tiempo Transcurrido", value: cocinaData.tiempo ?? "N/A" },
        { label: "Tipo Fin", value: cocinaData.tipo_Fin ?? "N/A" }
    ];

    const datosIO = [
        { label: "Frio", value: cocinaData.sectorIO[0]?.frio ?? "N/A" },
        { label: "Vapor Vivo", value: cocinaData.sectorIO[0]?.vapor_vivo ?? "N/A" },
        { label: "IO YY EQ XX", value: cocinaData.sectorIO[0]?.io_yy_eq_xx ?? "N/A" },
        { label: "Vapor Serp", value: cocinaData.sectorIO[0]?.vapor_serp ?? "N/A" }
    ];

    return (
        <section className="flex flex-col gap-20 min-h-[85vh]">
            <div className="flex w-full h-full gap-20">
                <div className="w-1/3 zIndex-0">
                    <Selector />
                </div>
                <p className="bg-oranget flex justify-start items-center h-50 p-15 w-1/3 border-1 border-orange text-[calc(1vw+0.7vh)] font-semibold rounded-md">
                    Receta: {cocinaData.nom_receta ?? "N/A"}
                </p>
                <p className="bg-black flex justify-start items-center h-50 p-15 w-1/3 border-1 border-orange text-[calc(1vw+0.7vh)] font-semibold rounded-md">
                    Estado: {cocinaData.estado ?? "N/A"}
                </p>
            </div>

            <div className="flex flex-col w-full min-h-full gap-20 1365:flex-row flex-1">
                <div className="flex w-full gap-20 1365:grid 1365:w-1/3">
                    <div className="flex w-2/3 gap-20 1365:w-full">
                        <div className="bg-black grid p-20 w-full h-full rounded-md">
                            <EstadoEquipo datos={datosCocina} getColorClass={(label, value) => getColorClass(label, value, 'orange')} displayData={displayData} />
                        </div>
                        <div className="bg-black grid p-20 w-full h-full rounded-md">
                            <CicloActivo datosCiclo={datosCiclo} displayData={displayData} defaultColor='green' />
                        </div>
                    </div>
                    <div className="bg-black grid h-full p-20 w-1/3 flex-grow rounded-md 1365:w-full">
                        <SectorIO datosIO={datosIO} getColorClass={(label, value) => getColorClass(label, value, 'orange')} displayData={displayData} />
                    </div>
                </div>
                <div className="w-full 1365:w-2/3">
                    <Grafico contextType="enfriadores" />
                </div>
            </div>
        </section>
    );
}


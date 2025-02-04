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
        <section className="flex flex-col w-full h-full gap-20 flex-1">
            <div className="flex flex-row w-full h-full gap-20">
                <div className="w-1/3 zIndex-0">
                    <Selector />
                </div>
                <p className="bg-oranget flex justify-start items-center h-50 p-15 w-1/3 border-1 border-orange text-[20px] font-semibold rounded-md">
                    Receta: {cocinaData.nom_receta ?? "N/A"}
                </p>
                <p className="bg-black flex justify-start items-center h-50 p-15 w-1/3 border-1 border-orange text-[20px] font-semibold rounded-md">
                    Estado: {cocinaData.estado ?? "N/A"}
                </p>
            </div>

            <div className="w-full flex flex-col gap-20 1365:flex-row">
                <div className="w-full flex flex-row h-full gap-20 1365:w-1/3 1365:flex-col">
                    <div className="w-3/4 flex flex-row gap-20 h-full 1365:w-full 1365:h-2/3">
                        <EstadoEquipo datos={datosCocina} getColorClass={(label, value) => getColorClass(label, value, 'orange')} displayData={displayData} />
                        <CicloActivo datosCiclo={datosCiclo} displayData={displayData} defaultColor='green' />
                    </div>
                    <SectorIO datosIO={datosIO} getColorClass={(label, value) => getColorClass(label, value, 'blue')} displayData={displayData} />
                </div>
                <Grafico contextType="cocinas" />
            </div>
        </section>
    );
}


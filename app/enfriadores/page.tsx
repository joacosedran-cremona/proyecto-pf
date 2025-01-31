"use client";
import React from 'react';
import { useEnfriador } from "@/context/EnfriadorContext";
import Selector from "./selector";
import Grafico from "../../components/grafico";
import CicloActivo from '../../components/cicloActivo';
import EstadoEquipo from '../../components/estadoEquipo';
import SectorIO from '../../components/sectorIO';

export default function Home() {
    const { enfriadorData } = useEnfriador();

    function displayData(data: string | number | boolean | null, unit?: string): string | number | boolean {
        if (data === "N/A" || data === null) return "N/A";
        if (typeof data === "boolean") return data ? "True" : "False";
        return unit ? `${data} ${unit}` : data;
    }

    const getColorClass = (label: string, value: string | number | null) => {
        if (value === "N/A") return "text-white";
        return label === "Nivel Agua" ? "text-water" : "text-blue";
    };

    const datosEnfriador = [
        { label: "Temp. Ingreso", value: enfriadorData.tempIng ?? "N/A", unit: "°C" },
        { label: "Temp. Agua", value: enfriadorData.ultimoPaso?.temp_Agua ?? "N/A", unit: "°C" },
        { label: "Temp. Producto", value: enfriadorData.tempProd ?? "N/A", unit: "°C" },
        { label: "Nivel Agua", value: enfriadorData.nivAgua ?? "N/A", unit: "mm" }
    ];

    const datosCiclo = [
        { label: "Paso N°", value: enfriadorData.ultimoPaso?.id ?? "N/A" },
        { label: "N° Receta", value: enfriadorData.num_receta ?? "N/A" },
        { label: "Cant. Torres", value: enfriadorData.cant_torres ?? "N/A" },
        { label: "Tiempo Transcurrido", value: enfriadorData.tiempo ?? "N/A" },
        { label: "Tipo Fin", value: enfriadorData.tipo_Fin ?? "N/A" }
    ];

    const datosIO = [
        { label: "Frio", value: enfriadorData.sectorIO[0]?.frio ?? "N/A" },
        { label: "Vapor Vivo", value: enfriadorData.sectorIO[0]?.vapor_vivo ?? "N/A" },
        { label: "IO YY EQ XX", value: enfriadorData.sectorIO[0]?.io_yy_eq_xx ?? "N/A" },
        { label: "Vapor Serp", value: enfriadorData.sectorIO[0]?.vapor_serp ?? "N/A" }
    ];

    return (
        <section className="flex flex-col w-full h-full gap-20 flex-1">
            <div className="flex flex-row w-full h-full gap-20">
                <div className="w-1/3 zIndex-0">
                    <Selector />
                </div>
                <p className="bg-bluet flex justify-start items-center h-50 p-15 w-1/3 border-1 border-blue text-[20px] font-semibold rounded-md">
                    Receta: {enfriadorData.nom_receta ?? "N/A"}
                </p>
                <p className="bg-black flex justify-start items-center h-50 p-15 w-1/3 border-1 border-blue text-[20px] font-semibold rounded-md">
                    Estado: {enfriadorData.estado ?? "N/A"}
                </p>
            </div>

            <div className="w-full flex flex-col h-[75vh] gap-20 custom:flex-row">
                <div className="w-full flex flex-row h-full gap-20 custom:w-1/3 custom:flex-col">
                    <div className="w-3/4 flex flex-row gap-20 h-full custom:w-full custom:h-2/3">
                        <EstadoEquipo datos={datosEnfriador} getColorClass={getColorClass} displayData={displayData} />
                        <CicloActivo datosCiclo={datosCiclo} displayData={displayData} />
                    </div>
                    <SectorIO datosIO={datosIO} displayData={displayData} />
                </div>
                <Grafico />
            </div>
        </section>
    );
}

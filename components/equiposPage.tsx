"use client";
import React from "react";
import { useCocina } from "@/context/CocinaContext";
import { useEnfriador } from "@/context/EnfriadorContext";
import Selector from "./selectorEquipos";
import Grafico from "./grafico";
import CicloActivo from "./cicloActivo";
import EstadoEquipo from "./estadoEquipo";
import SectorIO from "./sectorIO";
import { getColorClass } from "@/utils/logicaColores";
import { displayData } from "@/utils/displayData";

interface EquipoPageProps {
type: "cocina" | "enfriador";
}

const EquipoPage: React.FC<EquipoPageProps> = ({ type }) => {
    // Seleccionamos el contexto adecuado según el tipo de equipo
    const { cocinaId, setCocinaId, cocinaData } = useCocina();
    const { enfriadorId, setEnfriadorId, enfriadorData } = useEnfriador();

    // Determinar qué datos usar
    const isCocina = type === "cocina";
    const data = isCocina ? cocinaData : enfriadorData;
    const selectedId = isCocina ? cocinaId : enfriadorId;
    const setSelectedId = isCocina ? setCocinaId : setEnfriadorId;

    // Configuración de colores y estilos según el tipo de equipo
    const color = isCocina ? "orange" : "blue";
    const borderColor = isCocina ? "border-orange" : "border-blue";
    const bgColor = isCocina ? "bg-oranget" : "bg-bluet";

    // Lista de opciones para el selector
    const itemsList = isCocina
        ? [
            { id: 1, name: "Cocina 1" },
            { id: 2, name: "Cocina 2" },
            { id: 3, name: "Cocina 3" },
            { id: 4, name: "Cocina 4" },
            { id: 5, name: "Cocina 5" },
            { id: 6, name: "Cocina 6" }
        ]
        : [
            { id: 1, name: "Enfriador 1" },
            { id: 2, name: "Enfriador 2" },
            { id: 3, name: "Enfriador 3" },
            { id: 4, name: "Enfriador 4" },
            { id: 5, name: "Enfriador 5" },
            { id: 6, name: "Enfriador 6" },
            { id: 7, name: "Enfriador 7" },
            { id: 8, name: "Enfriador 8" }
        ];

    // Datos de estado del equipo
    const datosEquipo = [
        { label: "Temp. Ingreso", value: data.tempIng ?? "N/A", unit: "°C" },
        { label: "Temp. Agua", value: data.ultimoPaso?.temp_Agua ?? "N/A", unit: "°C" },
        { label: "Temp. Producto", value: data.tempProd ?? "N/A", unit: "°C" },
        { label: "Nivel Agua", value: data.nivAgua ?? "N/A", unit: "mm" }
    ];

    // Datos del ciclo activo
    const datosCiclo = [
        { label: "Paso N°", value: data.ultimoPaso?.id ?? "N/A" },
        { label: "N° Receta", value: data.num_receta ?? "N/A" },
        { label: "Cant. Torres", value: data.cant_torres ?? "N/A" },
        { label: "Tiempo Transcurrido", value: data.tiempo ?? "N/A" },
        { label: "Tipo Fin", value: data.tipo_Fin ?? "N/A" }
    ];

    // Datos de Sector IO
    const datosIO = [
        { label: "Frio", value: data.sectorIO?.[0]?.frio ?? "N/A" },
        { label: "Vapor Vivo", value: data.sectorIO?.[0]?.vapor_vivo ?? "N/A" },
        { label: "IO YY EQ XX", value: data.sectorIO?.[0]?.io_yy_eq_xx ?? "N/A" },
        { label: "Vapor Serp", value: data.sectorIO?.[0]?.vapor_serp ?? "N/A" }
    ];

    return (
        <section className="flex flex-col gap-20 min-h-[85vh]">
        {/* SELECCIÓN Y ESTADO */}
        <div className="flex w-full h-full gap-20">
            <div className="w-1/3">
            <Selector
                value={selectedId}
                onChange={setSelectedId}
                items={itemsList}
                placeholder={`Seleccione una ${isCocina ? "cocina" : "enfriador"}`}
                selectClasses={`w-full bg-[#0001] px-20 border-b-2 ${borderColor} focus:outline-none text-lg text-${color} hover:text-${color} transition-colors cursor-pointer`}
                optionClasses="p-2 bg-black font-bold"
            />
            </div>
            <p className={`${bgColor} flex justify-start items-center h-50 p-15 w-1/3 ${borderColor} text-[calc(1vw+0.7vh)] font-semibold rounded-md`}>
            Receta: {data.nom_receta ?? "N/A"}
            </p>
            <p className={`bg-black flex justify-start items-center h-50 p-15 w-1/3 ${borderColor} text-[calc(1vw+0.7vh)] font-semibold rounded-md`}>
            Estado: {data.estado ?? "N/A"}
            </p>
        </div>

        {/* SECCIONES DE INFORMACIÓN */}
        <div className="flex flex-col w-full min-h-full gap-20 1365:flex-row flex-1">
            <div className="flex w-full gap-20 1365:grid 1365:w-1/3">
            <div className="flex w-2/3 gap-20 1365:w-full">
                <div className="bg-black grid p-20 w-full h-full rounded-md">
                <EstadoEquipo datos={datosEquipo} getColorClass={(label, value) => getColorClass(label, value, color)} displayData={displayData} />
                </div>
                <div className="bg-black grid p-20 w-full h-full rounded-md">
                <CicloActivo datosCiclo={datosCiclo} displayData={displayData} defaultColor="green" />
                </div>
            </div>
            <div className="bg-black grid h-full p-20 w-1/3 flex-grow rounded-md 1365:w-full">
                <SectorIO datosIO={datosIO} getColorClass={(label, value) => getColorClass(label, value, color)} displayData={displayData} />
            </div>
            </div>
            <div className="w-full 1365:w-2/3">
            <Grafico contextType={isCocina ? "cocinas" : "enfriadores"} />
            </div>
        </div>
        </section>
    );
};

export default EquipoPage;

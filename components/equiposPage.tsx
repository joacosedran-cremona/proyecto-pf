"use client";

// Componentes
import Selector from "./selectores/selectorEquipos";
import Grafico from "./graficos/grafico";
import CicloActivo from "./monitoreoIndividual/cicloActivo";
import EstadoEquipo from "./monitoreoIndividual/estadoEquipo";
import SectorIO from "./monitoreoIndividual/sectorIO";

// Funciones
import { getColorClass } from "@/utils/logicaColores";
import { displayData } from "@/utils/displayData";

// Idioma
import { useTranslation } from 'react-i18next';

interface EquipoPageProps {
    type: "cocina" | "enfriador";
}

export default function EquipoPage({type}: EquipoPageProps) {
    const { t } = useTranslation('monitoreo');

    return (
        <section className="flex flex-col gap-20 min-h-[85vh] pt-[40px]">
        {/* SELECCIÓN Y ESTADO */}
        <div className="flex w-full h-full gap-20">
            <div className="w-1/3">
                <Selector
                    value={currentId}
                    onChange={handleSelectionChange}
                    isCocina={isCocina}
                    selectClasses={`w-full bg-[#0001] px-20 border-b-2 ${borderColor} focus:outline-none text-lg text-${color} hover:text-${color} transition-colors cursor-pointer`}
                    optionClasses="p-2 bg-black font-bold"
                />
            </div>
            <p className={`${bgColor} flex justify-start items-center h-50 p-15 w-1/3 ${borderColor} text-[calc(1vw+0.7vh)] font-semibold rounded-md text-white`}>
            {t('titulo.receta')}: {data.nom_receta ?? "N/A"}
            </p>
            <p className={`bg-black flex justify-start items-center h-50 p-15 w-1/3 ${borderColor} text-[calc(1vw+0.7vh)] font-semibold rounded-md text-white`}>
            {t('titulo.estado')}: {data.estado ?? "N/A"}
            </p>
        </div>

        {/* SECCIONES DE INFORMACIÓN */}
        <div className="flex flex-col w-full min-h-full gap-20 1365:flex-row flex-1">
            <div className="flex w-full gap-20 1365:flex 1365:flex-col 1365:w-1/3">
            <div className="flex w-2/3 gap-20 1365:w-full">
                <div className="bg-black flex flex-col p-20 w-full h-full rounded-md">
                <EstadoEquipo 
                    datos={datosEquipo} 
                    getColorClass={(label, value) => getColorClass(labelToKeyMap[label] || '', value, color)} 
                    displayData={formattedDisplayData}
                />
                </div>
                <div className="bg-black flex flex-col p-20 w-full h-full rounded-md">
                <CicloActivo datosCiclo={datosCiclo} displayData={displayData} defaultColor="lightRed" />
                </div>
            </div>
            <div className="bg-black flex flex-col h-full p-20 w-1/3 flex-grow rounded-md 1365:w-full">
            <SectorIO 
                datosIO={datosIO} 
                getColorClass={(label, value) => getColorClass(label, value, color)}
            />
            </div>
            </div>
            <div className="w-full 1365:w-2/3">
            <Grafico contextType={isCocina ? "cocinas" : "enfriadores"} />
            </div>
        </div>
        </section>
    );
}
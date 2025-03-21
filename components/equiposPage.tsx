"use client";

import React from "react";
import { useCocina } from "@/context/CocinaContext";
import { useEnfriador } from "@/context/EnfriadorContext";
import Selector from "./selectores/selectorEquipos";
import Grafico from "./graficos/grafico";
import CicloActivo from "./monitoreoIndividual/cicloActivo";
import EstadoEquipo from "./monitoreoIndividual/estadoEquipo";
import SectorIO from "./monitoreoIndividual/sectorIO";
import { getColorClass } from "@/utils/logicaColores";
import { displayData } from "@/utils/displayData";
import { CocinaData } from "@/context/CocinaContext";
import { EnfriadorData } from "@/context/EnfriadorContext";
import { useTranslation } from 'react-i18next';

interface EquipoPageProps {
    type: "cocina" | "enfriador";
    initialId?: number; 
}

const EquipoPage: React.FC<EquipoPageProps> = ({ type, initialId }) => {
    const { t } = useTranslation('selectores');
    // Seleccionamos el contexto adecuado según el tipo de equipo
    const { cocinaId, setCocinaId, cocinaData } = useCocina();
    const { enfriadorId, setEnfriadorId, enfriadorData } = useEnfriador();

    React.useEffect(() => {
        if (initialId !== undefined) {
            if (type === "cocina") {
                setCocinaId(initialId);
            } else {
                setEnfriadorId(initialId);
            }
        }
    }, [initialId, type, setCocinaId, setEnfriadorId]);

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
            { id: 1, name: t('cocinas.cocina1') },
            { id: 2, name: t('cocinas.cocina2') },
            { id: 3, name: t('cocinas.cocina3') },
            { id: 4, name: t('cocinas.cocina4') },
            { id: 5, name: t('cocinas.cocina5') },
            { id: 6, name: t('cocinas.cocina6') },
        ]
        : [
            { id: 1, name: t('enfriadores.enfriador1') },
            { id: 2, name: t('enfriadores.enfriador2') },
            { id: 3, name: t('enfriadores.enfriador3') },
            { id: 4, name: t('enfriadores.enfriador4') },
            { id: 5, name: t('enfriadores.enfriador5') },
            { id: 6, name: t('enfriadores.enfriador6') },
            { id: 7, name: t('enfriadores.enfriador7') },
            { id: 8, name: t('enfriadores.enfriador8') }
        ];

    // Datos de estado del equipo
    const datosEquipo = [
        { label: t('estadoEquipo.tempIngreso'), value: data.tempIng ?? "N/A", unit: "°C" },
        { label: t('estadoEquipo.tempAgua'), value: data.ultimoPaso?.temp_Agua ?? "N/A", unit: "°C" },
        { label: t('estadoEquipo.tempProd'), value: data.tempProd ?? "N/A", unit: "°C" },
        { label: t('estadoEquipo.nivelAgua'), value: data.nivAgua ?? "N/A", unit: "mm" }
    ];

    const labelToKeyMap: Record<string, string> = {
        [t('estadoEquipo.tempIngreso')]: 'tempIngreso',
        [t('estadoEquipo.tempAgua')]: 'tempAgua',
        [t('estadoEquipo.tempProd')]: 'tempProd',
        [t('estadoEquipo.nivelAgua')]: 'nivelAgua',
    };
    

    // Datos del ciclo activo
    const datosCiclo = [
        { label: t('cicloActivo.paso'), value: data.ultimoPaso?.id ?? "N/A" },
        { label: t('cicloActivo.receta'), value: data.num_receta ?? "N/A" },
        { label: t('cicloActivo.cantTorres'), value: data.cant_torres ?? "N/A" },
        { label: t('cicloActivo.tiempo'), value: data.tiempo ?? "N/A" },
        { label: t('cicloActivo.tipoFin'), value: data.tipo_Fin ?? "N/A" }
    ];

    const datosIO = isCocina
    ? (data as CocinaData).sectorIO?.[0]
    ? [
        { label: t('sectorIO.bomba'), value: (data as CocinaData).sectorIO[0].bomba_recirculacion },
        { label: t('sectorIO.entradaAgua'), value: (data as CocinaData).sectorIO[0].entrada_agua },
        { label: t('sectorIO.filtroSuccion'), value: (data as CocinaData).sectorIO[0].filtro_succion_agua },
        { label: t('sectorIO.vaporSerp'), value: (data as CocinaData).sectorIO[0].vapor_serpentina },
        { label: t('sectorIO.vaporVivo'), value: (data as CocinaData).sectorIO[0].vapor_vivo }
        ]
    : []
    : (data as EnfriadorData).sectorIO?.[0]
    ? [
        { label: t('sectorIO.bomba'), value: (data as EnfriadorData).sectorIO[0].bomba_recirculacion },
        { label: t('sectorIO.entradaAgua'), value: (data as EnfriadorData).sectorIO[0].entrada_agua },
        { label: t('sectorIO.filtroSuccion'), value: (data as EnfriadorData).sectorIO[0].filtro_succion_agua },
        { label: t('sectorIO.valvulaAmoniaco'), value: (data as EnfriadorData).sectorIO[0].valvula_amoniaco }
        ]
    : [];


    return (
        <section className="flex flex-col gap-20 min-h-[85vh] pt-[40px]">
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
                    displayData={(value, unit) => displayData(value, unit)} 
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
};

export default EquipoPage;

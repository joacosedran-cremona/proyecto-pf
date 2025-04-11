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

// Contextos y navegación
import { useSearchParams } from 'next/navigation';
import { useCocinaContext } from '@/context/CocinaContext';
import { useEnfriadorContext } from '@/context/EnfriadorContext';
import { useMemo } from 'react';
import { SectorIOType } from '@/types/sectorIO';

interface EquipoPageProps {
    type: "cocina" | "enfriador";
}

export default function EquipoPage({type}: EquipoPageProps) {
    const { t } = useTranslation('monitoreo');
    const searchParams = useSearchParams();
    const { cocinas } = useCocinaContext();
    const { enfriadores } = useEnfriadorContext();
    
    // Obtener ID del equipo seleccionado
    const currentId = Number(searchParams.get('id')) || 
        (type === "cocina" ? 1 : 7); // Valores por defecto
    
    // Obtener datos del equipo según el tipo
    const equipo = type === "cocina" 
        ? cocinas.find(c => c.info.id === currentId)
        : enfriadores.find(e => e.info.id === currentId);

    // Variables derivadas
    const isCocina = type === "cocina";
    const color = isCocina ? "orange" : "blue";
    const borderColor = isCocina ? "border-orange" : "border-blue";
    const bgColor = isCocina ? "bg-oranget" : "bg-bluet";

    const labelToKeyMap: Record<string, string> = {
        [t('estadoEquipo.tempIngreso')]: 'tempIngreso',
        [t('estadoEquipo.tempAgua')]: 'tempAgua',
        [t('estadoEquipo.tempProd')]: 'tempProd',
        [t('estadoEquipo.nivelAgua')]: 'nivelAgua'
    };

    const datosEquipo = [
        { label: t('estadoEquipo.tempIngreso'), value: equipo?.info.temp_Ingreso ?? "N/A", unit: "°C" },
        { label: t('estadoEquipo.tempAgua'), value: equipo?.info.temp_Agua ?? "N/A", unit: "°C" },
        { label: t('estadoEquipo.tempProd'), value: equipo?.info.temp_Prod ?? "N/A", unit: "°C" },
        { label: t('estadoEquipo.nivelAgua'), value: equipo?.info.niv_Agua ?? "N/A", unit: "mm" }
    ];

    const datosCiclo = [
        { label: t('cicloActivo.paso'), value: equipo?.info.receta_paso_actual || "N/A" },
        { label: t('cicloActivo.receta'), value: equipo?.detalles.num_receta || 'N/A' },
        { label: t('cicloActivo.cantTorres'), value: equipo?.detalles.cant_torres || "N/A" },
        { label: t('cicloActivo.tiempo'), value: equipo?.info.tiempoTranscurrido ?? "N/A" },
        { label: t('cicloActivo.tipoFin'), value: equipo?.detalles.tipo_Fin ?? "N/A" }
    ];
    
    const datosIO = useMemo(() => {
        // Definimos los sensores base que siempre deben mostrarse
        const defaultBaseIO = [
            { label: t('sectorIO.bomba'), value: false },
            { label: t('sectorIO.entradaAgua'), value: false },
            { label: t('sectorIO.filtroSuccion'), value: false }
        ];
    
        // Si no hay datos, retornamos los sensores por defecto según el tipo
        if (!equipo?.detalles.sector_io[0]) {
            if (isCocina) {
                return [
                    ...defaultBaseIO,
                    { label: t('sectorIO.vaporSerp'), value: false },
                    { label: t('sectorIO.vaporVivo'), value: false }
                ];
            } else {
                return [
                    ...defaultBaseIO,
                    { label: t('sectorIO.valvulaAmoniaco'), value: false },
                    { label: t('sectorIO.vaporLim'), value: false }
                ];
            }
        }
    
        // Si hay datos, seguimos con la lógica normal
        const sectorIO = equipo.detalles.sector_io[0] as SectorIOType;
        const baseIO = [
            { label: t('sectorIO.bomba'), value: sectorIO.bomba_recirculacion },
            { label: t('sectorIO.entradaAgua'), value: sectorIO.entrada_agua },
            { label: t('sectorIO.filtroSuccion'), value: sectorIO.filtro_succion_agua }
        ];
    
        if (isCocina && 'vapor_serpentina' in sectorIO) {
            return [
                ...baseIO,
                { label: t('sectorIO.vaporSerp'), value: sectorIO.vapor_serpentina },
                { label: t('sectorIO.vaporVivo'), value: sectorIO.vapor_vivo }
            ];
        } else if (!isCocina && 'valvula_amoniaco' in sectorIO) {
            return [
                ...baseIO,
                { label: t('sectorIO.valvulaAmoniaco'), value: sectorIO.valvula_amoniaco },
                { label: t('sectorIO.vaporLim'), value: sectorIO.vapor_vivo_lim }
            ];
        }
    
        return baseIO;
    }, [equipo, isCocina, t]);

    const handleSelectionChange = (newId: number) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('id', String(newId));
        window.history.pushState(null, '', `?${searchParams.toString()}`);
    };

    const formattedDisplayData = (value: string | number, unit?: string) => {
        if (value === "N/A") return value;
        return unit ? `${value} ${unit}` : value;
    };

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
                {t('titulo.receta')}: {equipo?.detalles.nom_receta ?? "N/A"}
            </p>
            <p className={`bg-black flex justify-start items-center h-50 p-15 w-1/3 ${borderColor} text-[calc(1vw+0.7vh)] font-semibold rounded-md text-white`}>
                {t('titulo.estado')}: {equipo?.info.estado ?? "N/A"}
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
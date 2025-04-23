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
    //    [t('estadoEquipo.tempIngreso')]: 'tempIngreso',
        [t('estadoEquipo.tempAgua')]: 'tempAgua',
        [t('estadoEquipo.tempProd')]: 'tempProd',
        [t('estadoEquipo.nivelAgua')]: 'nivelAgua',
    };

    const datosEquipo = [
    //    { label: t('estadoEquipo.tempIngreso'), value: equipo?.info.temp_ingreso ?? "N/A", unit: "°C" },
        { label: t('estadoEquipo.tempAgua'), value: equipo?.info.temp_agua ?? "N/A", unit: "°C" },
        { label: t('estadoEquipo.tempProd'), value: equipo?.info.temp_prod ?? "N/A", unit: "°C" },
        { label: t('estadoEquipo.nivelAgua'), value: equipo?.info.niv_agua ?? "N/A", unit: "mm" },
        { label: t('cicloActivo.tiempo'), value: equipo?.info.tiempoTranscurrido ?? "N/A" }
    ];

    const datosCiclo = [
        { label: t('cicloActivo.paso'), value: equipo?.info.receta_paso_actual || "N/A" },
        { label: t('cicloActivo.lote'), value: equipo?.detalles.num_receta || 'N/A' },
        { label: t('cicloActivo.cantTorres'), value: equipo?.detalles.cant_torres || "N/A" },
        { label: t('cicloActivo.tipoFin'), value: equipo?.detalles.tipo_fin ?? "N/A" }
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
        <section className="flex flex-col gap-[20px] min-h-[90vh] pt-[40px]">
        {/* SELECCIÓN Y ESTADO */}
        <div className="flex w-[100%] h-[100%] gap-[20px]">
            <div className="w-1/3">
                <Selector
                    value={currentId}
                    onChange={handleSelectionChange}
                    isCocina={isCocina}
                    selectClasses={`w-[100%] h-[100%] bg-[#1f1f1f] px-[20px] border-b-[2px] ${borderColor} focus:outline-none text-lg text-${color} hover:text-${color} transition-colors cursor-pointer`}
                    optionClasses="p-[2px] bg-black font-bold"
                />
            </div>
            <p className={`${bgColor} flex justify-start items-center h-[50px] p-[15px] w-1/3 ${borderColor} text-[calc(1vw+0.7vh)] font-semibold rounded-md text-white`}>
                {t('titulo.receta')}: {equipo?.detalles.nom_receta ?? "N/A"}
            </p>
            <p className={`bg-black flex justify-start items-center h-[50px] p-[15px] w-1/3 ${borderColor} text-[calc(1vw+0.7vh)] font-semibold rounded-md text-white`}>
                {t('titulo.estado')}: {equipo?.info.estado ?? "N/A"}
            </p>
        </div>

        {/* SECCIONES DE INFORMACIÓN */}
        <div className="flex flex-col w-[100%] min-h-[100%] gap-[20px] 1365:flex-row flex-[1px]">
            <div className="flex w-[100%] gap-[20px] 1365:flex 1365:flex-col 1365:w-1/3">
                <div className="flex w-2/3 gap-[20px] 1365:w-[100%]">
                    <div className="bg-black flex flex-col p-[20px] w-[100%] h-[100%] rounded-md">
                        <EstadoEquipo 
                            datos={datosEquipo} 
                            getColorClass={(label, value) => getColorClass(labelToKeyMap[label] || '', value, color)} 
                            displayData={formattedDisplayData}
                        />
                    </div>
                    <div className="bg-black flex flex-col p-[20px] w-[100%] h-[100%] rounded-md">
                        <CicloActivo datosCiclo={datosCiclo} displayData={displayData} defaultColor={color} />
                    </div>
                </div>
                <div className="bg-black flex flex-col h-[100%] p-[20px] w-1/3 flex-grow rounded-md 1365:w-[100%]">
                    <SectorIO 
                        datosIO={datosIO} 
                        getColorClass={(label, value) => getColorClass(label, value, color)}
                    />
                </div>
            </div>
            <div className="w-[100%] 1365:w-2/3">
                <Grafico contextType={isCocina ? "cocinas" : "enfriadores"} />
            </div>
        </div>
        </section>
    );
}
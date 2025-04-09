"use client";

import React, { useEffect, useCallback } from "react";
import { useCocina, CocinaDataCompleta } from "@/context/CocinaContext";
import { useEnfriador, EnfriadorDataCompleta } from "@/context/EnfriadorContext";
import Selector from "./selectores/selectorEquipos";
import Grafico from "./graficos/grafico";
import CicloActivo from "./monitoreoIndividual/cicloActivo";
import EstadoEquipo from "./monitoreoIndividual/estadoEquipo";
import SectorIO from "./monitoreoIndividual/sectorIO";
import { getColorClass } from "@/utils/logicaColores";
import { displayData } from "@/utils/displayData";
import { useTranslation } from 'react-i18next';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { 
    BaseEquipoData, 
    CocinaData, 
    EnfriadorData, 
    SectorIOCocina, 
    SectorIOEnfriador,
    SectorIOBase 
} from '@/utils/interface';
import { mapCocinaData, mapEnfriadorData } from '@/utils/mapData';

export default function EquipoPage({ type, initialId }: { type: 'cocina' | 'enfriador', initialId: number }) {
    const { t } = useTranslation('monitoreo');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const { cocinaId, setCocinaId, cocinaData } = useCocina();
    const { enfriadorId, setEnfriadorId, enfriadorData } = useEnfriador();
    
    const isCocina = type === "cocina";
    const defaultData: BaseEquipoData = {
        tempIng: null,
        nivAgua: null,
        nom_receta: "N/A",
        estado: "N/A",
        num_receta: null,
        cant_torres: null,
        tiempo: null,
        tipo_Fin: "N/A",
        ultimoPaso: {
            id: 0,
            temp_Agua: null,
            temp_Ing: null,    // Agregado
            temp_Ingreso: null, // Agregado
            niv_Agua: null,    // Agregado
            tiempo: null       // Agregado
        },
        sectorIO: [
            isCocina 
                ? {
                    bomba_recirculacion: false,
                    entrada_agua: false,
                    filtro_succion_agua: false,
                    vapor_serpentina: false,
                    vapor_vivo: false
                } as SectorIOCocina
                : {
                    bomba_recirculacion: false,
                    entrada_agua: false,
                    filtro_succion_agua: false,
                    valvula_amoniaco: false
                } as SectorIOEnfriador
        ]
    };

    const mappedData = isCocina 
        ? mapCocinaData(cocinaData) || defaultData
        : mapEnfriadorData(enfriadorData) || defaultData;
    
    const data = mappedData as CocinaData | EnfriadorData;
    const color = isCocina ? "orange" : "blue";
    const borderColor = isCocina ? "border-orange" : "border-blue";
    const bgColor = isCocina ? "bg-oranget" : "bg-bluet";
    
    const idParam = searchParams.get('id');
    const maxId = isCocina ? 6 : 8;
    const currentId = idParam 
        ? Math.max(1, Math.min(parseInt(idParam), maxId))
        : (initialId || (isCocina ? cocinaId : enfriadorId));

    const datosEquipo = React.useMemo(() => [
        { 
            label: t('estadoEquipo.tempIngreso'), 
            value: data?.ultimoPaso?.temp_Ing || "N/A", 
            unit: "°C" 
        },
        { 
            label: t('estadoEquipo.tempAgua'), 
            value: data?.ultimoPaso?.temp_Agua || "N/A", 
            unit: "°C" 
        },
        { 
            label: t('estadoEquipo.nivelAgua'), 
            value: data?.nivAgua || "N/A", 
            unit: "mm" 
        }
    ], [data, t]);

    const labelToKeyMap = React.useMemo(() => ({
        [t('estadoEquipo.tempIngreso')]: 'tempIngreso',
        [t('estadoEquipo.tempAgua')]: 'tempAgua',
        [t('estadoEquipo.tempIng')]: 'tempIng',
        [t('estadoEquipo.nivelAgua')]: 'nivelAgua',
    }), [t]);

    const datosCiclo = React.useMemo(() => [
        { label: t('cicloActivo.paso'), value: data?.ultimoPaso?.id?.toString() || "N/A" },
        { label: t('cicloActivo.receta'), value: data?.num_receta?.toString() || "N/A" },
        { label: t('cicloActivo.cantTorres'), value: data?.cant_torres?.toString() || "N/A" },
        { label: t('cicloActivo.tiempo'), value: data?.tiempo?.toString() || "N/A" },
        { label: t('cicloActivo.tipoFin'), value: data?.tipo_Fin || "N/A" }
    ], [data, t]);

    const datosIO = React.useMemo(() => {
        const sectorIO = data?.sectorIO?.[0] || defaultData.sectorIO[0];

        const commonData = [
            { label: t('sectorIO.bomba'), value: sectorIO.bomba_recirculacion || false },
            { label: t('sectorIO.entradaAgua'), value: sectorIO.entrada_agua || false },
            { label: t('sectorIO.filtroSuccion'), value: sectorIO.filtro_succion_agua || false },
        ];

        if (isCocina) {
            const cocinaSectorIO = sectorIO as SectorIOCocina;
            return [
                ...commonData,
                { label: t('sectorIO.vaporSerp'), value: cocinaSectorIO.vapor_serpentina || false },
                { label: t('sectorIO.vaporVivo'), value: cocinaSectorIO.vapor_vivo || false }
            ];
        }

        const enfriadorSectorIO = sectorIO as SectorIOEnfriador;
        return [
            ...commonData,
            { label: t('sectorIO.valvulaAmoniaco'), value: enfriadorSectorIO.valvula_amoniaco || false }
        ];
    }, [data, isCocina, t]);

    const formattedDisplayData = useCallback((value: string | number, unit?: string): string | number => {
        const result = displayData(value, unit);
        return typeof result === 'boolean' ? result.toString() : result;
    }, []);

    useEffect(() => {
        if (isCocina) {
            setCocinaId(currentId);
        } else {
            setEnfriadorId(currentId);
        }
        
        if (!idParam || parseInt(idParam) !== currentId) {
            const params = new URLSearchParams(searchParams);
            params.set('id', currentId.toString());
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    }, [currentId, isCocina]);

    const handleSelectionChange = useCallback((newId: number) => {
        const validatedNewId = Math.max(1, Math.min(newId, maxId));
        const params = new URLSearchParams(searchParams);
        params.set('id', validatedNewId.toString());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, searchParams, router, maxId]);

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
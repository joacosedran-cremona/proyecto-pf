import { CocinaDataCompleta } from '@/context/CocinaContext';
import { EnfriadorDataCompleta } from '@/context/EnfriadorContext'; // Corregir importación
import { CocinaData, EnfriadorData } from './interface';

export const mapCocinaData = (data: CocinaDataCompleta | null): CocinaData | null => {
    if (!data) return null;
    
    return {
        num_cocina: data.num_cocina,
        tempIng: data.temp_Agua,
        tempAgua: data.temp_Agua,
        nivAgua: data.niv_Agua,
        nom_receta: data.nom_receta,
        num_receta: data.num_receta,
        estado: data.estado,
        cant_torres: data.cant_torres,
        tiempo: data.tiempoTranscurrido,
        tipo_Fin: data.tipo_Fin,
        pasos: [],
        ultimoPaso: {
            id: 1,
            temp_Ing: data.temp_Ingreso,
            temp_Agua: data.temp_Agua,
            temp_Ingreso: data.temp_Ingreso,
            niv_Agua: data.niv_Agua,
            tiempo: data.tiempoTranscurrido
        },
        sectorIO: data.sector_io.map(io => ({
            entrada_agua: io.entrada_agua,
            bomba_recirculacion: io.bomba_recirculacion,
            filtro_succion_agua: io.filtro_succion_agua,
            vapor_serpentina: io.vapor_serpentina,
            vapor_vivo: io.vapor_vivo
        }))
    };
};

export const mapEnfriadorData = (data: EnfriadorDataCompleta | null): EnfriadorData | null => {
    if (!data) return null;
    
    try {
        return {
            num_enfriador: data.num_enfriador,
            tempIng: data.temperatura ?? null,
            nivAgua: data.nivel ?? null,
            nom_receta: data.receta || "N/A",
            num_receta: data.nro_receta ?? null,
            estado: data.estado || "N/A",
            cant_torres: data.torres ?? null,
            tiempo: data.tiempo ?? null,
            tipo_Fin: data.fin || "N/A",
            pasos: [],
            ultimoPaso: {
                id: 1,
                temp_Ing: data.temperatura ?? null,
                temp_Agua: data.temperatura ?? null,
                temp_Ingreso: data.temperatura ?? null,
                niv_Agua: data.nivel ?? null,
                tiempo: data.tiempo ?? null
            },
            sectorIO: Array.isArray(data.io_sector) ? data.io_sector.map(io => ({
                entrada_agua: Boolean(io?.agua),
                bomba_recirculacion: Boolean(io?.bomba),
                filtro_succion_agua: Boolean(io?.filtro),
                valvula_amoniaco: Boolean(io?.amoniaco)
            })) : []
        };
    } catch (error) {
        console.error('Error al mapear datos del enfriador:', error);
        return null;
    }
};
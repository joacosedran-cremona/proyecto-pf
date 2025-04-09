export interface Paso {
    id: number;
    temp_Ing: string | number | null;
    temp_Agua: string | number | null;
    temp_Ingreso: string | number | null;
    niv_Agua: string | number | null;
    tiempo: number | null;
}

export interface SectorIOBase {
    entrada_agua: boolean;
    bomba_recirculacion: boolean;
    filtro_succion_agua: boolean;
}

export interface SectorIOCocina extends SectorIOBase {
    vapor_serpentina: boolean;
    vapor_vivo: boolean;
}

export interface SectorIOEnfriador extends SectorIOBase {
    valvula_amoniaco: boolean;
}

type SectorIO = SectorIOCocina | SectorIOEnfriador;

// Agregamos BaseEquipoData que es común para ambos tipos
export interface BaseEquipoData {
    nivAgua: number | null;
    nom_receta: string;
    estado: string;
    num_receta: number | null;
    cant_torres: number | null;
    tiempo: number | null;
    tipo_Fin: string;
    ultimoPaso: Paso | null;
    sectorIO: Array<SectorIO>;
}

// Actualizamos CocinaData y EnfriadorData para extender de BaseEquipoData
export interface CocinaData extends BaseEquipoData {
    num_cocina: number;
    sectorIO: SectorIOCocina[];
}

export interface EnfriadorData extends BaseEquipoData {
    num_enfriador: number;
    sectorIO: SectorIOEnfriador[];
}
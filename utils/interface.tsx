export interface Paso {
    id: number;
    temp_Ing: string | number | null;
    temp_Agua: string | number | null;
    temp_Prod: string | number | null;
    niv_Agua: string | number | null;
    tiempo: number | null;
    tipo_Fin: string | null;
}

export interface SectorIOBase {
    entrada_agua: boolean;
    bomba_recirculacion: boolean;
    filtro_succion_agua: boolean;
}

export interface SectorIOEnfriador extends SectorIOBase {
    valvula_amoniaco: boolean;
}

export interface SectorIOCocina extends SectorIOBase {
    vapor_serpentina: boolean;
    vapor_vivo: boolean;
}

export interface CocinaData {
    tempIng: string | number | null;
    tempAgua: string | number | null;
    tempProd: string | number | null;
    nivAgua: string | number | null;
    nom_receta: string | null;
    num_receta: number | null;
    estado: string | null;
    cant_torres: number | null;
    tiempo: number | null;
    tipo_Fin: number | string | null;
    pasos: Paso[];
    ultimoPaso: Paso | null;
    sectorIO: SectorIOCocina[];
}

export interface EnfriadorData {
    tempIng: string | number | null;
    tempAgua: string | number | null;
    tempProd: string | number | null;
    nivAgua: string | number | null;
    nom_receta: string | null;
    num_receta: number | null;
    estado: string | null;
    cant_torres: number | null;
    tiempo: number | null;
    tipo_Fin: number | string | null;
    pasos: Paso[];
    ultimoPaso: Paso | null;
    sectorIO: SectorIOEnfriador[];
}

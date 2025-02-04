// utils.ts

export interface Paso {
    id: number;
    temp_Agua: string | number | null;
    temp_Prod: string | number | null;
    niv_Agua: string | number | null;
    tiempo: number | null;
    tipo_Fin: string | null;
}

export interface SectorIO {
    frio: boolean;
    vapor_vivo: boolean;
    vapor_serp: boolean;
    io_yy_eq_xx: boolean;
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
    sectorIO: SectorIO[];
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
    sectorIO: SectorIO[];
}

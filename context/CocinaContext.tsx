import React, { createContext, useContext, useState, useEffect } from "react";

interface Paso {
    id: number;
    temp_Ing: string | number | null;
    temp_Agua: string | number | null;
    temp_Prod: string | number | null;
    niv_Agua: string | number | null;
    tiempo: number | null;  // Cambiado a number | null
}

interface SectorIOCocina {
    entrada_agua: boolean;
    bomba_recirculacion: boolean;
    filtro_succion_agua: boolean;
    vapor_serpentina: boolean;
    vapor_vivo: boolean;
}


export interface CocinaData {
    num_cocina: number;
    tempIng: string | number | null;
    tempAgua: string | number | null;
    tempProd: string | number | null;
    nivAgua: string | number | null;
    nom_receta: string | null;
    num_receta: number | null;
    estado: string | null;
    cant_torres: number | null;
    tiempo: number | null;
    tipo_Fin: string | null;
    pasos: Paso[];
    ultimoPaso: Paso | null;
    sectorIO: SectorIOCocina[];
}

interface CocinaContextType {
    cocinaId: number;
    setCocinaId: (id: number) => void;
    cocinaData: CocinaData;
    setCocinaData: (data: CocinaData) => void;
}

const CocinaContext = createContext<CocinaContextType | undefined>(undefined);

export const CocinaProvider = ({ children }: { children: React.ReactNode }) => {
    const [cocinaId, setCocinaId] = useState<number>(1);
    const [cocinaData, setCocinaData] = useState<CocinaData>({
        num_cocina: 0,
        tempIng: "N/A",
        tempAgua: "N/A",
        tempProd: "N/A",
        nivAgua: "N/A",
        nom_receta: null,
        num_receta: null,
        estado: null,
        cant_torres: null,
        tiempo: null,
        tipo_Fin: null,
        pasos: [],
        ultimoPaso: null,
        sectorIO: [],
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/data/enfriadores.json");
                const data = await response.json();
                const selectedEnfriador = data.find(
                    (item: { num_enfriador: number }) => item.num_enfriador === cocinaId
                );
    
                if (selectedEnfriador) {
                    const pasos = selectedEnfriador.pasos || []; // Asegurarse de que siempre sea un array
                    const ultimoPaso = pasos.length > 0 ? pasos[pasos.length - 1] : null;
    
                    setCocinaData({
                        num_cocina: selectedEnfriador.num_enfriador || 0,
                        tempIng: ultimoPaso?.temp_Ing ?? "N/A",
                        tempAgua: ultimoPaso?.temp_Agua ?? "N/A",
                        tempProd: ultimoPaso?.temp_Prod ?? "N/A",
                        nivAgua: ultimoPaso?.niv_Agua ?? "N/A",
                        nom_receta: selectedEnfriador.nom_receta ?? null,
                        num_receta: selectedEnfriador.num_receta ?? null,
                        estado: selectedEnfriador.estado ?? null,
                        cant_torres: selectedEnfriador.cant_torres ?? null,
                        tiempo: ultimoPaso?.tiempo ?? null,
                        tipo_Fin: selectedEnfriador.tipo_Fin ?? null,
                        pasos: pasos,
                        ultimoPaso: ultimoPaso,
                        sectorIO: selectedEnfriador.sector_io ?? [],
                    });
                } else {
                    setCocinaData({
                        num_cocina: 0,
                        tempIng: "N/A",
                        tempAgua: "N/A",
                        tempProd: "N/A",
                        nivAgua: "N/A",
                        nom_receta: null,
                        num_receta: null,
                        estado: null,
                        cant_torres: null,
                        tiempo: null,
                        tipo_Fin: null,
                        pasos: [],
                        ultimoPaso: null,
                        sectorIO: [],
                    });
                }
            } catch (error) {
                console.error("Error fetching enfriador data:", error);
            }
        }
    
        fetchData();
    }, [cocinaId]);
    

    return (
        <CocinaContext.Provider value={{ cocinaId, setCocinaId, cocinaData, setCocinaData }}>
            {children}
        </CocinaContext.Provider>
    );
};

export const useCocina = () => {
    const context = useContext(CocinaContext);
    if (!context) {
        throw new Error("useCocina debe ser usado dentro de un CocinaProvider");
    }
    return context;
};

export { CocinaContext };

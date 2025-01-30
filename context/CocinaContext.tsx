import React, { createContext, useContext, useState, useEffect } from "react";

interface Paso {
    id: number;
    temp_Ing: string | number | null;
    temp_Agua: string | number | null;
    temp_Prod: string | number | null;
    niv_Agua: string | number | null;
    tiempo: string | null;
    tipo_Fin: string | null;
}

interface SectorIO {
    frio: boolean;
    vapor_vivo: boolean;
    vapor_serp: boolean;
    io_yy_eq_xx: boolean;
}

interface CocinaData {
    tempIng: string | number | null;
    tempAgua: string | number | null;
    tempProd: string | number | null;
    nivAgua: string | number | null;
    nom_receta: string | null;
    num_receta: number | null;
    estado: string | null;
    cant_torres: number | null;
    tiempo: string | null;
    tipo_Fin: string | null;
    pasos: Paso[]; // Añadimos esta propiedad para reflejar los pasos.
    ultimoPaso: Paso | null; // `ultimoPaso` se va a derivar del último elemento en `pasos`
    sectorIO: SectorIO[]; // Agregamos la propiedad sectorIO
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
        sectorIO: [], // Inicializamos con un array vacío
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/data/cocinas.json");
                const data = await response.json();
                const selectedCocina = data.find(
                    (item: { num_cocina: number }) => item.num_cocina === cocinaId
                );
    
                if (selectedCocina) {
                    const pasos = selectedCocina.pasos;
                    const ultimoPaso = pasos ? pasos[pasos.length - 1] : null;
                    
                    setCocinaData({
                        tempIng: ultimoPaso?.temp_Ing ?? "N/A",
                        tempAgua: ultimoPaso?.temp_Agua ?? "N/A",
                        tempProd: ultimoPaso?.temp_Prod ?? "N/A",
                        nivAgua: ultimoPaso?.niv_Agua ?? "N/A",
                        nom_receta: selectedCocina.nom_receta ?? null,
                        num_receta: selectedCocina.num_receta ?? null,
                        estado: selectedCocina.estado ?? null,
                        cant_torres: selectedCocina.cant_torres ?? null,
                        tiempo: ultimoPaso?.tiempo ?? null,
                        tipo_Fin: ultimoPaso?.tipo_Fin ?? null,
                        pasos: pasos ?? [],
                        ultimoPaso: ultimoPaso,
                        sectorIO: selectedCocina.sector_io ?? [], // Asignamos el nuevo campo
                    });
                } else {
                    setCocinaData({
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
                console.error("Error fetching cocina data:", error);
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

import React, { createContext, useContext, useState, useEffect } from "react";

interface Paso {
    id: number;
    temp_Ing: string | number | null;
    temp_Agua: string | number | null;
    temp_Prod: string | number | null;
    niv_Agua: string | number | null;
    tiempo: number | null;  // Cambiado a number | null
    tipo_Fin: string | null;
}

interface SectorIO {
    frio: boolean;
    vapor_vivo: boolean;
    vapor_serp: boolean;
    io_yy_eq_xx: boolean;
}

interface EnfriadorData {
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
    sectorIO: SectorIO[];
}

interface EnfriadorContextType {
    enfriadorId: number;
    setEnfriadorId: (id: number) => void;
    enfriadorData: EnfriadorData;
    setEnfriadorData: (data: EnfriadorData) => void;
}

const EnfriadorContext = createContext<EnfriadorContextType | undefined>(undefined);

export const EnfriadorProvider = ({ children }: { children: React.ReactNode }) => {
    const [enfriadorId, setEnfriadorId] = useState<number>(1);
    const [enfriadorData, setEnfriadorData] = useState<EnfriadorData>({
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
                    (item: { num_enfriador: number }) => item.num_enfriador === enfriadorId
                );

                if (selectedEnfriador) {
                    const pasos = selectedEnfriador.pasos;
                    const ultimoPaso = pasos ? pasos[pasos.length - 1] : null;
                    
                    setEnfriadorData({
                        tempIng: selectedEnfriador.temp_Ing ?? "N/A",
                        tempAgua: ultimoPaso?.temp_Agua ?? "N/A",
                        tempProd: ultimoPaso?.temp_Prod ?? "N/A",
                        nivAgua: ultimoPaso?.niv_Agua ?? "N/A",
                        nom_receta: selectedEnfriador.nom_receta ?? null,
                        num_receta: selectedEnfriador.num_receta ?? null,
                        estado: selectedEnfriador.estado ?? null,
                        cant_torres: selectedEnfriador.cant_torres ?? null,
                        tiempo: ultimoPaso?.tiempo ?? null,
                        tipo_Fin: ultimoPaso?.tipo_Fin ?? null,
                        pasos: pasos ?? [],
                        ultimoPaso: ultimoPaso,
                        sectorIO: selectedEnfriador.sector_io ?? [],
                    });
                } else {
                    setEnfriadorData({
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
    }, [enfriadorId]);

    return (
        <EnfriadorContext.Provider value={{ enfriadorId, setEnfriadorId, enfriadorData, setEnfriadorData }}>
            {children}
        </EnfriadorContext.Provider>
    );
};

export const useEnfriador = () => {
    const context = useContext(EnfriadorContext);
    if (!context) {
        throw new Error("useEnfriador debe ser usado dentro de un EnfriadorProvider");
    }
    return context;
};

export { EnfriadorContext };

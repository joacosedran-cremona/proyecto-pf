import React, { createContext, useContext, useState, useEffect } from "react";

interface Paso {
    id: number;
    temp_Ing: string | number | null;
    temp_Agua: string | number | null;
    temp_Prod: string | number | null;
    niv_Agua: string | number | null;
    tiempo: number | null;
    tipo_Fin: string | null;
}

interface SectorIO {
    frio: boolean;
    vapor_vivo: boolean;
    vapor_serp: boolean;
    io_yy_eq_xx: boolean;
}

interface CocinaData {
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
    sectorIO: SectorIO[];
}

interface EnfriadorData {
    num_enfriador: number;
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

interface LineaData {
    cocinas: CocinaData[];
    enfriadores: EnfriadorData[];
}

interface LineaContextType {
    lineaSeleccionada: number;
    setLineaSeleccionada: (id: number) => void;
    lineasData: LineaData | null;
    setLineasData: (data: LineaData) => void;
}

const LineaContext = createContext<LineaContextType | undefined>(undefined);

export const LineaProvider = ({ children }: { children: React.ReactNode }) => {
    const [lineaSeleccionada, setLineaSeleccionada] = useState<number>(1);
    const [lineasData, setLineasData] = useState<LineaData | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [responseCocinas, responseEnfriadores] = await Promise.all([
                    fetch("/data/cocinas.json"),
                    fetch("/data/enfriadores.json")
                ]);

                const [dataCocinas, dataEnfriadores] = await Promise.all([
                    responseCocinas.json(),
                    responseEnfriadores.json()
                ]);

                setLineasData({
                    cocinas: dataCocinas,
                    enfriadores: dataEnfriadores
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <LineaContext.Provider value={{ lineaSeleccionada, setLineaSeleccionada, lineasData, setLineasData }}>
            {children}
        </LineaContext.Provider>
    );
};

export const useLinea = () => {
    const context = useContext(LineaContext);
    if (!context) {
        throw new Error("useLinea debe ser usado dentro de un LineaProvider");
    }
    return context;
};

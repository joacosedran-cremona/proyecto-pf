"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { useWebSocketContext } from "@/context/WebSocketContext";
import { transformData } from '../utils/logicaGraficos';

interface Paso {
    id: number;
    temp_Ing: string | number | null;
    temp_Agua: string | number | null;
    temp_Ingreso: string | number | null;
    niv_Agua: string | number | null;
    tiempo: number | null;
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

// LineaContext.tsx
export const LineaProvider = ({ children }: { children: React.ReactNode }) => {
    const [lineaSeleccionada, setLineaSeleccionada] = useState<number>(1);
    const { data } = useWebSocketContext();

    const [lineasData, setLineasData] = useState<LineaData | null>(null);
    const [datosTransformados, setDatosTransformados] = useState<any | null>(null);

    useEffect(() => {
        if (data) {
            setLineasData(data);

            // Transformamos una sola vez
            const cocinas = Array.isArray(data['datos-cocinas'])
                ? data['datos-cocinas'].map((grupo) => grupo[1])
                : [];

            const enfriadores = Array.isArray(data['datos-enfriadores'])
                ? data['datos-enfriadores'].map((grupo) => grupo[1])
                : [];

            // Aplicamos transformData a cada equipo
            const transformado = {
                cocinas: cocinas.map((c) => ({
                    ...c,
                    grafico: transformData(c.historial)
                })),
                enfriadores: enfriadores.map((e) => ({
                    ...e,
                    grafico: transformData(e.historial)
                }))
            };

            setDatosTransformados(transformado);
        }
    }, [data]);

    return (
        <LineaContext.Provider value={{ lineaSeleccionada, setLineaSeleccionada, lineasData, datosTransformados }}>
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

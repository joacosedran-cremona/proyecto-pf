"use client"
import { createContext, useContext, useState } from "react";

type EquipoData = { id: number; datos: any };
    type LineasDataType = {
    cocinas: EquipoData[];
    enfriadores: EquipoData[];
};

type LineaContextType = {
    lineaSeleccionada: number;
    setLineaSeleccionada: (linea: number) => void;
    lineasData: { [key: number]: LineasDataType };
};

const LineaContext = createContext<LineaContextType | undefined>(undefined);

export const LineaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [lineaSeleccionada, setLineaSeleccionada] = useState<number>(1);

const lineasData: { [key: number]: LineasDataType } = {
    1: {
        cocinas: [{ id: 1, datos: [] }, { id: 2, datos: [] }, { id: 3, datos: [] }],
        enfriadores: [{ id: 1, datos: [] }, { id: 2, datos: [] }, { id: 3, datos: [] }, { id: 4, datos: [] }]
    },
    2: {
        cocinas: [{ id: 4, datos: [] }, { id: 5, datos: [] }, { id: 6, datos: [] }],
        enfriadores: [{ id: 5, datos: [] }, { id: 6, datos: [] }, { id: 7, datos: [] }, { id: 8, datos: [] }]
    }
};

return (
    <LineaContext.Provider value={{ lineaSeleccionada, setLineaSeleccionada, lineasData }}>
        {children}
    </LineaContext.Provider>
    );
};

export const useLinea = () => {
    const context = useContext(LineaContext);
    if (!context) {
        throw new Error("useLinea debe usarse dentro de un LineaProvider");
    }
    return context;
};

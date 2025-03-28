import React, { createContext, useContext, useState, useEffect } from "react";
import { useWebSocketContext } from "@/context/WebSocketContext";

interface Paso {
    id: number;
    temp_Ing: string | number | null;
    temp_Agua: string | number | null;
    temp_Prod: string | number | null;
    niv_Agua: string | number | null;
    tiempo: number | null;
}

interface SectorIOEnfriador {
    entrada_agua: boolean;
    bomba_recirculacion: boolean;
    filtro_succion_agua: boolean;
    valvula_amoniaco: boolean;
}

export interface EnfriadorData {
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
    sectorIO: SectorIOEnfriador[];
}

interface EnfriadorContextType {
    enfriadorId: number;
    setEnfriadorId: (id: number) => void;
    enfriadorData: EnfriadorData;
    setEnfriadorData: (data: EnfriadorData) => void;
}

const EnfriadorContext = createContext<EnfriadorContextType | undefined>(undefined);

export const EnfriadorProvider = ({ children }: { children: React.ReactNode }) => {
    const [enfriadorId, setEnfriadorId] = useState<number>(() => {
        const saved = localStorage.getItem('lastEnfriadorId');
        return saved ? parseInt(saved) : 1;
    });

    useEffect(() => {
        localStorage.setItem('lastEnfriadorId', enfriadorId.toString());
    }, [enfriadorId]);

    const { data } = useWebSocketContext("enfriadores-datos");

    const [enfriadorData, setEnfriadorData] = useState<EnfriadorData>({
        num_enfriador: 0,
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
        if (data) {
            const selectedEnfriador = data.find(
                (item: { num_enfriador: number }) => item.num_enfriador === enfriadorId
            );

            if (selectedEnfriador) {
                const pasos = selectedEnfriador.pasos || [];
                const ultimoPaso = pasos.length > 0 ? pasos[pasos.length - 1] : null;

                setEnfriadorData({
                    num_enfriador: selectedEnfriador.num_enfriador,
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
            }
        }
    }, [data, enfriadorId]);

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

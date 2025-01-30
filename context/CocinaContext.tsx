"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CocinaData {
    tempIng: string | number | null;
    tempAgua: string | number | null;
    tempProd: string | number | null;
    nivAgua: string | number | null;
    nom_receta: string | null;
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
            if (selectedCocina.estado === "INACTIVO") {
                setCocinaData({
                    tempIng: "N/A",
                    tempAgua: "N/A",
                    tempProd: "N/A",
                    nivAgua: "N/A",
                    nom_receta: null,
                });
            } else {
                const paso = selectedCocina.pasos?.[0];
                setCocinaData({
                    tempIng: paso?.temp_Ing ?? "N/A",
                    tempAgua: paso?.temp_Agua ?? "N/A",
                    tempProd: paso?.temp_Prod ?? "N/A",
                    nivAgua: paso?.niv_Agua ?? "N/A",
                    nom_receta: selectedCocina.nom_receta ?? null,
                });
            }
            } else {
                setCocinaData({
                    tempIng: "N/A",
                    tempAgua: "N/A",
                    tempProd: "N/A",
                    nivAgua: "N/A",
                    nom_receta: null,
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

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useWebSocketContext } from "@/context/WebSocketContext";
import { CocinaData } from "@/utils/interface";

interface CocinaContextType {
  cocinaId: number;
  setCocinaId: (id: number) => void;
  cocinaData: CocinaData;
  setCocinaData: React.Dispatch<React.SetStateAction<CocinaData>>;
}

const CocinaContext = createContext<CocinaContextType | undefined>(undefined);

const defaultCocinaData: CocinaData = {
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
  sectorIO: []
};

export const CocinaProvider = ({ children }: { children: React.ReactNode }) => {
  const [cocinaId, setCocinaId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastCocinaId');
      return saved ? parseInt(saved) : 1;
    }
    return 1;
  });

  const { data: wsData, isConnected } = useWebSocketContext();
  const [cocinaData, setCocinaData] = useState<CocinaData>(defaultCocinaData);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastCocinaId', cocinaId.toString());
    }
  }, [cocinaId]);

  useEffect(() => {
    if (wsData && Array.isArray(wsData)) {
      const selectedCocina = wsData.find(
        (item: { num_cocina: number }) => item.num_cocina === cocinaId
      );

      if (selectedCocina) {
        const pasos = selectedCocina.pasos || [];
        const ultimoPaso = pasos.length > 0 ? pasos[pasos.length - 1] : null;

        setCocinaData({
          num_cocina: selectedCocina.num_cocina,
          tempIng: ultimoPaso?.temp_Ing ?? "N/A",
          tempAgua: ultimoPaso?.temp_Agua ?? "N/A",
          tempProd: ultimoPaso?.temp_Prod ?? "N/A",
          nivAgua: ultimoPaso?.niv_Agua ?? "N/A",
          nom_receta: selectedCocina.nom_receta ?? null,
          num_receta: selectedCocina.num_receta ?? null,
          estado: selectedCocina.estado ?? null,
          cant_torres: selectedCocina.cant_torres ?? null,
          tiempo: ultimoPaso?.tiempo ?? null,
          tipo_Fin: selectedCocina.tipo_Fin ?? null,
          pasos: pasos,
          ultimoPaso: ultimoPaso,
          sectorIO: selectedCocina.sector_io ?? []
        });
      }
    }
  }, [wsData, cocinaId]);

  return (
    <CocinaContext.Provider 
      value={{ 
        cocinaId, 
        setCocinaId, 
        cocinaData, 
        setCocinaData 
      }}
    >
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

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useWebSocketContext } from "@/context/WebSocketContext";
import { EnfriadorData } from "@/utils/interface";

interface EnfriadorContextType {
  enfriadorId: number;
  setEnfriadorId: (id: number) => void;
  enfriadorData: EnfriadorData;
  setEnfriadorData: React.Dispatch<React.SetStateAction<EnfriadorData>>;
}

const EnfriadorContext = createContext<EnfriadorContextType | undefined>(undefined);

const defaultEnfriadorData: EnfriadorData = {
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
  sectorIO: []
};

export const EnfriadorProvider = ({ children }: { children: React.ReactNode }) => {
  const [enfriadorId, setEnfriadorId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastEnfriadorId');
      return saved ? parseInt(saved) : 1;
    }
    return 1;
  });

  const { data: wsData, isConnected } = useWebSocketContext("enfriadores-datos");
  const [enfriadorData, setEnfriadorData] = useState<EnfriadorData>(defaultEnfriadorData);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastEnfriadorId', enfriadorId.toString());
    }
  }, [enfriadorId]);

  useEffect(() => {
    if (wsData && Array.isArray(wsData)) {
      const selectedEnfriador = wsData.find(
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
          sectorIO: selectedEnfriador.sector_io ?? []
        });
      }
    }
  }, [wsData, enfriadorId]);

  return (
    <EnfriadorContext.Provider 
      value={{ 
        enfriadorId, 
        setEnfriadorId, 
        enfriadorData, 
        setEnfriadorData 
      }}
    >
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

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useWebSocketContext } from "@/context/WebSocketContext";

interface SectorIO {
  filtro_succion_agua: boolean;
  entrada_agua: boolean;
  bomba_recirculacion: boolean;
  vapor_serpentina: boolean;
  vapor_vivo: boolean;
}

export interface CocinaDataCompleta {
  tipo: string;
  id: number;
  estado: string;
  temp_Agua: number;
  temp_Ingreso: number;
  niv_Agua: number;
  receta: string;
  tiempoTranscurrido: number;
  num_cocina: number;
  num_receta: number;
  nom_receta: string;
  cant_torres: number;
  tipo_Fin: number;
  sector_io: SectorIO[];
  historial: Array<{
    id: number;
    tiempo: number;
    temp_Agua: number;
    temp_Ingreso: number;
    estado: string;
  }>;
}

interface CocinaContextType {
  cocinaId: number;
  setCocinaId: (id: number) => void;
  cocinaData: CocinaDataCompleta | null;
  todasLasCocinas: CocinaDataCompleta[];
  setTodasLasCocinas: React.Dispatch<React.SetStateAction<CocinaDataCompleta[]>>;
}

const CocinaContext = createContext<CocinaContextType | undefined>(undefined);

export const CocinaProvider = ({ children }: { children: React.ReactNode }) => {
  const [cocinaId, setCocinaId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastCocinaId');
      return saved ? parseInt(saved) : 1;
    }
    return 1;
  });

  const { data: wsData } = useWebSocketContext();
  const [todasLasCocinas, setTodasLasCocinas] = useState<CocinaDataCompleta[]>([]);
  const [cocinaData, setCocinaData] = useState<CocinaDataCompleta | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastCocinaId', cocinaId.toString());
    }
  }, [cocinaId]);

  useEffect(() => {
    if (wsData && Array.isArray(wsData['datos-cocinas'])) {
      // Guardamos todas las cocinas
      const cocinas = wsData['datos-cocinas'].map((cocinaPar: any[]) => {
        const [datosPrincipales, datosSecundarios] = cocinaPar;
        return {
          ...datosPrincipales,
          ...datosSecundarios
        };
      });
      setTodasLasCocinas(cocinas);

      // Actualizamos la cocina seleccionada
      const cocinaSeleccionada = cocinas.find(cocina => cocina.num_cocina === cocinaId);
      if (cocinaSeleccionada) {
        setCocinaData(cocinaSeleccionada);
      }
    }
  }, [wsData, cocinaId]);

  return (
    <CocinaContext.Provider 
      value={{ 
        cocinaId, 
        setCocinaId, 
        cocinaData, 
        todasLasCocinas,
        setTodasLasCocinas
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

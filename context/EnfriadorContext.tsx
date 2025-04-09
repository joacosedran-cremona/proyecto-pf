"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useWebSocketContext } from "@/context/WebSocketContext";

interface SectorIO {
  filtro_succion_agua: boolean;
  entrada_agua: boolean;
  bomba_recirculacion: boolean;
  valvula_amoniaco: boolean;
}

export interface EnfriadorDataCompleta {
  id: number;
  num_enfriador: number;
  temperatura: number;
  nivel: number;
  receta: string;
  nro_receta: number;
  estado: string;
  torres: number;
  tiempo: number;
  fin: string;
  io_sector: {
      bomba: boolean;
      agua: boolean;
      filtro: boolean;
      amoniaco: boolean;
  }[];
}

interface EnfriadorContextType {
  enfriadorId: number;
  setEnfriadorId: (id: number) => void;
  enfriadorData: EnfriadorDataCompleta | null;
  todosLosEnfriadores: EnfriadorDataCompleta[];
  setTodosLosEnfriadores: React.Dispatch<React.SetStateAction<EnfriadorDataCompleta[]>>;
}

const EnfriadorContext = createContext<EnfriadorContextType | undefined>(undefined);

export const EnfriadorProvider = ({ children }: { children: React.ReactNode }) => {
  const [enfriadorId, setEnfriadorId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastEnfriadorId');
      return saved ? parseInt(saved) : 1;
    }
    return 1;
  });

  const { data: wsData } = useWebSocketContext();
  const [todosLosEnfriadores, setTodosLosEnfriadores] = useState<EnfriadorDataCompleta[]>([]);
  const [enfriadorData, setEnfriadorData] = useState<EnfriadorDataCompleta | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastEnfriadorId', enfriadorId.toString());
    }
  }, [enfriadorId]);

  useEffect(() => {
    if (wsData && Array.isArray(wsData['datos-enfriadores'])) {
      const enfriadores = wsData['datos-enfriadores'].map((enfriadorPar: any[]) => {
        const [datosPrincipales, datosSecundarios] = enfriadorPar;
        return {
          ...datosPrincipales,
          ...datosSecundarios
        };
      });
      setTodosLosEnfriadores(enfriadores);

      const enfriadorSeleccionado = enfriadores.find(
        enfriador => enfriador.id === enfriadorId
      );
      if (enfriadorSeleccionado) {
        setEnfriadorData(enfriadorSeleccionado);
      }
    }
  }, [wsData, enfriadorId]);

  return (
    <EnfriadorContext.Provider 
      value={{ 
        enfriadorId, 
        setEnfriadorId, 
        enfriadorData, 
        todosLosEnfriadores,
        setTodosLosEnfriadores
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

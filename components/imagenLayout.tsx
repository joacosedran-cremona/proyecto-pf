"use client";

import { useTranslation } from 'react-i18next';
import { useEffect, useState, useMemo } from 'react';
import { Image } from '@heroui/image';
import Link from 'next/link';
import { Tooltip } from "@heroui/tooltip";
import { useWebSocketContext } from "@/context/WebSocketContext";

interface Equipo {
  tipo: 'COCINA' | 'ENFRIADOR';
  id: number;
  estado: string;
  tempAguaActual: number;
  tempProductoActual: number;
  receta: string;
  tiempoTranscurrido: number;
}

interface Linea {
  id: number;
  equipos: Equipo[];
}

interface EquiposData {
  lineas: Linea[];
}

interface Section {
  id: number;
  name: string;
  key: string;
  path: string;
  style: React.CSSProperties;
}

interface LayoutTranslations {
  titulo: string;
  subtitulo: string;
  datos: {
    tempAgua: string;
    tempProd: string;
    receta: string;
    tiempo: string;
  };
  equipos: {
    [key: string]: string;  // Para mantener el formato C1L1, C2L1, etc.
  };
  tooltip: {
    cocina: string;
    enfriador: string;
  };
}

const h = "27.5%";
const topL1 = "9.3%";
const topL2 = "63%";
const width = "9.3%";

const leftPositions = {
  C1: "15.35%",
  C2: "25.2%",
  C3: "35.1%",
  E1: "44.96%",
  E2: "54.9%",
  E3: "64.65%",
  E4: "74.5%"
};

const sectionConfig = {
  cocinas: [
    { id: 1, key: 'cocina1', line: 1, position: 'C1' },
    { id: 2, key: 'cocina2', line: 1, position: 'C2' },
    { id: 3, key: 'cocina3', line: 1, position: 'C3' },
    { id: 4, key: 'cocina4', line: 2, position: 'C1' },
    { id: 5, key: 'cocina5', line: 2, position: 'C2' },
    { id: 6, key: 'cocina6', line: 2, position: 'C3' },
  ],
  enfriadores: [
    { id: 1, key: 'enfriador1', line: 1, position: 'E1' },
    { id: 2, key: 'enfriador2', line: 1, position: 'E2' },
    { id: 3, key: 'enfriador3', line: 1, position: 'E3' },
    { id: 4, key: 'enfriador4', line: 1, position: 'E4' },
    { id: 5, key: 'enfriador5', line: 2, position: 'E1' },
    { id: 6, key: 'enfriador6', line: 2, position: 'E2' },
    { id: 7, key: 'enfriador7', line: 2, position: 'E3' },
    { id: 8, key: 'enfriador8', line: 2, position: 'E4' },
  ]
};

function getEstadoColor(estado: string): string {
  const estadoUpper = estado.toUpperCase();
  if (estadoUpper === "FALLA") return "#C00";
  if (["COCINANDO", "PRE-CALENTADO", "ENFRIANDO", "PRE-ENFRIADO"].includes(estadoUpper)) return "#9b9D";
  if (estadoUpper === "PAUSA") return "#BB8D";
  if (estadoUpper === "FINALIZADO") return "#9bbD";
  if (estadoUpper === "INACTIVO") return "#666D";
  return "black";
}

export function ImagenLayout() {
  const { t } = useTranslation('layout');
  const [equiposData, setEquiposData] = useState<EquiposData | null>(null);
  const { data: wsData, isConnected } = useWebSocketContext("datos-home");

  const sections: Section[] = useMemo(() => {
    const generateSections = (config: any[], path: string, type: 'cocinas' | 'enfriadores') => {
      return config.map(({ id, key, position, line }) => {
        const translatedName = t(`equipos.${key}`, { defaultValue: key }); // Use defaultValue to ensure a fallback
        return {
          id: type === 'enfriadores' ? id + 6 : id,
          name: translatedName,
          key: key,
          path,
          style: {
            top: line === 1 ? topL1 : topL2,
            left: leftPositions[position as keyof typeof leftPositions],
            width,
            height: h
          }
        };
      });
    };

    return [
      ...generateSections(sectionConfig.cocinas, "/cocinas", 'cocinas'),
      ...generateSections(sectionConfig.enfriadores, "/enfriadores", 'enfriadores')
    ];
  }, [t]);

  useEffect(() => {
    console.log('Estado de conexión WebSocket:', isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (wsData) {
      console.log('Nuevo mensaje WebSocket recibido:', {
        timestamp: new Date().toISOString(),
        data: wsData
      });

      if ('lineas' in wsData && Array.isArray(wsData.lineas)) {
        console.log('Estructura de líneas:', wsData.lineas.map((l: Linea) => ({
          lineaId: l.id,
          cantidadEquipos: l.equipos?.length || 0
        })));

        setEquiposData(wsData as EquiposData);
      } else {
        console.error('Formato de datos inválido:', wsData);
      }
    }
  }, [wsData]);

    const getEquipoData = (section: Section): Equipo | undefined => {
    if (!equiposData) {
      console.log('No hay datos de equipos disponibles');
      return undefined;
    }

    const lineaNum = sectionConfig[section.path.slice(1) === 'cocinas' ? 'cocinas' : 'enfriadores'].find(conf => conf.key === section.key)?.line;

    if (!lineaNum) {
      console.log(`No se encontró la línea para la sección ${section.key}`);
      return undefined;
    }

    const linea = equiposData.lineas.find((l: Linea) => l.id === lineaNum);
    if (!linea) {
      console.log(`No se encontró la línea ${lineaNum}`);
      return undefined;
    }

    const tipo = section.path.slice(1) === 'cocinas' ? 'COCINA' : 'ENFRIADOR';

    const sectionConfigItem = sectionConfig[tipo === 'COCINA' ? 'cocinas' : 'enfriadores'].find(conf => conf.key === section.key);

    if (!sectionConfigItem) {
        console.log(`No se encontró la configuración para la sección ${section.key}`);
        return undefined;
    }

    const equipoEncontrado = linea.equipos.find(e => e.tipo === tipo && e.id === sectionConfigItem.id);

    console.log(`Resultado búsqueda ${section.key}:`, {
      encontrado: !!equipoEncontrado,
      datos: equipoEncontrado,
      linea: lineaNum,
      equiposEnLinea: linea.equipos.map(e => ({ tipo: e.tipo, id: e.id }))
    });

    return equipoEncontrado;
  };

  console.log('Sections generadas:', sections);

  return (
    <div className="w-auto h-full relative flex justify-center items-center">
      <Image
        className="h-[65vh] w-full z-1"
        src="/layout.png"
        alt="Imagen de prueba"
      />
      {!isConnected && (
        <div className="absolute top-0 left-0 bg-red-500 text-white p-2">
          WebSocket desconectado
        </div>
      )}
      {sections.map((section) => {
        const equipo = getEquipoData(section);
        console.log(`Renderizando sección ${section.key}:`, {
          section,
          equipoEncontrado: equipo
        });
        
        const equipoNum = section.id;
        const href = `${section.path}?id=${equipoNum}`;
        const recuadroStyle: React.CSSProperties = {
          ...section.style,
          backgroundColor: equipo ? getEstadoColor(equipo.estado) : "black",
        };
        const tipoEquipo = section.path.slice(1) === 'cocinas' ? 'cocina' : 'enfriador';
        const sectionConfigItem = sectionConfig[tipoEquipo === 'cocina' ? 'cocinas' : 'enfriadores'].find(conf => conf.key === section.key);
        const numeroEquipo = sectionConfigItem?.id || '1';
        const lineaEquipo = sectionConfigItem?.line || '1';
        
        return (
          <Link key={section.id} href={href} className="z-999">
            <Tooltip
              placement="top"
              content={t(`tooltip.${tipoEquipo}`, {
                number: numeroEquipo,
                line: lineaEquipo
              })}
            >
              <span 
                className="absolute shadow border z-999" 
                style={recuadroStyle}
                onClick={() => {
                  const idNumber = parseInt(String(numeroEquipo));
                  if (tipoEquipo === 'cocina') {
                    localStorage.setItem('lastCocinaId', idNumber.toString());
                  } else {
                    localStorage.setItem('lastEnfriadorId', idNumber.toString());
                  }
                }}
              >
                {equipo && (
                  <div className="text-white text-[calc(0.7vw+0.5vh)] text-stroke width-full font-bold p-3">
                    <div className="flex w-full justify-between">
                      <p className="text-white">{section.name}</p>
                      <p className="text-white">{equipo.estado}</p>
                    </div>
                    <p className="text-white">{t('datos.tempAgua')}: {equipo.tempAguaActual}</p>
                    <p className="text-white">{t('datos.tempProd')}: {equipo.tempProductoActual}</p>
                    <p className="text-white">{t('datos.receta')}: {equipo.receta}</p>
                    <p className="text-white">{t('datos.tiempo')}: {equipo.tiempoTranscurrido}</p>
                  </div>
                )}
              </span>
            </Tooltip>
          </Link>
        );
      })}
    </div>
  );
}
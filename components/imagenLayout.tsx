"use client";

import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Image } from '@heroui/image';
import Link from 'next/link';
import { Tooltip } from "@heroui/tooltip";
import { useWebSocketContext } from "@/context/WebSocketContext";
import { useCocinaContext } from "@/context/CocinaContext";
import { useEnfriadorContext } from "@/context/EnfriadorContext";

interface Equipo {
  tipo: 'COCINA' | 'ENFRIADOR';
  id: number;
  estado: string;
  tempAguaActual: number;
  tempProductoActual: number;
  receta: string;
  tiempoTranscurrido: string;
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
    tempIng: string;
    receta: string;
    tiempo: string;
  };
  equipos: {
    [key: string]: string;
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
    { id: 7,  key: 'enfriador1', line: 1, position: 'E1' },
    { id: 8,  key: 'enfriador2', line: 1, position: 'E2' },
    { id: 9,  key: 'enfriador3', line: 1, position: 'E3' },
    { id: 10, key: 'enfriador4', line: 1, position: 'E4' },
    { id: 11, key: 'enfriador5', line: 2, position: 'E1' },
    { id: 12, key: 'enfriador6', line: 2, position: 'E2' },
    { id: 13, key: 'enfriador7', line: 2, position: 'E3' },
    { id: 14, key: 'enfriador8', line: 2, position: 'E4' },
  ]
};

function getEstadoColor(estado: string): string {
  const estadoUpper = estado.toUpperCase();
  if (estadoUpper === "FALLA") return "#C13D";
  if (["COCINANDO", "PRE CALENTAMIENTO", "ENFRIANDO", "PRE ENFRIAMIENTO"].includes(estadoUpper)) return "#9b9D";
  if (estadoUpper === "PAUSA") return "#BB8D";
  if (estadoUpper === "FINALIZADO") return "#9bbD";
  if (estadoUpper === "INACTIVO") return "#666D";
  return "black";
}

export function ImagenLayout() {
  const { t } = useTranslation('layout');
  const { isConnected } = useWebSocketContext();
  const { cocinas } = useCocinaContext();
  const { enfriadores } = useEnfriadorContext();

  const sections: Section[] = useMemo(() => {
    const generateSections = (config: any[], path: string, type: 'cocinas' | 'enfriadores') => {
      return config.map(({ id, key, position, line }) => {
        const translatedName = t(`equipos.${key}`, { defaultValue: key });
        return {
          id: type === 'enfriadores' ? id : id,
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

  const getEquipoData = (section: Section): Equipo | undefined => {
    const tipoEquipo = section.path.slice(1) === 'cocinas' ? 'COCINA' : 'ENFRIADOR';
    
    if (tipoEquipo === 'COCINA') {
      const cocina = cocinas.find(c => c.info.id === section.id);
      if (cocina) {
        return {
          tipo: 'COCINA',
          id: cocina.info.id,
          estado: cocina.info.estado,
          tempAguaActual: cocina.info.temp_Agua,
          tempProductoActual: cocina.info.temp_Ingreso,
          receta: cocina.info.receta,
          tiempoTranscurrido: cocina.info.tiempoTranscurrido
        };
      }
    } else {
      const enfriador = enfriadores.find(e => e.info.id === section.id);
      if (enfriador) {
        return {
          tipo: 'ENFRIADOR',
          id: enfriador.info.id,
          estado: enfriador.info.estado,
          tempAguaActual: enfriador.info.temp_Agua,
          tempProductoActual: enfriador.info.temp_Ingreso,
          receta: enfriador.info.receta,
          tiempoTranscurrido: enfriador.info.tiempoTranscurrido
        };
      }
    }

    return {
      tipo: tipoEquipo,
      id: section.id,
      estado: 'INACTIVO',
      tempAguaActual: 0,
      tempProductoActual: 0,
      receta: '-',
      tiempoTranscurrido: "00:00"
    };
  };

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
        
        let numeroMostrado = sectionConfigItem?.id || '1';
        if (tipoEquipo === 'enfriador') {
          numeroMostrado = (sectionConfigItem?.id || 0) - 6;
        }

        const lineaEquipo = sectionConfigItem?.line || '1';
        
        return (
          <Link key={section.id} href={href} className="z-999">
            <Tooltip
              placement="top"
              content={t(`tooltip.${tipoEquipo}`, {
                number: tipoEquipo === 'cocina' ? section.id : (section.id - 6),
                line: lineaEquipo
              })}
            >
              <span
                className={`absolute shadow border z-999 rounded-md p-2 flex flex-col justify-between ${
                  equipo?.estado === 'FALLA' ? 'bg-red-600' :
                  equipo?.estado === 'PAUSA' ? 'bg-yellow-400' :
                  equipo?.estado === 'INACTIVO' ? 'bg-gray-600' :
                  equipo?.estado === 'FINALIZADO' ? 'bg-blue-400' :
                  'bg-green-600'
                }`}
                style={{
                  ...recuadroStyle,
                  color: 'white',
                  fontFamily: 'sans-serif',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)', // emula contorno
                }}
                onClick={() => {
                  if (tipoEquipo === 'cocina') {
                    localStorage.setItem('lastCocinaId', String(section.id));
                  } else {
                    localStorage.setItem('lastEnfriadorId', String(section.id));
                  }
                }}
              >
                {equipo && (
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-1 ml-2">
                      <p
                        className="font-extrabold uppercase"
                        style={{
                          fontSize: 'calc(0.9vw + 0.6vh)',
                          textShadow: '1px 1px 2px black',
                        }}
                      >
                        {section.name}
                      </p>
                      <p
                        className="font-extrabold uppercase"
                        style={{
                          fontSize: 'calc(0.4vw + 0.5vh)',
                          textShadow: '1px 1px 2px black',
                          marginRight: '3px',
                        }}
                      >
                        {equipo.estado}
                      </p>
                    </div>
                    <div className="mt-[10px]">
                      <p
                        className="font-bold"
                        style={{ fontSize: 'calc(0.7vw + 0.4vh)', textShadow: '1px 1px 2px black'}}
                      >
                        T. Ingreso: {equipo.tempProductoActual ?? '-'}
                      </p>
                      <p
                        className="font-bold"
                        style={{ fontSize: 'calc(0.7vw + 0.4vh)', textShadow: '1px 1px 2px black' }}
                      >
                        T. Agua: {equipo.tempAguaActual ?? '-'}
                      </p>
                      <p
                        className="font-bold"
                        style={{ fontSize: 'calc(0.7vw + 0.4vh)', textShadow: '1px 1px 2px black' }}
                      >
                        Receta: {equipo.receta ?? '-'}
                      </p>
                      <p
                        className="font-bold"
                        style={{ fontSize: 'calc(0.7vw + 0.4vh)', textShadow: '1px 1px 2px black' }}
                      >
                        Tiempo: {equipo.tiempoTranscurrido}
                      </p>
                    </div>
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
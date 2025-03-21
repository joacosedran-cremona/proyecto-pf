import { useTranslation } from 'react-i18next';
import { useEffect, useState, useMemo } from 'react';
import { Image } from '@heroui/image';
import Link from 'next/link';
import {Tooltip} from "@heroui/tooltip";

interface Equipo {
  id: string;
  nombre: string;
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
  equipmentId: string;
  path: string;
  style: React.CSSProperties;
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
    { id: 1, key: 'cocina1', line: 1, position: 'C1', equipmentId: 'C1L1' },
    { id: 2, key: 'cocina2', line: 1, position: 'C2', equipmentId: 'C2L1' },
    { id: 3, key: 'cocina3', line: 1, position: 'C3', equipmentId: 'C3L1' },
    { id: 4, key: 'cocina4', line: 2, position: 'C1', equipmentId: 'C1L2' },
    { id: 5, key: 'cocina5', line: 2, position: 'C2', equipmentId: 'C2L2' },
    { id: 6, key: 'cocina6', line: 2, position: 'C3', equipmentId: 'C3L2' },
  ],
  enfriadores: [
    { id: 1, key: 'enfriador1', line: 1, position: 'E1', equipmentId: 'E1L1' },
    { id: 2, key: 'enfriador2', line: 1, position: 'E2', equipmentId: 'E2L1' },
    { id: 3, key: 'enfriador3', line: 1, position: 'E3', equipmentId: 'E3L1' },
    { id: 4, key: 'enfriador4', line: 1, position: 'E4', equipmentId: 'E4L1' },
    { id: 5, key: 'enfriador5', line: 2, position: 'E1', equipmentId: 'E1L2' },
    { id: 6, key: 'enfriador6', line: 2, position: 'E2', equipmentId: 'E2L2' },
    { id: 7, key: 'enfriador7', line: 2, position: 'E3', equipmentId: 'E3L2' },
    { id: 8, key: 'enfriador8', line: 2, position: 'E4', equipmentId: 'E4L2' },
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

  const sections: Section[] = useMemo(() => [
    ...sectionConfig.cocinas.map(({ id, key, position, line, equipmentId }) => ({
      id,
      name: t(`cocinas.${key}`),
      equipmentId,
      path: "/cocinas",
      style: { 
        top: line === 1 ? topL1 : topL2,
        left: leftPositions[position as keyof typeof leftPositions],
        width,
        height: h
      }
    })),
    ...sectionConfig.enfriadores.map(({ id, key, position, line, equipmentId }) => ({
      id: id + 6,
      name: t(`enfriadores.${key}`),
      equipmentId,
      path: "/enfriadores",
      style: { 
        top: line === 1 ? topL1 : topL2,
        left: leftPositions[position as keyof typeof leftPositions],
        width,
        height: h
      }
    }))
  ], [t]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/home.json');
        const data: EquiposData = await response.json();
        setEquiposData(data);
      } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
      }
    };
    fetchData();
  }, []);

  const getEquipoData = (equipmentId: string): Equipo | undefined => {
    if (!equiposData) return undefined;
    for (const linea of equiposData.lineas) {
      const equipo = linea.equipos.find(e => e.id === equipmentId);
      if (equipo) return equipo;
    }
    return undefined;
  };

  return (
    <div className="w-auto h-full relative flex justify-center items-center">
      <Image
        className="h-[65vh] w-full z-1"
        src="/layout.png"
        alt="Imagen de prueba"
      />
      {sections.map((section) => {
        const equipo = getEquipoData(section.equipmentId);
        const href = `${section.path}?id=${section.equipmentId}`;
        const recuadroStyle: React.CSSProperties = {
          ...section.style,
          backgroundColor: equipo ? getEstadoColor(equipo.estado) : "black",
        };
        const match = section.equipmentId.match(/^([CE])(\d+)L(\d+)$/i);
        const tipoEquipo = match?.[1] === 'C' ? 'cocina' : 'enfriador';
        const numeroEquipo = match?.[2] || '1';
        const lineaEquipo = match?.[3] || '1';
        
        return (
          <Link key={section.id} href={href} className="z-999">
            <Tooltip
              placement="top"
              content={t(`tooltip.${tipoEquipo}`, {
                number: numeroEquipo,
                line: lineaEquipo
              })}
            >
              <span className="absolute shadow border z-999" style={recuadroStyle}>
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
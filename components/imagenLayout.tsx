import { useEffect, useState } from 'react';
import { Image } from '@heroui/image';
import Link from 'next/link';

// Definición de interfaces para tipar los datos
interface Equipo {
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

const sections: Section[] = [
  { id: 1,  name: "C1L1", path: "/cocinas",     style: { top: topL1, left: leftPositions.C1, width, height: h } },
  { id: 2,  name: "C2L1", path: "/cocinas",     style: { top: topL1, left: leftPositions.C2, width, height: h } },
  { id: 3,  name: "C3L1", path: "/cocinas",     style: { top: topL1, left: leftPositions.C3, width, height: h } },
  { id: 4,  name: "C1L2", path: "/cocinas",     style: { top: topL2, left: leftPositions.C1, width, height: h } },
  { id: 5,  name: "C2L2", path: "/cocinas",     style: { top: topL2, left: leftPositions.C2, width, height: h } },
  { id: 6,  name: "C3L2", path: "/cocinas",     style: { top: topL2, left: leftPositions.C3, width, height: h } },
  { id: 7,  name: "E1L1", path: "/enfriadores", style: { top: topL1, left: leftPositions.E1, width, height: h } },
  { id: 8,  name: "E2L1", path: "/enfriadores", style: { top: topL1, left: leftPositions.E2, width, height: h } },
  { id: 9,  name: "E3L1", path: "/enfriadores", style: { top: topL1, left: leftPositions.E3, width, height: h } },
  { id: 10, name: "E4L1", path: "/enfriadores", style: { top: topL1, left: leftPositions.E4, width, height: h } },
  { id: 11, name: "E1L2", path: "/enfriadores", style: { top: topL2, left: leftPositions.E1, width, height: h } },
  { id: 12, name: "E2L2", path: "/enfriadores", style: { top: topL2, left: leftPositions.E2, width, height: h } },
  { id: 13, name: "E3L2", path: "/enfriadores", style: { top: topL2, left: leftPositions.E3, width, height: h } },
  { id: 14, name: "E4L2", path: "/enfriadores", style: { top: topL2, left: leftPositions.E4, width, height: h } }
];


// Función que retorna el color de fondo según el estado del equipo
function getEstadoColor(estado: string): string {
  const estadoUpper = estado.toUpperCase();
  if (estadoUpper === "FALLA") return "#C00";
  if (
    estadoUpper === "COCINANDO" ||
    estadoUpper === "PRE-CALENTADO" ||
    estadoUpper === "ENFRIANDO" ||
    estadoUpper === "PRE-ENFRIADO"
  )
    return "#9b9D";
  if (estadoUpper === "PAUSA") return "#BB8D";
  if (estadoUpper === "FINALIZADO") return "#9bbD";
  if (estadoUpper === "INACTIVO") return "#666D";
  return "black";
}

export function ImagenLayout() {
  const [equiposData, setEquiposData] = useState<EquiposData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/home.json');
        const data: EquiposData = await response.json();
        setEquiposData(data);
      } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
      }
    }
    fetchData();
  }, []);

  function getEquipoData(sectionName: string): Equipo | undefined {
    if (!equiposData) return undefined;
  
    // Coincide con formatos: C<number>L<number> o E<number>L<number>
    const match = sectionName.match(/^([CE])(\d+)L(\d+)$/);
    if (match) {
      const [, letra, numStr, lineaStr] = match;
      const numero = parseInt(numStr, 10);
      const linea = parseInt(lineaStr, 10);
  
      if (letra === 'C') {
        // Busca en la línea correspondiente para cocina
        return equiposData.lineas.find((l: Linea) => l.id === linea)?.equipos.find(e => e.nombre === `C${numero}L${linea}`);
      } else if (letra === 'E') {
        // Busca en la línea correspondiente para enfriador
        return equiposData.lineas.find((l: Linea) => l.id === linea)?.equipos.find(e => e.nombre === `E${numero}L${linea}`);
      }
    }
  
    return undefined;
  }
  

  return (
    <div className="w-auto h-full relative flex justify-center items-center">
      <Image
        className="h-[65vh] w-full z-1"
        src="/layout.png"
        alt="Imagen de prueba"
      />
      {sections.map((section) => {
        const equipo = getEquipoData(section.name);
        // Se combinan los estilos de posición de la sección con el color de fondo según el estado del equipo.
        const recuadroStyle: React.CSSProperties = {
          ...section.style,
          backgroundColor: equipo ? getEstadoColor(equipo.estado) : "black",
        };

        return (
          <Link key={section.id} href={section.path} className="z-999">
            <span
              className="absolute shadow border z-999"
              style={recuadroStyle}
            >
              {equipo && (
                <div className="text-white text-[calc(0.7vw+0.5vh)] text-stroke width-full font-bold p-3">
                  <div className="flex w-full justify-between">
                    <p className= "text-white">{section.name}</p>
                    <p className= "text-white">{equipo.estado}</p>
                  </div>
                  <p className= "text-white">Temp Agua: {equipo.tempAguaActual}</p>
                  <p className= "text-white">Temp Prod: {equipo.tempProductoActual}</p>
                  <p className= "text-white">Receta: {equipo.receta}</p>
                  <p className= "text-white">Tiempo: {equipo.tiempoTranscurrido}</p>
                </div>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

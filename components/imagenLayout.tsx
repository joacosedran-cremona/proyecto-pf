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

const sections: Section[] = [
  { id: 1,  name: "C1L1", path: "/monitoreo", style: { top: "21%",   left: "15.35%", width: "9.3%", height: "18%" } },
  { id: 2,  name: "C2L1", path: "/monitoreo", style: { top: "21%",   left: "25.2%",  width: "9.3%", height: "18%" } },
  { id: 3,  name: "C3L1", path: "/monitoreo", style: { top: "21%",   left: "35.1%",  width: "9.2%", height: "18%" } },
  { id: 4,  name: "C1L2", path: "/monitoreo", style: { top: "55.9%", left: "15.35%", width: "9.3%", height: "18%" } },
  { id: 5,  name: "C2L2", path: "/monitoreo", style: { top: "55.9%", left: "25.2%",  width: "9.3%", height: "18%" } },
  { id: 6,  name: "C3L2", path: "/monitoreo", style: { top: "55.9%", left: "35.1%",  width: "9.3%", height: "18%" } },
  { id: 7,  name: "E1L1", path: "/monitoreo", style: { top: "21%",   left: "44.96%", width: "9.3%", height: "18%" } },
  { id: 8,  name: "E2L1", path: "/monitoreo", style: { top: "21%",   left: "54.9%",  width: "9.2%", height: "18%" } },
  { id: 9,  name: "E3L1", path: "/monitoreo", style: { top: "21%",   left: "64.75%", width: "9.3%", height: "18%" } },
  { id: 10, name: "E4L1", path: "/monitoreo", style: { top: "21%",   left: "74.5%",  width: "9.3%", height: "18%" } },
  { id: 11, name: "E1L2", path: "/monitoreo", style: { top: "55.9%", left: "44.96%", width: "9.3%", height: "18%" } },
  { id: 12, name: "E2L2", path: "/monitoreo", style: { top: "55.9%", left: "54.9%",  width: "9.3%", height: "18%" } },
  { id: 13, name: "E3L2", path: "/monitoreo", style: { top: "55.9%", left: "64.75%", width: "9.3%", height: "18%" } },
  { id: 14, name: "E4L2", path: "/monitoreo", style: { top: "55.9%", left: "74.5%",  width: "9.3%", height: "18%" } }
];

// Función que retorna el color de fondo según el estado del equipo
function getEstadoColor(estado: string): string {
  const estadoUpper = estado.toUpperCase();
  if (estadoUpper === "FALLA") return "#F00";
  if (
    estadoUpper === "COCINANDO" ||
    estadoUpper === "PRE-CALENTADO" ||
    estadoUpper === "ENFRIANDO" ||
    estadoUpper === "PRE-ENFRIADO"
  )
    return "#9A5E";
  if (estadoUpper === "PAUSA") return "#BB4E";
  if (estadoUpper === "FINALIZADO") return "#2ACE";
  if (estadoUpper === "INACTIVO") return "#888F";
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
        className="h-[82vh] w-full z-1"
        radius="md"
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
                <div className="text-white text-[calc(0.6vw+0.5vh)] text-stroke width-full font-bold p-3">
                  <div className="flex w-full justify-between">
                    <p>{section.name}</p>
                    <p>{equipo.estado}</p>
                  </div>
                  <p>Temp Agua: {equipo.tempAguaActual}</p>
                  <p>Temp Prod: {equipo.tempProductoActual}</p>
                  <p>Receta: {equipo.receta}</p>
                  <p>Tiempo: {equipo.tiempoTranscurrido}</p>
                </div>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

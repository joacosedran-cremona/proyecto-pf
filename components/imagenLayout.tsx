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
  { id: 1,  name: "Cocina 1",    path: "/cocinas",     style: { top: "21%",   left: "15.35%", width: "9.3%", height: "16.5%" } },
  { id: 2,  name: "Cocina 2",    path: "/cocinas",     style: { top: "21%",   left: "25.2%",  width: "9.3%", height: "16.5%" } },
  { id: 3,  name: "Cocina 3",    path: "/cocinas",     style: { top: "21%",   left: "35.1%",  width: "9.2%", height: "16.5%" } },
  { id: 4,  name: "Cocina 4",    path: "/cocinas",     style: { top: "55.9%", left: "15.35%", width: "9.3%", height: "18%" } },
  { id: 5,  name: "Cocina 5",    path: "/cocinas",     style: { top: "55.9%", left: "25.2%",  width: "9.3%", height: "18%" } },
  { id: 6,  name: "Cocina 6",    path: "/cocinas",     style: { top: "55.9%", left: "35.1%",  width: "9.3%", height: "18%" } },
  { id: 7,  name: "Enfriador 1", path: "/enfriadores", style: { top: "21%",   left: "44.96%", width: "9.3%", height: "16.5%" } },
  { id: 8,  name: "Enfriador 2", path: "/enfriadores", style: { top: "21%",   left: "54.9%",  width: "9.2%", height: "16.5%" } },
  { id: 9,  name: "Enfriador 3", path: "/enfriadores", style: { top: "21%",   left: "64.75%", width: "9.3%", height: "16.5%" } },
  { id: 10, name: "Enfriador 4", path: "/enfriadores", style: { top: "21%",   left: "74.5%",  width: "9.3%", height: "16.5%" } },
  { id: 11, name: "Enfriador 5", path: "/enfriadores", style: { top: "55.9%", left: "44.96%", width: "9.3%", height: "18%" } },
  { id: 12, name: "Enfriador 6", path: "/enfriadores", style: { top: "55.9%", left: "54.9%",  width: "9.3%", height: "18%" } },
  { id: 13, name: "Enfriador 7", path: "/enfriadores", style: { top: "55.9%", left: "64.75%", width: "9.3%", height: "18%" } },
  { id: 14, name: "Enfriador 8", path: "/enfriadores", style: { top: "55.9%", left: "74.5%",  width: "9.3%", height: "18%" } }
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
    return "#AAEE66";
  if (estadoUpper === "PAUSA") return "#FFFF66";
  if (estadoUpper === "FINALIZADO") return "#44CCEE";
  if (estadoUpper === "INACTIVO") return "#8D8D8D";
  return "black"; // Color por defecto si el estado no coincide
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
    let equipo: Equipo | undefined;
    if (sectionName.startsWith("Cocina")) {
      const number = parseInt(sectionName.replace("Cocina ", ""));
      if (number <= 3) {
        equipo = equiposData.lineas.find((linea: Linea) => linea.id === 1)?.equipos.find(e => e.nombre === `C${number}L1`);
      } else {
        const num = number - 3;
        equipo = equiposData.lineas.find((linea: Linea) => linea.id === 2)?.equipos.find(e => e.nombre === `C${num}L2`);
      }
    } else if (sectionName.startsWith("Enfriador")) {
      const number = parseInt(sectionName.replace("Enfriador ", ""));
      if (number <= 4) {
        equipo = equiposData.lineas.find((linea: Linea) => linea.id === 1)?.equipos.find(e => e.nombre === `E${number}L1`);
      } else {
        const num = number - 4;
        equipo = equiposData.lineas.find((linea: Linea) => linea.id === 2)?.equipos.find(e => e.nombre === `E${num}L2`);
      }
    }
    return equipo;
  }

  return (
    <div className="w-auto h-full relative flex justify-center items-center">
      <Image
        className="h-[75vh] w-full z-1"
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
              className="absolute shadow border text-white z-999"
              style={recuadroStyle}
            >
              <div>
                <strong>{section.name}</strong>
              </div>
              {equipo && (
                <div style={{ fontSize: "0.8rem", WebkitTextStroke: "2px black", WebkitTextFillColor: "white" }}>
                  <div>Estado: {equipo.estado}</div>
                  <div>Temp Agua: {equipo.tempAguaActual}</div>
                  <div>Temp Producto: {equipo.tempProductoActual}</div>
                  <div>Receta: {equipo.receta}</div>
                  <div>Tiempo: {equipo.tiempoTranscurrido}</div>
                </div>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

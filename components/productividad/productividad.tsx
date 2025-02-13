// Productividad.tsx
"use client";

import { useState } from "react";
import Metrics from "./metrica";
import BarraProductos from './barraProductos';
import BarraCiclos from "./barraCiclos";
import FiltroPeriodo from "./filtroPeriodo";

interface ProductoRealizado {
  NombreProducto: string;
  pesoTotal: number;
  cantidadCiclos: number;
  tiempoTotal: number;
}

interface FixedData {
  ProductosRealizados: ProductoRealizado[];
  PesoTotalCiclos: number;
}

interface DateRange {
  start: string;
  end: string;
}

// Datos fijos para simular la respuesta de la API
const fixedData: FixedData = {
  ProductosRealizados: [
    { NombreProducto: "Producto A", pesoTotal: 1000, cantidadCiclos: 5, tiempoTotal: 3600000 },
    { NombreProducto: "Producto B", pesoTotal: 1500, cantidadCiclos: 7, tiempoTotal: 5400000 },
    { NombreProducto: "Producto C", pesoTotal: 2000, cantidadCiclos: 10, tiempoTotal: 7200000 },
  ],
  PesoTotalCiclos: 4500,
};

// Array de ciclos realizados (para la barra de ciclos correctos/incorrectos)
interface Ciclo {
  id: number;
  producto: string;
  estado: "correcto" | "incorrecto";
}

const ciclosRealizados: Ciclo[] = [
  { id: 1, producto: "jamon", estado: "correcto" },
  { id: 2, producto: "salame", estado: "incorrecto" },
  { id: 3, producto: "queso", estado: "correcto" },
  { id: 4, producto: "mortadela", estado: "correcto" },
  { id: 5, producto: "chorizo", estado: "incorrecto" },
  { id: 6, producto: "pavo", estado: "correcto" },
  { id: 7, producto: "tocino", estado: "correcto" },
  { id: 8, producto: "pollo", estado: "incorrecto" },
  { id: 9, producto: "ternera", estado: "correcto" },
  { id: 10, producto: "carnaza", estado: "correcto" },
];

const Productividad = () => {
  const today: string = new Date().toISOString().split("T")[0];

  // Inicializamos con datos fijos y rango de fechas (hoy a hoy)
  const [data] = useState<FixedData>(fixedData);
  const [dateRange] = useState<DateRange>({
    start: today,
    end: today,
  });

  return (
    <div className="flex flex-row h-full gap-20">
      {/* Sección principal de productividad */}
      <div className="bg-black p-20 w-4/5 rounded-md">
        <Metrics data={data} dateRange={dateRange} />
        <hr className="my-20 border-2" />
        <BarraProductos data={data} />
        <hr className="my-20 border-2" />
        <BarraCiclos ciclosRealizados={ciclosRealizados} />
      </div>
      {/* Sección de filtro de fechas */}
      <div className="bg-black p-20 w-1/5 rounded-md">
        <FiltroPeriodo />
      </div>
    </div>
  );
};

export default Productividad;

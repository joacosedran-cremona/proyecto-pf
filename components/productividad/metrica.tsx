// Metrics.tsx
"use client";

import React from "react";

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

interface MetricsProps {
  data: FixedData;
  dateRange: DateRange;
}

const Metrics: React.FC<MetricsProps> = ({ data, dateRange }) => {
  const cantidadCiclosF: number = data.ProductosRealizados.reduce(
    (total, producto) => total + producto.cantidadCiclos,
    0
  );
  const PesoTotalCiclosNum: number = data.PesoTotalCiclos;
  const PesoTotalCiclosDisplay: string = PesoTotalCiclosNum.toFixed(2);

  const metrics = [
    { id: 1, titulo: "Ciclos realizados", dato: cantidadCiclosF },
    {
      id: 2,
      titulo: "Producción total",
      dato: (
        <span>
          {PesoTotalCiclosDisplay} <span className="text-lg">Tn</span>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl">PRODUCTIVIDAD</h2>
      <div>
        <span className="text-xl text-orange">{dateRange.start}</span>
        <span className="text-xl text-blue"> - </span>
        <span className="text-xl text-orange">{dateRange.end}</span>
      </div>
      <div className="w-full flex items-center justify-evenly">
        {metrics.map((m) => (
          <div key={m.id}>
            <p className="flex items-center justify-center text-4xl">{m.dato}</p>
            <p className="flex items-center justify-center text-2xl">{m.titulo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Metrics;

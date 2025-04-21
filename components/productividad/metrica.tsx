"use client";

import React from "react";
import Image from "next/image";

interface DateRange {
  start: string;
  end: string;
}

interface MetricsProps {
  ciclosRealizados: number;
  produccionTotal: number;
  dateRange: DateRange;
}

const Metrics: React.FC<MetricsProps> = ({ ciclosRealizados, produccionTotal, dateRange }) => {
  const metrics = [
    { 
      id: 1, 
      titulo: "Ciclos realizados", 
      dato: (
        <span className="flex items-center gap-2 mb-[3px]">
          {ciclosRealizados}
          <Image
            src="/ciclo.png"
            alt="Ciclo"
            width={24}
            height={24}
            className="ciclos-image ml-[-3px] mt-[20px]"
          />
        </span>
      )
    },
    {
      id: 2,
      titulo: "Producción total",
      dato: (
        <span>
          {produccionTotal.toFixed(2)} <span className="text-xl ml-[-8px] mb-[3px]">Tn</span>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-3xl text-white font-bold mb-[-3px]">PRODUCTIVIDAD</h2>
      <div>
        <span className="text-l text-orange">{dateRange.start}</span>
        <span className="text-l text-white"> - </span>
        <span className="text-l text-orange">{dateRange.end}</span>
      </div>
      <div className="w-[100%] flex items-center justify-evenly">
        {metrics.map((m) => (
          <div key={m.id} className="text-center">
            <div className="flex items-center justify-center text-5xl text-white font-bold">
              {m.dato}
            </div>
            <div className="text-2xl text-white">
              {m.titulo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Metrics;
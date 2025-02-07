// CiclosBar.tsx
"use client";

import React from "react";

interface Ciclo {
  id: number;
  producto: string;
  estado: "correcto" | "incorrecto";
}

interface CiclosBarProps {
  ciclosRealizados: Ciclo[];
}

const BarraCiclos: React.FC<CiclosBarProps> = ({ ciclosRealizados }) => {
  const totalCiclos = ciclosRealizados.length;
  const correctos = ciclosRealizados.filter((ciclo) => ciclo.estado === "correcto").length;
  const incorrectos = totalCiclos - correctos;

  const porcentajeCorrectos = (correctos / totalCiclos) * 100;
  const porcentajeIncorrectos = (incorrectos / totalCiclos) * 100;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">% Ciclos realizados correctamente</h2>
      <div className="flex h-[20px] rounded-[5px] overflow-hidden bg-[#444] mb-[15px]">
        <div
          className="h-full bg-green"
          style={{ width: `${porcentajeCorrectos}%` }}
        ></div>
        <div
          className="h-full bg-red"
          style={{ width: `${porcentajeIncorrectos}%` }}
        ></div>
      </div>
      <div className="flex justify-around flex-wrap">
        <div className="flex items-center my-[5px] mx-[10px]">
          <span className="w-[15px] h-[15px] rounded-[3px] mr-[5px] bg-green"></span>
          <p>{`Correctos - ${porcentajeCorrectos.toFixed(2)}%`}</p>
        </div>
        <div className="flex items-center my-[5px] mx-[10px]">
          <span className="w-[15px] h-[15px] rounded-[3px] mr-[5px] bg-red"></span>
          <p>{`Incorrectos - ${porcentajeIncorrectos.toFixed(2)}%`}</p>
        </div>
      </div>
    </div>
  );
};

export default BarraCiclos;

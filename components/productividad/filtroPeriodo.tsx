// FiltroPeriodo.tsx
"use client";

import React from "react";
import Selector from "../selectores/selectorLineas";
import DatePicker from "../dateRangePicker";
import ButtonAplicar from "../botones/botonAplicar";
import ButtonPDF from "../botones/botonPDF";
import ButtonExcel from "../botones/botonExcel";

const FiltroPeriodo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-20">
      <h2 className="flex items-center justify-center text-xl text-white">FILTRADO DE FECHAS</h2>

      <div className="flex w-full h-1/5">
        <Selector />
      </div>

      <div className="flex flex-col w-full h-4/5 gap-20">
        <DatePicker selectClasses="h-1/4" />
        <ButtonAplicar selectClasses="h-1/4" />
        <ButtonPDF selectClasses="h-1/4" />
        <ButtonExcel selectClasses="h-1/4" />
      </div>

      
    </div>
  );
};

export default FiltroPeriodo;

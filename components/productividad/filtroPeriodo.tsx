// FiltroPeriodo.tsx
"use client";

import React from "react";
import Selector from "./selector";
import DatePicker from "./dateRangePicker";
import ButtonAplicar from "./buttonAplicar";
import ButtonPDF from "./buttonPDF";
import ButtonExcel from "./buttonExcel";

const FiltroPeriodo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-20">
      <h2 className="flex items-center justify-center text-xl">FILTRADO DE FECHAS</h2>

      <div className="flex w-full h-1/5">
        <Selector />
      </div>

      <div className="flex flex-col w-full h-4/5 gap-20">
        <DatePicker />
        <ButtonAplicar />
        <ButtonPDF />
        <ButtonExcel />
      </div>

      
    </div>
  );
};

export default FiltroPeriodo;

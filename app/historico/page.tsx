"use client";

import React, { useState } from "react";
import Grafico from "@/components/graficos/graficoHistorico";
import Productividad from "@/components/productividad/productividad";
import Selector from "@/components/selectores/selectorHistorico";
import DatePicker from "@/components/dateRangePicker"
import BotonExcel from "@/components/botones/botonExcel";
import BotonPDF from "@/components/botones/botonPDF";
import BotonAplicar from "@/components/botones/botonAplicar";
import { useTranslation } from 'react-i18next';

export default function Historico() {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<"cocina" | "enfriador">("cocina");
  const [setData] = useState<any>(null);
  const [selectedValue, setSelectedValue] = useState(1);
  const { t } = useTranslation('hist_alert_tit');
  
  const handleDateChange = (start: Date | null, end: Date | null) => {
    // Aquí puedes usar las fechas seleccionadas
    console.log('Fechas seleccionadas en el padre:', { start, end });
  };

  const handleChange = (value: number) => {
    setSelectedValue(value);
  };

  const handleSelection = async (id: number) => {
    setSelectedId(id);
    if (id === 0) return;
    const type = id <= 6 ? "cocina" : "enfriador";
    setSelectedType(type);
    const filePath = type === "cocina" ? "/data/cocinas.json" : "/data/enfriadores.json";

    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error("Error al cargar el archivo JSON");
      }
      const jsonData = await response.json();
      const equipmentData = jsonData.find((item: any) => item.id === id);
      setData(equipmentData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(null);
    }
  };

  const borderColor = selectedType === "cocina" ? "border-orange" : "border-blue";
  const color = selectedType === "cocina" ? "orange" : "blue";

  return (
    <section className="flex flex-col w-full items-center justify-center gap-20">
      <div className="flex flex-row items-center justify-between bg-black p-4 w-full rounded-md">
        {/* Botones de exportación a la izquierda */}
        <div className="flex gap-10 ml-10">
          <BotonPDF selectClasses="text-white bg-red-700/50 hover:bg-red-800 min-h-[40px]" />
          <BotonExcel selectClasses="text-white bg-green-700 hover:bg-green-800 min-h-[40px]" />
        </div>

        {/* Texto central */}
        <div className="text-center text-white">
          <h2 className="text-md font-bold uppercase mb-[-6px]">FILTRAR POR</h2>
          <span className="text-sm">PERIODO</span>
        </div>

        {/* Selector de fechas y botón a la derecha */}
        <div className="flex gap-5 items-center mr-10">
          <Selector 
            selectClasses="text-white hover:bg-gray-700"
            value={selectedValue}
            onChange={handleChange}
          />
          <DatePicker 
            selectClasses="" 
            onDateChange={handleDateChange}
          />
          <BotonAplicar selectClasses="text-white hover:bg-gray-700 px-4 py-2 min-h-[40px]" />
        </div>
      </div>

      <div className="w-full h-[80vh]">
        <Grafico contextType={selectedType === "cocina" ? "cocinas" : "enfriadores"} />
      </div>
      <div className="w-full h-auto">
        <Productividad />
      </div>
    </section>
  );
}

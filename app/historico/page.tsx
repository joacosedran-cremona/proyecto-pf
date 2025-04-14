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
  // Remove duplicate/unused states
  const [selectedId, setSelectedId] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<"cocina" | "enfriador">("cocina");
  const [graphData, setGraphData] = useState<any>(null);
  const [tempSelectedValue, setTempSelectedValue] = useState(1);
  const [tempDateRange, setTempDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ startDate: null, endDate: null });

  const { t } = useTranslation('hist_alert_tit');
  
  const handleDateChange = (startDate: string | null, endDate: string | null) => {
    setTempDateRange({ startDate, endDate });
    console.log('🗓️ Fechas temporales almacenadas:', { startDate, endDate });
  };

  const handleChange = (value: number) => {
    setTempSelectedValue(value);
    console.log('🔄 Valor temporal almacenado:', value);
  };

  const handleApplyClick = async () => {
    // Preparar los datos a enviar
    const dataToSend = {
        id: tempSelectedValue,
        fecha_inicio: tempDateRange.startDate,
        fecha_fin: tempDateRange.endDate
    };

    // Log de los datos que se van a enviar
    console.log('📤 Datos a enviar:', dataToSend);

    try {
        const equipmentType = tempSelectedValue <= 6 ? "cocina" : "enfriador";
        const filePath = equipmentType === "cocina" ? "/data/cocinas.json" : "/data/enfriadores.json";
        
        // Actualizar estados locales
        setSelectedId(tempSelectedValue);
        setSelectedType(equipmentType);

        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error("Error al cargar el archivo JSON");
        }
        
        const jsonData = await response.json();
        const equipmentData = jsonData.find((item: any) => item.id === tempSelectedValue);
        setGraphData(equipmentData);

        // Log de confirmación de datos enviados
        console.log('✅ Datos enviados exitosamente:', dataToSend);
    } catch (error) {
        console.error("❌ Error al procesar los datos:", error);
        setGraphData(null);
    }
};

  return (
    <section className="flex flex-col w-full items-center justify-center gap-20">
      <div className="flex flex-row items-center justify-between bg-black p-4 w-full rounded-md">
        <div className="flex gap-10 ml-10">
          <BotonPDF selectClasses="text-white bg-red-700/50 hover:bg-red-800 min-h-[40px]" />
          <BotonExcel selectClasses="text-white bg-green-700 hover:bg-green-800 min-h-[40px]" />
        </div>

        <div className="text-center text-white">
          <h2 className="text-md font-bold uppercase mb-[-6px]">FILTRAR POR</h2>
          <span className="text-sm">PERIODO</span>
        </div>

        <div className="flex gap-5 items-center mr-10">
          <Selector 
            value={tempSelectedValue}
            onChange={handleChange}
            selectClasses="text-white hover:bg-gray-700"
          />
          <DatePicker 
            selectClasses="" 
            onDateChange={handleDateChange}
          />
          <BotonAplicar 
            selectClasses="text-white hover:bg-gray-700 px-4 py-2 min-h-[40px]"
            onClick={handleApplyClick}
          />
        </div>
      </div>

      <div className="w-full h-[80vh]">
        <Grafico 
          contextType={selectedType === "cocina" ? "cocinas" : "enfriadores"}
          id={selectedId}
          startDate={tempDateRange.startDate}
          endDate={tempDateRange.endDate}
        />
      </div>
      <div className="w-full h-auto">
        <Productividad />
      </div>
    </section>
  );
}
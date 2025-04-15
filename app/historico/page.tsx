"use client";

import React, { useState, useEffect } from "react";
import Grafico from "@/components/graficos/graficoHistorico";
import Productividad from "@/components/productividad/productividad";
import Selector from "@/components/selectores/selectorHistorico";
import DatePicker from "@/components/dateRangePicker"
import BotonExcel from "@/components/botones/botonExcel";
import BotonPDF from "@/components/botones/botonPDF";
import BotonAplicar from "@/components/botones/botonAplicar";
import { useTranslation } from 'react-i18next';

export default function Historico() {
  // Estados iniciales con valores por defecto
  const [selectedId, setSelectedId] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<"cocina" | "enfriador">("cocina");
  const [graphData, setGraphData] = useState<any>(null);
  const [tempSelectedValue, setTempSelectedValue] = useState(1);
  const [showGraphic, setShowGraphic] = useState(true);
  const [selectedCicloId, setSelectedCicloId] = useState<number>(1);
  const [tempDateRange, setTempDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ 
    startDate: '2000-01-01', 
    endDate: '2100-01-01' 
  });

  useEffect(() => {
    console.log('🚀 Valores iniciales:', {
      id: tempSelectedValue,
      cicloId: selectedCicloId, // Agregar log del ciclo
      fecha_inicio: tempDateRange.startDate,
      fecha_fin: tempDateRange.endDate
    });
  }, []);

  const { t } = useTranslation('hist_alert_tit');
  
  const handleDateChange = (startDate: string | null, endDate: string | null) => {
    setTempDateRange({ startDate, endDate });
  };

  const handleChange = (value: number) => {
    setTempSelectedValue(value);
  };

  const handleApplyClick = async () => {
    // Preparar los datos a enviar
    const dataToSend = {
        id: tempSelectedValue,
        fecha_inicio: tempDateRange.startDate,
        fecha_fin: tempDateRange.endDate
    };

    console.log('📤 Datos a enviar:', dataToSend);

    try {
        const equipmentType = tempSelectedValue <= 6 ? "cocina" : "enfriador";
        
        // Primero ocultamos el gráfico actual
        setShowGraphic(false);
        
        // Actualizar estados locales
        setSelectedId(tempSelectedValue);
        setSelectedType(equipmentType);
        setGraphData(null); // Limpiamos datos anteriores

        // Log de confirmación de datos enviados
        console.log('✅ Datos enviados exitosamente:', dataToSend);
    } catch (error) {
        console.error("❌ Error al procesar los datos:", error);
        setGraphData(null);
    }
};

  const handleCicloSelect = (cicloId: number) => {
    console.log('🎯 Ciclo seleccionado en Page:', cicloId);
    setSelectedCicloId(cicloId);
    setShowGraphic(true);
  };

  return (
    <section className="flex flex-col w-full items-center justify-center gap-20">
      <div className="flex flex-row items-center justify-between bg-black p-4 w-full rounded-md">
        <div className="flex gap-10 ml-10">
          <BotonPDF 
              selectClasses="text-white bg-red-700/50 hover:bg-red-800 min-h-[40px]"
              equipo={selectedType === "cocina" ? `Cocina ${selectedId}-L1` : `Enfriador ${selectedId}-L1`}
              cicloId={selectedCicloId}
          />
          <BotonExcel 
            selectClasses="text-white bg-green-700 hover:bg-green-800 min-h-[40px]"
            equipo={selectedType === "cocina" ? `Cocina ${selectedId}-L1` : `Enfriador ${selectedId}-L1`}
            cicloId={selectedCicloId}
          />
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
          showTableOnLoad={!showGraphic}
          onTableClose={() => setShowGraphic(true)}
          onCicloSelect={handleCicloSelect}
          selectedCicloId={selectedCicloId} // Add this prop
        />
      </div>
      <div className="w-full h-auto">
        <Productividad />
      </div>
    </section>
  );
}
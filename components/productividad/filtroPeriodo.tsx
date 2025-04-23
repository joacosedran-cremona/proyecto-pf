"use client";

import React, { useState, useEffect } from "react";
import Selector from "../selectores/selectorLineasProductividad";
import SelectorEquipos from "../selectores/selectorEquipo";
import DatePicker from "@/ui/datePickerProductividad";
import ButtonAplicar from "../botones/botonAplicarProductividad";
import ButtonPDF from "../botones/botonPDFProductividad";
import ButtonExcel from "../botones/botonExcelProductividad";
import { useTranslation } from 'react-i18next';  

interface FiltroPeriodoProps {
    onApplyFilters: (data: {
        startDate: string | null,
        endDate: string | null,
        lineaId: number,
        equipoId: number,
        dato_enviado?: number,
        isUserInitiated?: boolean // Add this flag
    }) => void;
}

const FiltroPeriodo: React.FC<FiltroPeriodoProps> = ({ onApplyFilters }) => {
    // Inicializar con fechas por defecto
    const today = new Date().toISOString().split('T')[0];
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekFormatted = lastWeek.toISOString().split('T')[0];
  
    const [startDate, setStartDate] = useState<string | null>(lastWeekFormatted);
    const [endDate, setEndDate] = useState<string | null>(today);
    const [selectedLinea, setSelectedLinea] = useState<number>(0);
    const [selectedEquipo, setSelectedEquipo] = useState<number>(30);
    const [datoEnviado, setDatoEnviado] = useState<number>(0);
    const { t } = useTranslation('productividad');
  
    // Remove this useEffect that's overriding your date selections
    // The parent component already handles the initial load
  
    useEffect(() => {
        // Calcula el datoEnviado basado en las condiciones
        let dato = 0;
        if (selectedLinea === 0) {
            dato = 0;
        } else if ((selectedLinea === 15 || selectedLinea === 16) && selectedEquipo === 30) {
            dato = selectedLinea;
        } else if ((selectedLinea === 15 || selectedLinea === 16) && selectedEquipo >= 1 && selectedEquipo <= 14) {
            dato = selectedEquipo;
        }
        setDatoEnviado(dato);
    }, [selectedLinea, selectedEquipo]);
  
    const handleDateChange = (start: string | null, end: string | null) => {
      console.log("Nuevas fechas seleccionadas:", start, end);
      setStartDate(start);
      setEndDate(end);
    };

    const handleLineaChange = (value: number) => {
        setSelectedLinea(value);
        if (value === 0) {
            setSelectedEquipo(30); // Reset equipo when linea is Completo
        }
    };

    const handleEquipoChange = (value: number) => {
        setSelectedEquipo(value);
    };

    const handleApply = () => {
        if (!startDate || !endDate) return; 
        
        console.log('Aplicando filtros con fechas:', startDate, endDate);
        
        onApplyFilters({
            startDate,
            endDate,
            lineaId: selectedLinea,
            equipoId: selectedEquipo,
            dato_enviado: datoEnviado,
            isUserInitiated: true // Mark this as user initiated
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-[100%] gap-[15px]">
            <h2 className="flex items-center justify-center text-xl text-white font-bold">{t('filtro.titulo')}</h2>
            <h2 className="flex items-center justify-center text-l text-white mt-[-18]">{t('filtro.subtitulo')}</h2>

            <div className="flex w-[100%] h-1/5">
                <Selector onLineaChange={handleLineaChange} />
            </div>

            <div className="flex w-[100%] h-1/5">
                <SelectorEquipos 
                    onEquipoChange={handleEquipoChange} 
                    disabled={selectedLinea === 0}
                    lineaSeleccionada={selectedLinea}
                />
            </div>

            <div className="flex flex-col w-[100%] h-4/5 gap-[10px]">
                <DatePicker 
                    selectClasses="h-1/4" 
                    onDateChange={handleDateChange}
                    defaultStartDate={lastWeekFormatted}
                    defaultEndDate={today}
                />
                <ButtonAplicar 
                    selectClasses="h-1/4"
                    startDate={startDate}
                    endDate={endDate}
                    lineaId={selectedLinea}
                    equipoId={selectedEquipo}
                    dato_enviado={datoEnviado}
                    onApplyFilters={handleApply}
                />
                <ButtonPDF 
                    selectClasses="h-1/4" 
                    lineaId={selectedLinea}
                    equipoId={selectedEquipo}
                />
                <ButtonExcel 
                    selectClasses="h-1/4"
                    startDate={startDate}
                    endDate={endDate}
                    dato_enviado={datoEnviado}
                />
            </div>
        </div>
    );
};

export default FiltroPeriodo;
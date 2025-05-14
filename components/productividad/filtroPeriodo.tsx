"use client";

import React, { useState, useEffect } from "react";
import Selector from "../selectores/selectorLineasProductividad";
import SelectorEquipos from "../selectores/selectorEquipo";
import DatePicker from "@/ui/datePickerProductividad";
import ButtonAplicar from "../botones/botonAplicarProductividad";
import BotonInformeProductividad from "../botones/botonInformeProductividad"; // Importar el nuevo botón
import { useTranslation } from 'react-i18next';  

interface FiltroPeriodoProps {
    onApplyFilters: (data: {
        startDate: string | null,
        endDate: string | null,
        lineaId: number,
        equipoId: number,
        dato_enviado?: number,
        isUserInitiated?: boolean 
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
  
    useEffect(() => {
        // Calcula el datoEnviado basado en las condiciones
        let dato = 0;
        if (selectedLinea === 0) { // Completo (todas las líneas)
            dato = 0;
        } else if ((selectedLinea === 15 || selectedLinea === 16) && selectedEquipo === 30) { // Línea específica, todos los equipos
            dato = selectedLinea;
        } else if ((selectedLinea === 15 || selectedLinea === 16) && selectedEquipo >= 1 && selectedEquipo <= 14) { // Línea específica, equipo específico
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
        if (value === 0) { // Si se selecciona "Completo" para línea
            setSelectedEquipo(30); // Resetear equipo a "Todos los equipos"
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
            isUserInitiated: true 
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-[100%] gap-[15px]">
            <h2 className="flex items-center justify-center text-xl text-white font-bold">{t('filtro.titulo')}</h2>
            <h2 className="flex items-center justify-center text-l text-white mt-[-18px]">{t('filtro.subtitulo')}</h2>

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
                <BotonInformeProductividad
                    selectClasses="h-1/4"
                    lineaId={selectedLinea}
                    equipoId={selectedEquipo}
                    startDate={startDate}
                    endDate={endDate}
                />
            </div>
        </div>
    );
};

export default FiltroPeriodo;
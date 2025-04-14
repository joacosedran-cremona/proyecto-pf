"use client";

//React
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineExclamationCircle } from "react-icons/ai";

//ChartJs
import { Chart, registerables, ChartConfiguration, Plugin } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

//Context y Funciones
import { useLinea, type LineaId } from '@/context/LineaContext';
import { transformData } from '@/utils/logicaGraficosLinea';

//HeroUI
import { Button } from '@heroui/react';

//Idioma
import { useTranslation } from 'react-i18next';

Chart.register(...registerables);
Chart.register(zoomPlugin);

interface InfoEquipo {
    tipo: 'COCINA' | 'ENFRIADOR';
    id: number;
    estado: 'ACTIVO' | 'INACTIVO' | 'FALLA' | 'OPERATIVO' | 'FINALIZADO' | 'PRE CALENTAMIENTO' | 'PRE ENFRIAMIENTO';
    temp_agua: number;
    temp_prod: number;
    temp_ingreso: number;
    temp_chiller: number;
    niv_agua: number;
    receta: string;
    receta_paso_actual: number;
    tiempoTranscurrido: number;
    num_cocina?: number;
    num_enfriador?: number;
}

interface DetallesEquipo {
    historial: Array<{
        id_historial: number;
        tiempo: number;
        temp_agua: number;
        temp_ingreso: number;
        estado: string;
    }>;
}

const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} HS`;
};

// Modificar la definición del componente para recibir solo el id
const Grafico: React.FC<{ id: number }> = ({ id }) => {
    const { t } = useTranslation('grafico');
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart<'line'> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
    const [hasCachedData, setHasCachedData] = useState<boolean>(false);
    const { lineasData, lineaSeleccionada } = useLinea();
    
    // Determinar el tipo de equipo basado en el ID
    const contextType = id <= 6 ? 'cocinas' : 'enfriadores';

    useEffect(() => {
        if (!lineasData) {
            // Verificar si hay datos en caché
            const cachedData = localStorage.getItem(`equipo-${id}`);
            if (cachedData) {
                setHasCachedData(true);
                setLoading(false);
            } else {
                setHasCachedData(false);
                setLoading(true);
            }
            return;
        }

        // Obtener los datos del equipo según la línea seleccionada
        const lineaActual = lineasData?.[lineaSeleccionada];

        try {
            const image = new Image();
            image.src = '/creminox.png';

            const plugin: Plugin = {
                id: 'customCanvasBackgroundImage',
                beforeDraw: (chart: Chart) => {
                    if (image.complete) {
                        const ctx = chart.ctx;
                        const { top, left, width, height } = chart.chartArea;
                        ctx.save();
                        ctx.globalAlpha = 0.2;

                        const imageWidth = width * 0.5;
                        const imageHeight = (image.height / image.width) * imageWidth;
                        const x = left + (width - imageWidth) / 2;
                        const y = top + (height - imageHeight) / 2;

                        ctx.drawImage(image, x, y, imageWidth, imageHeight);
                        ctx.restore();
                    } else {
                        image.onload = () => chart.draw();
                    }
                }
            };

            const chartData = transformData(
                id,
                lineaActual?.cocinas || [],
                lineaActual?.enfriadores || []
            );

            if (chartRef.current) {
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                const ctx = chartRef.current.getContext('2d');
                if (ctx) {
                    const config: ChartConfiguration<'line'> = {
                        type: 'line',
                        data: chartData,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        usePointStyle: true,
                                    },
                                    display: false
                                },
                                title: {
                                    align: 'start',
                                    color: '#D9D9D9',
                                    display: false, // Desactivamos el título nativo ya que ahora usamos el div
                                    font: {
                                        weight: 'normal',
                                        size: 20,
                                    },
                                    padding: {
                                        top: 0,
                                        bottom: 15,
                                    },
                                },
                                zoom: {
                                    pan: {
                                        enabled: false,
                                    },
                                    zoom: {
                                        wheel: {
                                            enabled: false,
                                        },
                                        pinch: {
                                            enabled: false,
                                        },
                                        mode: 'x',
                                    },
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const datasetLabel = context.dataset.label || t('datos.temperatura');
                                            const temperature = context.parsed.y;
                                            const totalSeconds = Math.floor(context.parsed.x);

                                            const hours = Math.floor(totalSeconds / 3600);
                                            const minutes = Math.floor((totalSeconds % 3600) / 60);
                                            const seconds = totalSeconds % 60;
                                            const timeFormatted = `${hours.toString().padStart(2, '0')}:${minutes
                                                .toString()
                                                .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                                            return [
                                                `${t('tooltip')}: ${timeFormatted}`,
                                                `${datasetLabel}: ${temperature}°C`,
                                            ];
                                        },
                                        title: () => '',
                                    },
                                },
                            },
                            animation: {
                                duration: isFirstLoad ? 750 : 0
                            },
                            transitions: {
                                zoom: {
                                    animation: {
                                        duration: 0
                                    }
                                },
                                active: {
                                    animation: {
                                        duration: 0
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    title: {
                                        display: true,
                                        text: t('ejes.y'),
                                    },
                                    beginAtZero: true,
                                    border: {
                                        color: '#D9D9D9'
                                    },
                                    grid: {
                                        color: '#1F1F1F',
                                        tickColor: '#fff'
                                    }
                                },
                                x: {
                                    type: 'linear',
                                    position: 'bottom',
                                    min: 0,
                                    ticks: {
                                        stepSize: 10,
                                        callback: (value) => {
                                            const totalSeconds = Math.floor(Number(value));
                                            const hours = Math.floor(totalSeconds / 3600);
                                            const minutes = Math.floor((totalSeconds % 3600) / 60);
                                            const seconds = totalSeconds % 60;

                                            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                                        }
                                    },
                                    afterBuildTicks: (axis) => {
                                        axis.ticks = axis.ticks.filter(t => t.value >= 0);
                                    },
                                    title: {
                                        display: true,
                                        text: t('ejes.x'),
                                    },
                                    border: {
                                        color: '#D9D9D9'
                                    },
                                    grid: {
                                        color: '#1F1F1F',
                                        tickColor: '#fff'
                                    },
                                    bounds: 'ticks',
                                    grace: '5%',
                                }
                            },
                        },
                        plugins: [plugin],
                    };

                    chartInstanceRef.current = new Chart(ctx, config);
                    if (isFirstLoad) {
                        setIsFirstLoad(false);
                    }
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(true);
        }
    }, [lineasData, lineaSeleccionada, id, t, isFirstLoad]);

    const resetZoom = () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.resetZoom();
        }
    };

    // Buscar el equipo en los datos de la línea seleccionada
    const equipos = lineasData?.[lineaSeleccionada]?.[contextType] || [];
    const equipo = equipos.find((value: [InfoEquipo, DetallesEquipo]) => value[0].id === id)?.[0];

    if (!equipo) {
        return (
            <div className="bg-midGrey p-20 h-full w-full rounded-md flex flex-col items-center justify-center text-white gap-20">
                <AiOutlineExclamationCircle className="w-auto h-1/4" />
                <p className="text-3xl text-white text-center">{t('equipoNoEncontrado')}</p>
            </div>
        );
    }

    if (equipo.estado === 'INACTIVO') {
        const nombreEquipo = contextType === 'cocinas' && 'num_cocina' in equipo
            ? `${t('equipo.cocina')} ${equipo.num_cocina}`
            : contextType === 'enfriadores' && 'num_enfriador' in equipo
            ? `${t('equipo.enfriador')} ${equipo.num_enfriador}`
            : t('equipo.desconocido');

        return (
            <div className="bg-midGrey p-20 h-full w-full rounded-md flex flex-col items-center justify-center text-white gap-20">
                <AiOutlineExclamationCircle className="w-auto h-1/4" />
                <p className="text-3xl text-white text-center">{nombreEquipo} - {t('inactividad.titulo')}</p>
                <p className="text-xl text-white text-center">{t('inactividad.mensaje')}</p>
            </div>
        );
    }

    if (equipo.estado === 'FALLA') {
        const nombreEquipo = contextType === 'cocinas' && 'num_cocina' in equipo
            ? `${t('equipo.cocina')} ${equipo.num_cocina}`
            : contextType === 'enfriadores' && 'num_enfriador' in equipo
            ? `${t('equipo.enfriador')} ${equipo.num_enfriador}`
            : t('equipo.desconocido');

        return (
            <div className="bg-redChill p-20 h-full w-full rounded-md flex flex-col items-center justify-center text-white gap-20">
                <AiOutlineExclamationCircle className="w-auto h-1/4" />
                <p className="text-3xl text-white">{nombreEquipo} - {t('error.titulo')}</p>
                <p className="text-xl text-white">{t('error.mensaje')}</p>
            </div>
        );
    }

    return (
        <div className="bg-black p-6 h-full w-full rounded-md relative text-white">
          <div className="flex h-[20%] justify-between p-5">
            <div className="flex items-start gap-6">
                <div className={`text-[28px] font-bold ${equipo.tipo === 'COCINA' ? 'text-[#ff7f2a]' : 'text-[#3AF]'}`}>
                {equipo.tipo === 'COCINA' 
                ? `C${equipo.id}` 
                : `E${equipo.id-6}`}
                </div>
              <div className="text-sm leading-tight">
                <div>
                  <span className="font-semibold"></span> {equipo.receta}
                </div>
                <div>
                  <span className="font-semibold">ESTADO:</span> {equipo.estado}
                </div>
                <div>
                  <span className="font-semibold">TIEMPO:</span> {formatTime(equipo.tiempoTranscurrido)}
                </div>
              </div>
            </div>
      
            {/* Derecha: Temperaturas */}
            <div className="text-right text-sm">
              <div className={`${equipo.tipo === 'COCINA' ? 'text-[#ff7f2a]' : 'text-[#3AF]'} font-semibold`}>
                TEMP. AGUA: <span className="text-white">{equipo.temp_agua.toFixed(1)}°C</span>
              </div>
              <div className={`${equipo.tipo === 'COCINA' ? 'text-[#ff7f2a]' : 'text-[#3AF]'} font-semibold`}>
                TEMP. PROD: <span className="text-white">{equipo.temp_prod.toFixed(1)}°C</span>
              </div>
            </div>
          </div>
      
          <canvas ref={chartRef} className="block w-full max-h-[80%] px-6" />
      
          {loading && !hasCachedData && (
            <div className="flex absolute items-center justify-center h-full w-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto" />
                <p className="mt-4">Conectando al servidor...</p>
              </div>
            </div>
          )}
        </div>
      );      
};

export default Grafico;
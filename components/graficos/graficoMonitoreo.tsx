"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables, ChartConfiguration, Plugin } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useLinea } from '@/context/LineaContext';
import { transformData } from '../../utils/logicaGraficosLinea';
import { Button, Spinner } from '@heroui/react';
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useTranslation } from 'react-i18next';

Chart.register(...registerables);
Chart.register(zoomPlugin);

const Grafico: React.FC<{ contextType: 'cocinas' | 'enfriadores'; id: number }> = ({ contextType, id }) => {
    const { t } = useTranslation('grafico');
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart<'line'> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { lineaSeleccionada, lineasData } = useLinea();

    useEffect(() => {
        if (!lineasData) {
            setLoading(true);
            return;
        }

        const equipo = contextType === 'cocinas'
            ? lineasData.cocinas.find(e => e.num_cocina === id)
            : lineasData.enfriadores.find(e => e.num_enfriador === id);

        if (!equipo || !equipo.pasos || !chartRef.current) {
            setLoading(true);
            return;
        }

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) {
            setLoading(true);
            return;
        }

        // Destruir la instancia previa, si existe
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

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

        const chartData = transformData(equipo.pasos);

        const nombreEquipo = contextType === 'cocinas' 
            ? `${t('equipo.cocina')} ${id}`
            : `${t('equipo.enfriador')} ${id}`;

        const tituloColor = contextType === 'cocinas' ? '#EF8225' : '#3AF';

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
                        }
                    },
                    title: {
                        align: 'start',
                        display: true,
                        text: nombreEquipo,
                        color: tituloColor,
                        font: {
                            weight: 'normal',
                            size: 20
                        },
                        padding: {
                            top: 0,
                            bottom: 0
                        }
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x',
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true
                            },
                            mode: 'x',
                        }
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
                                const timeFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                                return [
                                    `${t('tooltip')}: ${timeFormatted}`,
                                    `${datasetLabel}: ${temperature}°C`
                                ];
                            },
                            title: () => ''
                        }
                    }
                },
                transitions: {
                    zoom: {
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
                                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                            }
                        },
                        title: {
                            display: true,
                            text: t('ejes.xLinea'),
                        },
                        border: {
                            color: '#D9D9D9'
                        },
                        grid: {
                            color: '#1F1F1F',
                            tickColor: '#fff'
                        }
                    }
                }
            },
            plugins: [plugin]
        };

        chartInstanceRef.current = new Chart(ctx, config);
        setLoading(false);

        return () => chartInstanceRef.current?.destroy();
    }, [lineasData, lineaSeleccionada, contextType, id, t]);

    // Si el equipo está inactivo se muestra un mensaje
    const equipo = contextType === 'cocinas'
        ? lineasData?.cocinas.find(e => e.num_cocina === id)
        : lineasData?.enfriadores.find(e => e.num_enfriador === id);

    // Primero, si no existe el equipo, retornamos un mensaje o un estado de carga.
    if (!equipo) {
        return (
            <div className="bg-midGrey p-20 h-full w-full rounded-md flex flex-col items-center justify-center text-white gap-20">
                <AiOutlineExclamationCircle className="w-auto h-1/4"/>
                <p className="text-3xl text-white">{t('equipoNoEncontrado')}</p>
            </div>
        );
    }
    
    if (equipo.estado === 'INACTIVO') {
        const nombreEquipo = contextType === 'cocinas' 
            ? `${t('equipo.cocina')} ${id}`
            : `${t('equipo.enfriador')} ${id}`;
            
        return (
            <div className="bg-midGrey p-20 h-full w-full rounded-md flex flex-col items-center justify-center text-white gap-20">
                <AiOutlineExclamationCircle className="w-auto h-1/4"/>
                <p className="text-3xl text-white">{nombreEquipo} - {t('inactividad.titulo')}</p>
                <p className="w-full text-center text-xl text-white">{t('inactividad.mensaje')}</p>
            </div>
        );
    }

    if (equipo.estado === 'FALLA') {
        const nombreEquipo = contextType === 'cocinas' 
            ? `${t('equipo.cocina')} ${id}`
            : `${t('equipo.enfriador')} ${id}`;

        return (
            <div className="bg-redChill p-20 h-full w-full rounded-md flex flex-col items-center justify-center text-white gap-20">
                <AiOutlineExclamationCircle className="w-auto h-1/4"/>
                <p className="text-3xl text-white">{nombreEquipo} - {t('error.titulo')}</p>
                <p className="w-full text-center text-3xl text-white">{t('error.mensaje')}</p>
            </div>
        );
    }

    // Función para reiniciar el zoom
    const resetZoom = () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.resetZoom();
        }
    };

    return (
        <div className="flex bg-black p-20 h-full w-full rounded-md 1365:w-full 1365:h-full relative">
            <canvas ref={chartRef} className="flex block w-full h-full max-h-screen"></canvas>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-75 rounded-xl">
                    <Spinner label={t('cargando')} />
                </div>
            )}
            <Button
                onClick={resetZoom}
                style={{
                    backgroundColor: "#333",
                    border: "1px solid #CCC",
                    color: "#CCC",
                    width: "auto",
                    height: "25px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "10px",
                }}
                className="absolute bottom-[15px] left-[20px] text-white bg-grey hover:text-black hover:bg-lightGrey px-3 rounded-md"
            >
                {t('reiniciarZoom')}
            </Button>
        </div>
    );
};

export default Grafico;

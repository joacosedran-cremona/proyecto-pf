"use client";
import React, { useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration, Plugin } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useLinea } from '@/context/LineaContext';
import { transformData } from '../utils/logicaGraficosLinea';

Chart.register(...registerables);
Chart.register(zoomPlugin);

const Grafico: React.FC<{ contextType: 'cocinas' | 'enfriadores'; id: number }> = ({ contextType, id }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const { lineaSeleccionada, lineasData } = useLinea();

    useEffect(() => {
        if (!lineasData) return;

        const equipo = contextType === 'cocinas' ? 
            lineasData.cocinas.find(e => e.num_cocina === id) : 
            lineasData.enfriadores.find(e => e.num_enfriador === id);

        if (!equipo || !equipo.pasos || !chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

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

        const nombreEquipo = contextType === 'cocinas' ? `Cocina ${id}` : `Enfriador ${id}`;
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
                                const datasetLabel = context.dataset.label || 'Temperatura';
                                const temperature = context.parsed.y;
                                const totalSeconds = Math.floor(context.parsed.x);

                                const hours = Math.floor(totalSeconds / 3600);
                                const minutes = Math.floor((totalSeconds % 3600) / 60);
                                const seconds = totalSeconds % 60;
                                const timeFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                                return [
                                    `Tiempo transcurrido: ${timeFormatted}`,
                                    `${datasetLabel}: ${temperature}°C`
                                ];
                            },
                            title: () => {
                                return ''; 
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Temperatura (°C)',
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
                        title: {
                            display: true,
                            text: 'Tiempo (hh:mm:ss)',
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

        const chartInstance = new Chart(ctx, config);

        return () => {
            chartInstance.destroy();
        };
    }, [lineasData, lineaSeleccionada, contextType, id]);

    // Verificar si el equipo está inactivo
    const equipo = contextType === 'cocinas' ? 
        lineasData?.cocinas.find(e => e.num_cocina === id) : 
        lineasData?.enfriadores.find(e => e.num_enfriador === id);

    if (equipo && equipo.estado === 'INACTIVO') {
        // Mostrar mensaje de inactivo si el estado es 'INACTIVO'
        const nombreEquipo = contextType === 'cocinas' ? `Cocina ${id}` : `Enfriador ${id}`;
        return (
            <div className="bg-black p-20 h-full w-full rounded-md flex items-center justify-center text-white text-2xl">
                {nombreEquipo} - INACTIVO
            </div>
        );
    }

    return (
        <div className="bg-black p-20 h-full w-full rounded-md 1365:w-full 1365:h-full">
            <canvas ref={chartRef} className="block w-full h-full max-h-screen"></canvas>
        </div>
    );
};

export default Grafico;

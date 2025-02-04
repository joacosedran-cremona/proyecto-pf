import React, { useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useCocina } from '@/context/CocinaContext';
import { useEnfriador } from '@/context/EnfriadorContext';
import { transformData } from '../utils/logicaGraficos';

Chart.register(...registerables);
Chart.register(zoomPlugin);

const Grafico: React.FC<{ contextType: 'cocinas' | 'enfriadores' }> = ({ contextType }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    const { cocinaData } = useCocina();
    const { enfriadorData } = useEnfriador();

    useEffect(() => {
        const data = contextType === 'cocinas' ? cocinaData : enfriadorData;
        if (!data || !chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const chartData = transformData([data]);

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
                        color: '#D9D9D9',
                        display: true,
                        text: 'Temperaturas en tiempo real',
                        font: {
                            weight: 'normal',
                            size: 20
                        },
                        padding: {
                            top: 0,
                            bottom: 15
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
                                const temperature = context.parsed.y; // Valor de temperatura
                                const totalSeconds = Math.floor(context.parsed.x); // Tiempo sin decimales
                    
                                // Convertir segundos a formato hh:mm:ss
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
                                return ''; // No mostrar título, que es el valor del eje X (tiempo)
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
            }
        };

        const chartInstance = new Chart(ctx, config);

        return () => chartInstance.destroy();
    }, [cocinaData, enfriadorData, contextType]);

    return (
        <div className="bg-black p-20 h-full w-full rounded-md 1365:w-full 1365:h-full">
            <canvas ref={chartRef} className="block w-full h-full max-h-screen"></canvas>
        </div>
    );
};

export default Grafico;

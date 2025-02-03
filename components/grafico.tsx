import React, { useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
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
                                const label = context.dataset.label || '';
                                return `${label}: ${context.parsed.y}`;
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
                        type: 'time',
                        time: {
                            tooltipFormat: 'dd/MM/yyyy',
                        },
                        title: {
                            display: true,
                            text: 'Fecha y Hora'
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

    const canvasStyle: React.CSSProperties = {
        display: 'block',
        width: '100%',
        height: '100%'
    };

    return (
        <div className="bg-black p-20 h-full w-full rounded-md custom:w-2/3 custom:h-full">
            <canvas ref={chartRef} style={canvasStyle}></canvas>
        </div>
    );
};

export default Grafico;
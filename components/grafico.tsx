import React, { useRef, useEffect, useState } from 'react';
import { Chart, registerables, ChartConfiguration, Plugin } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { transformData, CocinaData } from '../utils/logicaGraficos';
import { useCocina } from "@/context/CocinaContext";
import { useEnfriador } from "@/context/EnfriadorContext";

Chart.register(...registerables);
Chart.register(zoomPlugin);

const image = new Image();
image.src = '/creminox.png';

const plugin: Plugin<'line'> = {
    id: 'customCanvasBackgroundImage',
    beforeDraw: (chart: Chart) => {
        if (image.complete) {
            const ctx = chart.ctx;
            const { top, left, width, height } = chart.chartArea;
            ctx.save();
            ctx.globalAlpha = 0.2;
            const x = left + width / 2 - image.width / 2;
            const y = top + height / 2 - image.height / 2;
            ctx.drawImage(image, x, y);
            ctx.restore();
        } else {
            image.onload = () => chart.draw();
        }
    }
};

const BarChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const { cocinaData } = useCocina();
    const { enfriadorData } = useEnfriador();

    const [chartData, setChartData] = useState<ChartConfiguration<'line'>['data'] | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Solo ejecuta esto en el navegador
            const transformedData = transformData([cocinaData, enfriadorData]);
            setChartData(transformedData);
        }
    }, [cocinaData, enfriadorData]);

    useEffect(() => {
        if (!chartRef.current || !chartData) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

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
            },
            plugins: [plugin]
        };

        const chartInstance = new Chart(ctx, config);

        return () => chartInstance.destroy();
    }, [chartData]);

    const canvasStyle: React.CSSProperties = {
        display: 'block',
        width: '100%',
        height: '100%'
    };

    return (
        <div className="bg-black relative p-20 h-full w-full rounded-md custom:w-2/3 custom:h-full">
            <canvas ref={chartRef} style={canvasStyle}></canvas>
        </div>
    );
};

export default BarChart;

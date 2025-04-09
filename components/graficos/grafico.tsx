import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables, ChartConfiguration, Plugin } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useCocina } from '@/context/CocinaContext';
import { useEnfriador } from '@/context/EnfriadorContext';
import { transformData } from '../../utils/logicaGraficos';
import { Button, Spinner } from '@heroui/react';
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useTranslation } from 'react-i18next';

Chart.register(...registerables);
Chart.register(zoomPlugin);

const Grafico: React.FC<{ contextType: 'cocinas' | 'enfriadores' }> = ({ contextType }) => {
    const { t } = useTranslation('grafico');
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart<'line'> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { cocinaData } = useCocina();
    const { enfriadorData } = useEnfriador();

    useEffect(() => {
        const data = contextType === 'cocinas' ? cocinaData : enfriadorData;
        if (!data || !chartRef.current) {
            setLoading(true);
            return;
        }

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) {
            setLoading(true);
            return;
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

        const chartData = transformData(data); // Modificado aquí

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
                    },
                    title: {
                        align: 'start',
                        color: '#D9D9D9',
                        display: true,
                        text: t('tituloGrafico'), // Nueva clave en JSON
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
                            enabled: true,
                            mode: 'x',
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
                            },
                            mode: 'x',
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const datasetLabel = context.dataset.label || t('datos.temperatura'); // Nueva clave en JSON
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
                }, transitions: {
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

        const chartInstance = new Chart(ctx, config);
        chartInstanceRef.current = chartInstance;
        setLoading(false);

        return () => chartInstance.destroy();
    }, [cocinaData, enfriadorData, contextType, t]);

    const resetZoom = () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.resetZoom();
        }
    };

    const equipo = contextType === 'cocinas' ? cocinaData : enfriadorData;

    if (!equipo) {
        return (
            <div className="bg-midGrey p-20 h-full w-full rounded-md flex flex-col items-center justify-center text-white gap-20">
                <AiOutlineExclamationCircle className="w-auto h-1/4" />
                <p className="text-3xl text-white">{t('equipoNoEncontrado')}</p> {/* Nueva clave en JSON */}
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
                <p className="text-3xl text-white">{nombreEquipo} - {t('inactividad.titulo')}</p>
                <p className="text-xl text-white">{t('inactividad.mensaje')}</p>
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
                <p className="w-full text-center text-3xl text-white">{t('error.mensaje')}</p>
            </div>
        );
    }

    return (
        <div className="bg-black p-20 h-full w-full rounded-md relative">
            <canvas ref={chartRef} className="block w-full h-full max-h-screen"></canvas>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-75 rounded-xl">
                    <Spinner label={t('cargando')} />
                </div>
            )}
            <Button
                style={{
                    backgroundColor: '#333',
                    border: '1px solid #CCC',
                    color: '#CCC',
                    width: '15%',
                    height: '35px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '17px',
                }}
                onClick={resetZoom}
                className="absolute top-[20px] right-[20px] text-white bg-grey hover:text-black hover:bg-lightGrey px-3 rounded-md"
            >
                {t('reiniciarZoom')}
            </Button>
        </div>
    );
};

export default Grafico;
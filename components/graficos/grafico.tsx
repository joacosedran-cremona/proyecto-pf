//React
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useSearchParams } from 'next/navigation';

//ChartJs
import { Chart, registerables, ChartConfiguration, Plugin } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

//Context y Funciones
import { useWebSocketContext } from '@/context/WebSocketContext';
import { transformData } from '@/utils/logicaGraficos';

//HeroUI
import { Button, Spinner } from '@heroui/react';

//Idioma
import { useTranslation } from 'react-i18next';

Chart.register(...registerables);
Chart.register(zoomPlugin);

interface InfoEquipo {
    tipo: 'COCINA' | 'ENFRIADOR';
    id: number;
    estado: 'ACTIVO' | 'INACTIVO' | 'FALLA' | 'COCINANDO' | 'ENFRIANDO';
    temp_Agua: number;
    temp_Prod: number;
    temp_Ingreso: number;
    temp_Chiller: number;
    niv_Agua: number;
    receta: string;
    receta_paso_actual: number;
    tiempoTranscurrido: number;
    num_cocina?: number;
    num_enfriador?: number;
}

interface EquipoData {
    info: InfoEquipo;
    detalles: {
        historial: Array<{
            id_historial: number;
            tiempo: number;
            temp_Agua: number;
            temp_Ingreso: number;
            estado: string;
        }>;
    };
}

const Grafico: React.FC<{ contextType: 'cocinas' | 'enfriadores' }> = ({ contextType }) => {
    const { t } = useTranslation('grafico');
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart<'line'> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
    const { data, isConnected } = useWebSocketContext();
    const searchParams = useSearchParams();
    const currentId = Number(searchParams.get('id')) || (contextType === 'cocinas' ? 1 : 7);

    useEffect(() => {
        if (!data || !isConnected) {
            setLoading(true);
            return;
        }

        const datosCocinas = data['datos-cocinas'];
        const datosEnfriadores = data['datos-enfriadores'];

        console.log('Datos disponibles:', {
            cocinas: datosCocinas?.length,
            enfriadores: datosEnfriadores?.length,
            equipoId: currentId
        });

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
                currentId,
                datosCocinas,
                datosEnfriadores
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
                                },
                                title: {
                                    align: 'start',
                                    color: '#D9D9D9',
                                    display: true,
                                    text: t('tituloGrafico'),
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
            console.error('Error al crear el gráfico:', error);
            setLoading(true);
        }
    }, [data, isConnected, currentId, contextType, t, isFirstLoad]);

    const resetZoom = () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.resetZoom();
        }
    };

    if (loading || !data || !isConnected) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto" />
                    <p className="mt-4">
                        {!isConnected ? 'Conectando al servidor...' : 'Cargando datos...'}
                    </p>
                </div>
            </div>
        );
    }

    // Buscar el equipo en los datos con tipado correcto
    const equipos = data[`datos-${contextType}`] as Array<[InfoEquipo, any]> || [];
    const equipo = equipos.find(([info]: [InfoEquipo, any]) => info.id === currentId)?.[0];

    if (!equipo) {
        return (
            <div className="bg-midGrey p-20 h-full w-full rounded-md flex flex-col items-center justify-center text-white gap-20">
                <AiOutlineExclamationCircle className="w-auto h-1/4" />
                <p className="text-3xl text-white">{t('equipoNoEncontrado')}</p>
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
//React
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useSearchParams } from 'next/navigation';

//ChartJs
import { Chart, registerables, ChartConfiguration, Plugin } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

//Context y Funciones
import { useWebSocketContext } from '@/context/WebSocketContext';
import { transformData } from '@/utils/logicaGraficos';
import { clearStoredData } from '@/utils/logicaGraficos';

//HeroUI
import { Button } from '@heroui/react';

//Idioma
import { useTranslation } from 'react-i18next';

Chart.register(...registerables);
Chart.register(zoomPlugin);

interface InfoEquipo {
    tipo: 'COCINA' | 'ENFRIADOR';
    id: number;
    estado: 'ACTIVO' | 'INACTIVO' | 'FALLA' | 'OPERATIVO' | 'FINALIZADO';
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

const Grafico: React.FC<{ contextType: 'cocinas' | 'enfriadores' }> = ({ contextType }) => {
    const { t } = useTranslation('grafico');
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart<'line'> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
    const [hasCachedData, setHasCachedData] = useState<boolean>(false);
    const { data, isConnected } = useWebSocketContext();
    const searchParams = useSearchParams();
    const currentId = Number(searchParams.get('id')) || (contextType === 'cocinas' ? 1 : 7);

    useEffect(() => {
        if (data && isConnected) {
            // Limpiar datos almacenados cuando la conexión se restablece
            clearStoredData(currentId);
            setHasCachedData(false);
        }

        if (!data || !isConnected) {
            // Verificar si hay datos en caché
            const cachedData = localStorage.getItem(`equipo-${currentId}`);
            if (cachedData) {
                setHasCachedData(true);
                setLoading(false);
            } else {
                setHasCachedData(false);
                setLoading(true);
            }
            return;
        }

        const datosCocinas = data['datos-cocinas'];
        const datosEnfriadores = data['datos-enfriadores'];

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
            
            const endPointLabelsPlugin: Plugin = {
                id: 'endPointLabels',
                afterDraw: (chart: Chart, args, opts) => {
                    const ctx = chart.ctx;
                    ctx.save();
                    // Aumentar el z-index estableciendo el orden de dibujo
                    ctx.globalCompositeOperation = 'source-over';
                    
                    const labels: Array<{
                        x: number;
                        y: number;
                        width: number;
                        height: number;
                    }> = [];
            
                    chart.data.datasets.forEach((dataset, i) => {
                        const meta = chart.getDatasetMeta(i);
                        if (!meta.hidden && dataset.data.length > 0) {
                            const lastPoint = meta.data[meta.data.length - 1];
                            const value = dataset.data[dataset.data.length - 1] as { x: number; y: number };
                            
                            ctx.save();
                            ctx.fillStyle = dataset.borderColor as string;
                            ctx.font = '14px Arial';
                            
                            const text = `${value.y}${dataset.yAxisID === 'y1' ? ' mm' : '°C'}`;
                            const textWidth = ctx.measureText(text).width;
                            const padding = 4;
                            const labelHeight = 20;
                            
                            // Calcular posición inicial
                            let labelX = lastPoint.x + 5; // Reducido de 10 a 5
                            let labelY = lastPoint.y - 5; // Reducido de 10 a 5
                            
                            // Ajustar posición vertical si hay solapamiento
                            const currentLabel = {
                                x: labelX,
                                y: labelY,
                                width: textWidth + (padding * 2),
                                height: labelHeight
                            };
            
                            // Verificar solapamiento con etiquetas existentes
                            let overlap = true;
                            let alternatePosition = false; // Alternar entre izquierda y derecha
            
                            while (overlap) {
                                overlap = false;
                                for (const label of labels) {
                                    if (!(currentLabel.x + currentLabel.width < label.x ||
                                        currentLabel.x > label.x + label.width ||
                                        currentLabel.y + currentLabel.height < label.y ||
                                        currentLabel.y > label.y + label.height)) {
                                        
                                        if (!alternatePosition) {
                                            // Mover a la izquierda en el primer solapamiento
                                            currentLabel.x = lastPoint.x - currentLabel.width - 5;
                                            alternatePosition = true;
                                        } else {
                                            // Si aún hay solapamiento, mover ligeramente hacia arriba
                                            currentLabel.y -= labelHeight + 2; // Reducido de 5 a 2
                                            currentLabel.x = lastPoint.x + 5;
                                            alternatePosition = false;
                                        }
                                        overlap = true;
                                        break;
                                    }
                                }
                            }
                            
                            // Agregar la etiqueta actual al array de etiquetas
                            labels.push(currentLabel);
                            
                            // Dibujar el fondo
                            ctx.fillStyle = dataset.borderColor as string;
                            ctx.globalAlpha = 0.15;
                            ctx.beginPath();
                            ctx.roundRect(
                                currentLabel.x,
                                currentLabel.y,
                                currentLabel.width,
                                currentLabel.height,
                                4
                            );
                            ctx.fill();
                            
                            // Dibujar el borde
                            ctx.globalAlpha = 0.8;
                            ctx.strokeStyle = dataset.borderColor as string;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.roundRect(
                                currentLabel.x,
                                currentLabel.y,
                                currentLabel.width,
                                currentLabel.height,
                                4
                            );
                            ctx.stroke();
                            
                            // Dibujar el texto
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fillText(
                                text,
                                currentLabel.x + padding,
                                currentLabel.y + 14
                            );
                            
                            ctx.restore();
                        }
                    });
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
                            elements: {
                                point: {
                                    radius: 3,           // Tamaño base del punto (siempre visible)
                                    hoverRadius: 6,      // Tamaño al pasar el mouse
                                    borderWidth: 2,      // Grosor del borde
                                    backgroundColor: '#fff'  // Color de fondo del punto
                                },
                                line: {
                                    tension: 0.4        // Suavizado de la línea
                                }
                            },
                            interaction: {
                                intersect: false,
                                mode: 'index',
                            },
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        usePointStyle: true,
                                    },
                                },
                                title: {
                                    align: 'start',
                                    display: true,
                                    text: `${t('tituloGrafico')}\n${t('subtituloGrafico')}`,
                                    color: '#D9D9D9',
                                    font: {
                                        size: 20,
                                        weight: 'bold'
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
                                        title: (context) => {
                                            const totalSeconds = Math.floor(context[0].parsed.x);
                                            const hours = Math.floor(totalSeconds / 3600);
                                            const minutes = Math.floor((totalSeconds % 3600) / 60);
                                            const seconds = totalSeconds % 60;
                                            const timeFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                                            
                                            return `${t('tooltip')}: ${timeFormatted}`;
                                        },
                                        label: (context) => {
                                            const datasetLabel = context.dataset.label || '';
                                            const value = context.parsed.y;
                                            const yAxisID = context.dataset.yAxisID;
                                            
                                            return `${datasetLabel}: ${value}${yAxisID === 'y1' ? ' mm' : '°C'}`;
                                        }
                                    },
                                    displayColors: true, // Mostrar los cuadrados de color
                                    boxWidth: 8, // Tamaño del cuadrado de color
                                    boxHeight: 8, // Altura del cuadrado de color
                                    boxPadding: 4, // Espacio entre el cuadrado y el texto
                                    usePointStyle: false,
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
                                    type: 'linear',
                                    display: true,
                                    beginAtZero: true,
                                    position: 'left',
                                    title: {
                                        display: true,
                                        text: t('ejes.y'),
                                        color: '#D9D9D9'
                                    },
                                    grid: {
                                        color: '#1F1F1F',
                                        tickColor: '#fff'
                                    },
                                    ticks: {
                                        color: '#D9D9D9'
                                    },
                                    border: {
                                        color: '#D9D9D9'
                                    }
                                },
                                y1: {
                                    beginAtZero: true,
                                    type: 'linear',
                                    display: true,
                                    position: 'right',
                                    title: {
                                        display: true,
                                        text: t('ejes.y1'),
                                        color: '#D9D9D9'
                                    },
                                    grid: {
                                        drawOnChartArea: false
                                    },
                                    ticks: {
                                        color: '#D9D9D9'
                                    },
                                    border: {
                                        color: '#D9D9D9'
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
                        plugins: [plugin, endPointLabelsPlugin],
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
    }, [data, isConnected, currentId, contextType, t, isFirstLoad]);

    const resetZoom = () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.resetZoom();
        }
    };

    // Buscar el equipo en los datos con tipado correcto
    const equipos = data[`datos-${contextType}`] as Array<[InfoEquipo, any]> || [];
    const equipo = equipos.find(([info]: [InfoEquipo, any]) => info.id === currentId)?.[0];

    if (!equipo) {
        return (
            <div className="bg-midGrey p-[20px] h-[100%] w-[100%] rounded-md flex flex-col items-center justify-center text-white gap-[20px]">
                <AiOutlineExclamationCircle className="w-auto h-1/4" />
                <p className="text-3xl text-white jutify-center">{t('equipoNoEncontrado')}</p>
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
            <div className="bg-midGrey p-[20px] h-[100%] w-[100%] rounded-md flex flex-col items-center justify-center text-white gap-[20px]">
                <AiOutlineExclamationCircle className="w-auto h-1/4" />
                <p className="text-3xl text-white">{nombreEquipo} - {t('inactividad.titulo')}</p>
                <p className="text-xl text-white">{t('inactividad.mensaje')}</p>
            </div>
        );
    }
/*
    if (equipo.estado === 'FINALIZADO') {
        const nombreEquipo = contextType === 'cocinas' && 'num_cocina' in equipo
            ? `${t('equipo.cocina')} ${equipo.num_cocina}`
            : contextType === 'enfriadores' && 'num_enfriador' in equipo
            ? `${t('equipo.enfriador')} ${equipo.num_enfriador}`
            : t('equipo.desconocido');

        return (
            <div className="bg-midGrey p-[20px] h-[100%] w-[100%] rounded-md flex flex-col items-center justify-center text-white gap-[20px]">
                <AiOutlineExclamationCircle className="w-auto h-1/4" />
                <p className="text-3xl text-white">{nombreEquipo} - {t('finalizado.titulo')}</p>
                <p className="text-xl text-white">{t('finalizado.mensaje')}</p>
            </div>
        );
    }
*/
    if (equipo.estado === 'FALLA') {
        const nombreEquipo = contextType === 'cocinas' && 'num_cocina' in equipo
            ? `${t('equipo.cocina')} ${equipo.num_cocina}`
            : contextType === 'enfriadores' && 'num_enfriador' in equipo
            ? `${t('equipo.enfriador')} ${equipo.num_enfriador}`
            : t('equipo.desconocido');

        return (
            <div className="bg-redChill p-[20px] h-[100%] w-[100%] rounded-md flex flex-col items-center justify-center text-white gap-[20px]">
                <AiOutlineExclamationCircle className="w-auto h-1/4" />
                <p className="text-3xl text-white">{nombreEquipo} - {t('error.titulo')}</p>
                <p className="w-[100%] text-center text-3xl text-white">{t('error.mensaje')}</p>
            </div>
        );
    }

    return (
        <div className="bg-black p-[20px] h-[100%] w-[100%] rounded-md relative">
            <canvas ref={chartRef} className="block w-[100%] h-[100%] max-h-screen"></canvas>
            {loading && !hasCachedData && (
                <div className="flex absolute items-center justify-center h-[100%] w-[100%]">
                    <div className="text-center">
                        <div className="animate-spin rounded-[100%] h-[12px] w-[12px] border-t-[2px] border-b-[2px] border-primary mx-auto" />
                        <p className="mt-[4px]">
                            {'Conectando al servidor...'}
                        </p>
                    </div>
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
                className="absolute top-[20px] right-[20px] text-white bg-grey hover:text-black hover:bg-lightGrey px-[3px] rounded-md"
            >
                {t('reiniciarZoom')}
            </Button>
        </div>
    );
};

export default Grafico;
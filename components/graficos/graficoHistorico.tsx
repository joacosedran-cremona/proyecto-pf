import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables, ChartConfiguration, Plugin } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Button, Spinner } from '@heroui/react';
import 'chartjs-adapter-date-fns';
import { es } from 'date-fns/locale';
import TablaCiclos from '@/components/tablaciclos/tablaCiclos';
import { useTranslation } from 'react-i18next';  

Chart.register(...registerables);
Chart.register(zoomPlugin);

const equipmentMapping: Record<string, string> = {
  'C1': 'Cocina 1-L1',
  'C2': 'Cocina 2-L1',
  'C3': 'Cocina 3-L1',
  'C4': 'Cocina 4-L2',
  'C5': 'Cocina 5-L2',
  'C6': 'Cocina 6-L2',
  'E7': 'Enfriador 1-L1',
  'E8': 'Enfriador 2-L1',
  'E9': 'Enfriador 3-L1',
  'E10': 'Enfriador 4-L1',
  'E11': 'Enfriador 5-L2',
  'E12': 'Enfriador 6-L2',
  'E13': 'Enfriador 7-L2',
  'E14': 'Enfriador 8-L2'
};

const getEquipmentName = (type: string, id: number): string => {
  const key = `${type === 'cocinas' ? 'C' : 'E'}${id}`;
  return equipmentMapping[key] || '';
};

interface GraficoProps {
  contextType: 'cocinas' | 'enfriadores';
  id: number;
  startDate: string | null;
  endDate: string | null;
  showTableOnLoad?: boolean;
  onTableClose?: () => void;
  onCicloSelect?: (cicloId: number) => void;
  selectedCicloId?: number | null;
}

interface HistoricoData {
  'Temperatura agua': Array<{
    id: number;
    idCiclo: number;
    fechaRegistro: string;
    idSensor: number;
    valor: number;
  }>;
  'Temperatura producto': Array<{
    id: number;
    idCiclo: number;
    fechaRegistro: string;
    idSensor: number;
    valor: number;
  }>;
  'Nivel agua': Array<{
    id: number;
    idCiclo: number;
    fechaRegistro: string;
    idSensor: number;
    valor: number;
  }>;
  general: {
    id_ciclo: number;
    ciclo_lote: string;
    tiempo_transcurrido: string;
    fecha_inicio: string;
    fecha_fin: string;
    receta: string;
  };
}

const Grafico: React.FC<GraficoProps> = ({ 
  contextType, 
  id, 
  startDate, 
  endDate,
  showTableOnLoad = false,
  onTableClose,
  onCicloSelect,
  selectedCicloId: externalSelectedCicloId
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart<'line'> | null>(null);
  const [data, setData] = useState<HistoricoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCicloId, setSelectedCicloId] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(showTableOnLoad);
  const [internalSelectedCicloId, setInternalSelectedCicloId] = useState<number | null>(null);
  const { t } = useTranslation('grafico');

  useEffect(() => {
    if (externalSelectedCicloId !== undefined) {
      setInternalSelectedCicloId(externalSelectedCicloId);
    }
  }, [externalSelectedCicloId]);
  
  useEffect(() => {
    setShowTable(showTableOnLoad);
  }, [showTableOnLoad, contextType, id]); // Agregado contextType e id como dependencias

  const handleTableClose = () => {
    setShowTable(false);
    if (onTableClose) {
      onTableClose();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const equipmentName = getEquipmentName(contextType, id);
        const host = process.env.NEXT_PUBLIC_WS_HOST || '192.168.0.61';
        const port = process.env.NEXT_PUBLIC_WS_PORT || '8000';
        
        const url = `http://${host}:${port}/historico-graficos/${equipmentName}/${externalSelectedCicloId}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData = await response.json();
  
        // Verificar si los datos que llegan son null o vacíos
        if (!jsonData || Object.keys(jsonData).length === 0) {
          setShowTable(false);  // Cierra la tabla si los datos son null o vacíos
          if (onTableClose) {
            onTableClose();
          }
          return;  // Termina la ejecución si no hay datos
        }
  
        setData(jsonData);
  
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar los datos');
        setShowTable(false); // Hide table on error
        if (onTableClose) {
          onTableClose();
        }
      }
    };
  
    fetchData();
  }, [contextType, id, externalSelectedCicloId]); 
  

  useEffect(() => {
    if (!data || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Agregar el plugin de la imagen de fondo
    const image = new Image();
    image.src = '/creminox.png';

    const plugin: Plugin = {
      id: 'customCanvasBackgroundImage',
      beforeDraw: (chart: Chart) => {
        if (image.complete) {
          const ctx = chart.ctx;
          const { top, left, width, height } = chart.chartArea;
          ctx.save();
          ctx.globalAlpha = 0.10;

          const imageWidth = width * 0.25;
          const imageHeight = (image.height / image.width) * imageWidth;
          const x = left + (width - imageWidth) / 2;
          const y = top + (height - imageHeight) / 2.5;

          ctx.drawImage(image, x, y, imageWidth, imageHeight);
          ctx.restore();
        } else {
          image.onload = () => chart.draw();
        }
      }
    };

    // Procesar los datos para el gráfico con valores por defecto
    const tempProducto = (data['Temperatura producto'] || []).map(item => ({
      x: new Date(item.fechaRegistro).getTime(),
      y: item.valor
    }));

    const tempAgua = (data['Temperatura agua'] || []).map(item => ({
      x: new Date(item.fechaRegistro).getTime(),
      y: item.valor
    }));

    const nivelAgua = (data['Nivel agua'] || []).map(item => ({
      x: new Date(item.fechaRegistro).getTime(),
      y: item.valor
    }));

    const config: ChartConfiguration = {
        type: 'line',
        data: {
          datasets: [
            {
              label: t('datos.tempIng'),
              data: tempProducto,
              borderColor: 'rgb(75, 192, 75)',
              backgroundColor: 'rgba(75, 192, 75, 0.5)',
              fill: false,
              tension: 0.4,
              yAxisID: 'y',
              pointStyle: 'circle',
            },
            {
              label: t('datos.tempAgua'),
              data: tempAgua,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              fill: false,
              tension: 0.4,
              yAxisID: 'y',
              pointStyle: 'circle',
            },
            {
              label: t('datos.nivelAgua'),
              data: nivelAgua,
              borderColor: 'rgb(255, 165, 0)',
              backgroundColor: 'rgba(255, 165, 0, 0.5)',
              fill: false,
              tension: 0.4,
              yAxisID: 'y1',
              pointStyle: 'circle',
            }
          ].filter(dataset => dataset.data.length > 0)
        },
        options: {
          interaction: {
            intersect: false,
            mode: 'index',
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
              }
            },
            tooltip: {
              callbacks: {
                  title: (context) => {
                      const date = new Date(context[0].parsed.x);
                      const hours = date.getHours();
                      const minutes = date.getMinutes();
                      const seconds = date.getSeconds();
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
              displayColors: true,     // Mostrar los cuadrados de color
              boxWidth: 8,            // Tamaño del cuadrado de color
              boxHeight: 8,           // Altura del cuadrado de color
              boxPadding: 4,          // Espacio entre el cuadrado y el texto
              usePointStyle: false    // Usar cuadrados en lugar de círculos
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
            }
          },
          scales: {
            x: {
              type: 'time',
              border: {
                color: '#D9D9D9'
              },
              grid: {
                color: '#1F1F1F',
              },
              time: {
                unit: 'minute',
                displayFormats: {
                  minute: 'HH:mm'
                },
                tooltipFormat: 'HH:mm:ss'
              },
              adapters: {
                date: {
                  locale: es
                }
              },
              title: {
                display: true,
                text: t('ejes.x')
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: '#1F1F1F',
              },
              border: {
                color: '#D9D9D9'
              },
              title: {
                display: true,
                text: t('ejes.y')
              }
            },
            y1: {
              position: 'right',
              beginAtZero: true,
              border: {
                color: '#D9D9D9'
              },
              grid: {
                drawOnChartArea: false // 👉 evita líneas duplicadas en el fondo
              },
              title: {
                display: true,
                text: t('ejes.y1')
              }
            }
          }
        },
        plugins: [plugin],
      };      

    chartInstanceRef.current = new Chart(ctx, config);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  const resetZoom = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.resetZoom();
    }
  };

  if (error) {
    return (
      <div className="bg-black p-[20px] h-[100%] w-[100%] rounded-md flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  
  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeTranscurrido = (timeString: string) => {
    // Separar horas, minutos y segundos
    const [hours, minutes, secondsWithMs] = timeString.split(':');
    
    // Obtener solo la parte entera de los segundos
    const seconds = Math.floor(parseFloat(secondsWithMs));
    
    // Formatear con dos dígitos para cada unidad
    const formattedHours = hours.padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    
    // Retornar en formato HH:MM:SS
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

  return (
    <div className="bg-black h-[100%] w-[100%] rounded-md relative pt-[10px] px-[10px] pb-[108px] grafico-historico">
      {/* Botones de control */}
      <div className="absolute top-[35px] right-[35px] flex gap-[20px] z-[20px] pdf-ignore">
        <Button
          onClick={() => setShowTable(!showTable)}
          className="text-white bg-grey/100 hover:bg-lightGrey/25 px-[10px] py-[20px] rounded-md backdrop-blur-sm border border-grey/50"
        >
          {showTable ? t('graficoHistorico.botonCiclos') : t('graficoHistorico.botonCiclos')}
        </Button>
        <Button
          onClick={resetZoom}
          className="text-white bg-grey/100 hover:bg-lightGrey/25 px-[10px] py-[20px] rounded-md backdrop-blur-sm border border-grey/50"
        >
          {t('graficoHistorico.botonZoom')}
        </Button>
      </div>
  
      {/* Info del ciclo */}
      {data && (
        <div className="mb-[5px] ml-[5px]">
          <div className="flex items-center gap-[8px] pdf-info-section">
            <div className="text-white">
              <h2 className="text-[32px] font-bold">{t('graficoHistorico.titulo')}</h2>
              <p className="mt-[-6px]">
                <strong>{t('graficoHistorico.lote')}</strong> {data.general.ciclo_lote} - {data.general.receta}
              </p>
              <p className="text-orange text-[14px] mt-[-5px]">
                {formatDate(data.general.fecha_inicio)} -{' '}
                {formatDate(data.general.fecha_fin)}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-[12px] ml-[5px]">
              <div className="bg-[#4bc04b] bg-opacity-25 text-white text-sm p-[0px] rounded-lg border border-[#4bc04b]/50">
                <div className="font-bold text-center mt-[5px] mb-[-5px]">{t('datosHistorico.tempProd')}</div>
                <div className="grid grid-cols-2 m-2">
                  <span className="font-bold">Max:</span>
                  <span className='ml-[-22px]'>{data.general.temp_producto_max}°C</span>
                  <span className="font-bold">Min:</span>
                  <span className='ml-[-25px]'>{data.general.temp_producto_min}°C</span>
                </div>
              </div>

              <div className="bg-[#3666cc] bg-opacity-25 text-white text-sm p-[0px] rounded-lg border border-[#3666cc]/50">
                <div className="font-bold text-center mt-[5px] mb-[-5px]">{t('datosHistorico.tempAgua')}</div>
                <div className="grid grid-cols-2 m-2">
                  <span className="font-bold">Max:</span>
                  <span className='ml-[-22px]'>{data.general.temp_agua_max}°C</span>
                  <span className="font-bold">Min:</span>
                  <span className='ml-[-25px]'>{data.general.temp_agua_min}°C</span>
                </div>
              </div>

              <div className="bg-yellow-500 bg-opacity-25 text-white text-sm p-[0px] rounded-lg border border-yellow-500/50">
                <div className="font-bold text-center mt-[5px] mb-[-5px]">{t('datosHistorico.nivelAgua')}</div>
                <div className="grid grid-cols-2 m-2">
                  <span className="font-bold">Max:</span>
                  <span className='ml-[-22px]'>{data.general.nivel_agua_max} mm</span>
                  <span className="font-bold">Min:</span>
                  <span className='ml-[-25px]'>{data.general.nivel_agua_min} mm</span>
                </div>
              </div>

              <div className="bg-[#e82a31] bg-opacity-25 text-white text-sm p-[0px] rounded-lg border border-[#e82a31]/50">
                <div className="grid grid-cols-2 m-2">
                  <span className="font-bold">{t('datosHistorico.hInicio')}</span>
                  <span className='ml-[5px]'>{formatTime(data.general.fecha_inicio)}</span>
                  <span className="font-bold">{t('datosHistorico.hFin')}</span>
                  <span className='ml-[-6px]'>{formatTime(data.general.fecha_fin)}</span>
                  <span className="font-bold">{t('datosHistorico.tiempoTrans')}</span>
                  <span className='ml-[3px]'>{formatTimeTranscurrido(data.general.tiempo_transcurrido)}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex justify-center ml-[-200px]">
              <p className="text-white text-lg font-semibold">
                <strong>{t('graficoHistorico.ciclo')}</strong> {data.general.id_ciclo}
              </p>
            </div>
          </div>
        </div>
      )}
  
      {/* Gráfico y Tabla */}
      <div className="relative w-[100%] h-[calc(100%)]">
        <canvas ref={chartRef}></canvas>
    
        {(showTable || showTableOnLoad) && !error && data && data.general && Object.keys(data).length > 0 && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div 
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
                    onClick={handleTableClose} 
                />
                <div className="relative z-20 bg-black/80 p-[4px] rounded-lg border border-gray-700">
                  <TablaCiclos
                    fechaInicio={startDate || '2000-01-01'}
                    fechaFin={endDate || '2100-01-01'}
                    equipo={getEquipmentName(contextType, id)}
                    selectedCicloId={internalSelectedCicloId}
                    onTableClose={handleTableClose} // Pasar la función
                    onCicloSelect={(ciclo) => {
                        if (ciclo && ciclo.id_ciclo) {
                            setInternalSelectedCicloId(ciclo.id_ciclo);
                            if (onCicloSelect) {
                                onCicloSelect(ciclo.id_ciclo);
                            }
                            handleTableClose();
                        }
                    }}
                  />
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
export default Grafico;
import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Button, Spinner } from '@heroui/react';
import 'chartjs-adapter-date-fns';
import { es } from 'date-fns/locale';
import TablaCiclos from '@/components/tablaciclos/tablaCiclos';

Chart.register(...registerables);
Chart.register(zoomPlugin);

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

const equipmentMapping: Record<string, string> = {
  'C1': 'Cocina 1-L1',
  'C2': 'Cocina 2-L1',
  'C3': 'Cocina 3-L1',
  'C4': 'Cocina 4-L2',
  'C5': 'Cocina 5-L2',
  'C6': 'Cocina 6-L2',
  'E1': 'Enfriador 1-L1',
  'E2': 'Enfriador 2-L1',
  'E3': 'Enfriador 3-L1',
  'E4': 'Enfriador 4-L1',
  'E5': 'Enfriador 5-L2',
  'E6': 'Enfriador 6-L2',
  'E7': 'Enfriador 7-L2',
  'E8': 'Enfriador 8-L2'
};

const Grafico: React.FC<GraficoProps> = ({ 
  contextType, 
  id, 
  startDate, 
  endDate,
  showTableOnLoad = false,
  onTableClose,
  onCicloSelect,
  selectedCicloId: externalSelectedCicloId // Renombrado para evitar confusión
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart<'line'> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<HistoricoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCicloId, setSelectedCicloId] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(showTableOnLoad);
  const [internalSelectedCicloId, setInternalSelectedCicloId] = useState<number | null>(null);

  useEffect(() => {
    if (externalSelectedCicloId !== undefined) {
      setInternalSelectedCicloId(externalSelectedCicloId);
    }
  }, [externalSelectedCicloId]);
  
  useEffect(() => {
    setShowTable(showTableOnLoad);
  }, [showTableOnLoad]);

  const handleTableClose = () => {
    setShowTable(false);
    if (onTableClose) {
      onTableClose();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const equipmentName = getEquipmentName(contextType, id);
        const host = process.env.NEXT_PUBLIC_WS_HOST || '192.168.0.61';
        const port = process.env.NEXT_PUBLIC_WS_PORT || '8000';
        
        // Usar el ciclo seleccionado interno
        const cicloId = internalSelectedCicloId || 1;
        const url = `http://${host}:${port}/historico-graficos/${equipmentName}/${cicloId}`;
        
        console.log('🔍 Fetching data for:', { equipmentName, cicloId });
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [contextType, id, internalSelectedCicloId]); // Cambiar la dependencia

  useEffect(() => {
    if (!data || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

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
              label: 'Temperatura Producto',
              data: tempProducto,
              borderColor: 'rgb(75, 192, 75)',
              backgroundColor: 'rgba(75, 192, 75, 0.5)',
              fill: false,
              tension: 0.4,
              yAxisID: 'y',
            },
            {
              label: 'Temperatura Agua',
              data: tempAgua,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              fill: false,
              tension: 0.4,
              yAxisID: 'y',
            },
            {
              label: 'Nivel Agua',
              data: nivelAgua,
              borderColor: 'rgb(255, 165, 0)',
              backgroundColor: 'rgba(255, 165, 0, 0.5)',
              fill: false,
              tension: 0.4,
              yAxisID: 'y1', // 👉 Escala derecha
            }
          ].filter(dataset => dataset.data.length > 0)
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed.y;
                  const date = new Date(context.parsed.x);
                  return `${context.dataset.label}: ${value} - ${date.toLocaleTimeString('es-ES')}`;
                }
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
            }
          },
          scales: {
            x: {
              type: 'time',
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
                text: 'Hora (HH:MM)'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Temperatura (°C)'
              }
            },
            y1: {
              position: 'right',
              beginAtZero: true,
              grid: {
                drawOnChartArea: false // 👉 evita líneas duplicadas en el fondo
              },
              title: {
                display: true,
                text: 'Nivel Agua (mm)'
              }
            }
          }
        }
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
      <div className="bg-black p-20 h-full w-full rounded-md flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const getEquipmentName = (type: string, id: number): string => {
    const key = `${type === 'cocinas' ? 'C' : 'E'}${id}`;
    return equipmentMapping[key] || '';
  };

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

  return (
    <div className="bg-black h-full w-full rounded-md relative pt-10 px-20 pb-28 grafico-historico">
      {/* Botones de control */}
      <div className="absolute top-[35px] right-[35px] flex gap-20 z-20">
        <Button
          onClick={() => setShowTable(!showTable)}
          className="text-white bg-grey/100 hover:bg-lightGrey/25 px-10 py-20 rounded-md backdrop-blur-sm border border-grey/50"
        >
          {showTable ? 'Ocultar Ciclos' : 'Mostrar Ciclos'}
        </Button>
        <Button
          onClick={resetZoom}
          className="text-white bg-grey/100 hover:bg-lightGrey/25 px-10 py-20 rounded-md backdrop-blur-sm border border-grey/50"
        >
          Reiniciar Zoom
        </Button>
      </div>
  
      {/* Info del ciclo */}
      {data && (
        <div className="mb-5">
          <div className="flex items-center gap-20">
            <div className="text-white mb-6">
              <h2 className="text-[32px] font-bold mb-[-8px]">GRÁFICO</h2>
              <p className="mb-[-2px]">
                <strong>LOTE:</strong> {data.general.ciclo_lote} - {data.general.receta}
              </p>
              <p className="text-[#e2973e] text-[14px]">
                {formatDate(data.general.fecha_inicio)} -{' '}
                {formatDate(data.general.fecha_fin)}
              </p>
            </div>
            <div className="bg-[#4bc04b]/25 text-white min-w-[100px] max-h-[75px] text-sm p-4 rounded-lg backdrop-blur-sm border border-[#4bc04b]/50">
              <p className="font-bold mb-2">Temp. Prod</p>
              <p><strong>Max: </strong> {data.general.temp_producto_max}°C</p>
              <p><strong>Min: </strong> {data.general.temp_producto_min}°C</p>
            </div>
            <div className="bg-[#3666cc]/25 text-white text-sm p-4 rounded-lg min-w-[100px] max-h-[75px] backdrop-blur-sm border border-[#3666cc]/50">
              <p className="font-bold mb-2">Temp. Agua</p>
              <p><strong>Max: </strong> {data.general.temp_agua_max}°C</p>
              <p><strong>Min: </strong> {data.general.temp_agua_min}°C</p>
            </div>
            <div className="bg-yellow-500/25 text-white text-sm p-6 rounded-lg min-w-[100px] max-h-[75px] backdrop-blur-sm border border-yellow-500/50">
              <p className="font-bold mb-2">Nivel Agua</p>
              <p><strong>Max: </strong> {data.general.nivel_agua_max} mm</p>
              <p><strong>Min: </strong> {data.general.nivel_agua_min} mm</p>
            </div>
            <div className="bg-[#e82a31]/25 text-white text-sm p-6 rounded-lg min-w-[100px] max-h-[75px] backdrop-blur-sm border border-[#e82a31]/50">
              <p><strong>H. Inicio: </strong> {formatTime(data.general.fecha_inicio)}</p>
              <p><strong>H. Fin: </strong> {formatTime(data.general.fecha_fin)}</p>
              <p><strong>T. Trans: </strong> {data.general.tiempo_transcurrido}</p>
            </div>
          </div>
        </div>
      )}
  
      {/* Gráfico y Tabla */}
      <div className="relative w-full h-[calc(100%)]">
        <canvas ref={chartRef}></canvas>
  
        {showTable && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={handleTableClose} 
          />
          <div className="relative z-20 bg-black/80 p-4 rounded-lg border border-gray-700">
            <TablaCiclos
              fechaInicio={startDate || '2000-01-01'}
              fechaFin={endDate || '2100-01-01'}
              equipo={getEquipmentName(contextType, id)}
              selectedCicloId={internalSelectedCicloId}
              onCicloSelect={(ciclo) => {
                setInternalSelectedCicloId(ciclo.id_ciclo);
                if (onCicloSelect) {
                  onCicloSelect(ciclo.id_ciclo);
                }
                handleTableClose();
              }}
            />
          </div>
        </div>
      )}
      </div>
  
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-75">
          <Spinner label="Cargando datos..." />
        </div>
      )}
    </div>
  );
}
export default Grafico;
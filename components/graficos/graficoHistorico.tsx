import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Button, Spinner } from '@heroui/react';
import 'chartjs-adapter-date-fns';
import { es } from 'date-fns/locale';

Chart.register(...registerables);
Chart.register(zoomPlugin);

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

const Grafico: React.FC<{ contextType: 'cocinas' | 'enfriadores', id: number }> = ({ contextType, id }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart<'line'> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<HistoricoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://192.168.0.61:8000/historico-graficos/Cocina 1-L1/1`);
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
  }, [contextType, id]);

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

  return (
    <div className="bg-black h-full w-full rounded-md relative pt-10 px-20 pb-28">
      {/* Info del ciclo (posición absoluta, arriba del gráfico) */}
      {data && (
        <div className="mb-5">
          {/* Contenedor flex para los datos de temperatura y nivel */}
          <div className="flex items-center gap-20">
            {/* Temperatura Producto */}
            <div className="text-white mb-6">
                <h2 className="text-[32px] font-bold mb-[-8px]">GRÁFICO</h2>
                <p className="mb-[-2px]">
                <strong>LOTE:</strong> {data.general.ciclo_lote} - {data.general.receta}
                </p>
                <p className="text-[#e2973e] text-[14px]">
                <strong></strong>{' '}
                {new Date(data.general.fecha_inicio).toLocaleString('es-ES')} -{' '}
                {new Date(data.general.fecha_fin).toLocaleString('es-ES')}
                </p>
            </div>
            <div className="bg-[#e82a31]/25 text-white min-w-[100px] max-h-[75px] text-sm p-4 rounded-lg backdrop-blur-sm border border-[#e82a31]/50">
              <p className="font-bold mb-2">Temp. Prod</p>
              <p><strong>Max: </strong> {data.general.temp_producto_max}°C</p>
              <p><strong>Min: </strong> {data.general.temp_producto_min}°C</p>
            </div>

            {/* Temperatura Agua */}
            <div className="bg-[#3666cc]/25 text-white text-sm p-4 rounded-lg min-w-[100px] max-h-[75px] backdrop-blur-sm border border-[#3666cc]/50">
              <p className="font-bold mb-2">Temp. Agua</p>
              <p><strong>Max: </strong> {data.general.temp_agua_max}°C</p>
              <p><strong>Min: </strong> {data.general.temp_agua_min}°C</p>
            </div>

            {/* Nivel Agua */}
            <div className="bg-yellow-500/25 text-white text-sm p-6 rounded-lg min-w-[100px] max-h-[75px] backdrop-blur-sm border border-yellow-500/50">
              <p className="font-bold mb-2">Nivel Agua</p>
              <p><strong>Max: </strong> {data.general.nivel_agua_max} mm</p>
              <p><strong>Min: </strong> {data.general.nivel_agua_min} mm</p>
            </div>

            <Button
                onClick={resetZoom}
                className="absolute top-[35px] right-[35px] text-white bg-grey hover:bg-lightGrey px-10 py-20 rounded-md z-10"
            >
                Reiniciar Zoom
            </Button>
          </div>
        </div>
      )}

      {/* Gráfico */}
      <canvas ref={chartRef}></canvas>
  
      {/* Spinner */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-75">
          <Spinner label="Cargando datos..." />
        </div>
      )}

    </div>
  );  
};

export default Grafico;
interface DatosEquipo {
  tipo: string;
  id: number;
  estado: string;
  temp_agua: number;
  temp_prod: number;
  temp_ingreso: number;
  temp_chiller: number;
  niv_agua: number;
  receta: string;
  receta_paso_actual: number;
  tiempoTranscurrido: string; // Cambiado a string
}

interface HistorialItem {
  id_historial: number;
  tiempo: string; // Cambiado a string
  temp_agua: number;
  temp_ingreso: number;
  estado: string;
}

interface DetallesEquipo {
  historial: HistorialItem[];
}

export const transformData = (
  equipoId: number, 
  datosCocinas: Array<[DatosEquipo, DetallesEquipo]>,
  datosEnfriadores: Array<[DatosEquipo, DetallesEquipo]>
) => {

  const todosEquipos = [...(datosCocinas || []), ...(datosEnfriadores || [])];
  const equipo = todosEquipos.find(([info]) => info.id === equipoId);

  // Si no hay datos en tiempo real, intentar recuperar del localStorage
  if (!equipo) {
    const cachedData = localStorage.getItem(`equipo-${equipoId}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return {
      labels: [],
      datasets: []
    };
  }

  const [info, detalles] = equipo;
  const historial = detalles.historial || [];

  // Función para convertir fecha string a timestamp en segundos
  const getTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    return Math.floor(date.getTime() / 1000);
  };

  // Obtener el timestamp inicial (primer registro del historial)
  const tiempoInicial = historial.length > 0 ? 
    getTimestamp(historial[0].tiempo) : 
    getTimestamp(new Date().toISOString());

  // Ordenar el historial por tiempo
  const historialOrdenado = [...historial].sort((a, b) => 
    getTimestamp(a.tiempo) - getTimestamp(b.tiempo)
  );

  // Crear arrays para los datos
  const tiempos: number[] = [];
  const tempAgua: number[] = [];
  const tempIngreso: number[] = [];

  // Agregar datos del historial
  historialOrdenado.forEach(item => {
    // Convertir la diferencia de tiempo a segundos relativos
    const tiempoRelativo = getTimestamp(item.tiempo) - tiempoInicial;
    tiempos.push(tiempoRelativo);
    tempAgua.push(item.temp_agua);
    tempIngreso.push(item.temp_ingreso);
  });

  const chartData = {
    labels: tiempos,
    datasets: [
      {
        label: 'Temperatura de Agua',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        fill: false,
        data: tempAgua
      },
      {
        label: 'Temperatura de Ingreso',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        fill: false,
        data: tempIngreso
      }
    ]
  };

  // Guardar los datos en localStorage
  try {
    localStorage.setItem(`equipo-${equipoId}`, JSON.stringify(chartData));
  } catch (error) {
    console.warn('Error al guardar datos en localStorage:', error);
  }

  return chartData;
};

// Función auxiliar para limpiar datos antiguos
export const clearStoredData = (equipoId: number) => {
  localStorage.removeItem(`equipo-${equipoId}`);
};
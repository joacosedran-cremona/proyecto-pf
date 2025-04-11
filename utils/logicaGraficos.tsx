interface DatosEquipo {
  tipo: string;
  id: number;
  estado: string;
  temp_Agua: number;
  temp_Prod: number;
  temp_Ingreso: number;
  temp_Chiller: number;
  niv_Agua: number;
  receta: string;
  receta_paso_actual: number;
  tiempoTranscurrido: number;
}

interface HistorialItem {
  id_historial: number;
  tiempo: number;
  temp_Agua: number;
  temp_Ingreso: number;
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
  console.log('Buscando equipo con ID:', equipoId);

  // Combinar datos de cocinas y enfriadores
  const todosEquipos = [...(datosCocinas || []), ...(datosEnfriadores || [])];

  // Encontrar el equipo específico
  const equipo = todosEquipos.find(([info]) => info.id === equipoId);

  if (!equipo) {
    console.log('No se encontró el equipo:', equipoId);
    return {
      labels: [],
      datasets: []
    };
  }

  const [info, detalles] = equipo;

  // Obtener el historial del equipo
  const historial = detalles.historial || [];
  console.log('Historial encontrado:', historial.length, 'registros');

  // Ordenar el historial por tiempo
  const historialOrdenado = [...historial].sort((a, b) => a.tiempo - b.tiempo);

  // Crear arrays para los datos
  const tiempos: number[] = [];
  const tempAgua: number[] = [];
  const tempIngreso: number[] = [];

  // Agregar datos del historial
  historialOrdenado.forEach(item => {
    tiempos.push(item.tiempo);
    tempAgua.push(item.temp_Agua);
    tempIngreso.push(item.temp_Ingreso);
  });

  // Agregar el dato actual al final
  tiempos.push(info.tiempoTranscurrido);
  tempAgua.push(info.temp_Agua);
  tempIngreso.push(info.temp_Ingreso);

  console.log('Datos procesados:', {
    tiempos,
    tempAgua,
    tempIngreso
  });

  return {
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
};
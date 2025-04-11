export interface Paso {
    id_historial: number;
    tiempo: string; // Cambiado a string para manejar el formato ISO
    temp_Ing?: number | 'N/A' | null;
    temp_agua?: number | 'N/A' | null;
    temp_ingreso?: number | 'N/A' | null;
    estado: string;
}

export interface InfoEquipo {
    tipo: 'COCINA' | 'ENFRIADOR';
    id: number;
    estado: 'ACTIVO' | 'INACTIVO' | 'FALLA' | 'OPERATIVO' | 'FINALIZADO' | 'PRE CALENTAMIENTO' | 'PRE ENFRIAMIENTO';
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

export interface DetallesEquipo {
    historial: Paso[];
}

export const transformData = (
    id: number,
    cocinas: Array<[InfoEquipo, DetallesEquipo]>,
    enfriadores: Array<[InfoEquipo, DetallesEquipo]>
) => {
    const todosEquipos = [...cocinas, ...enfriadores];
    const equipo = todosEquipos.find(([info]) => info.id === id);

    // Si no hay datos, intentar recuperar del localStorage
    if (!equipo) {
        const cachedData = localStorage.getItem(`equipo-${id}`);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        return { labels: [], datasets: [] };
    }

    const [_, detalles] = equipo;
    const historial = detalles.historial || [];

    // Función para convertir fecha string a timestamp en segundos
    const getTimestamp = (dateStr: string) => {
        const date = new Date(dateStr);
        return Math.floor(date.getTime() / 1000);
    };

    // Obtener el timestamp inicial
    const tiempoInicial = historial.length > 0 ? 
        getTimestamp(historial[0].tiempo) : 
        getTimestamp(new Date().toISOString());

    // Ordenar el historial por tiempo
    const historialOrdenado = [...historial].sort((a, b) => 
        getTimestamp(a.tiempo) - getTimestamp(b.tiempo)
    );

    // Crear arrays para los datos
    const tiempos: number[] = [];
    const tempIngrData: { x: number, y: number }[] = [];
    const tempAguaData: { x: number, y: number }[] = [];
    const tempProdData: { x: number, y: number }[] = [];

    // Procesar datos del historial
    historialOrdenado.forEach(paso => {
        const tiempoRelativo = getTimestamp(paso.tiempo) - tiempoInicial;
        tiempos.push(tiempoRelativo);

        if (paso.temp_Ing !== null && paso.temp_Ing !== 'N/A' && typeof paso.temp_Ing === 'number') {
            tempIngrData.push({ x: tiempoRelativo, y: paso.temp_Ing });
        }
        if (paso.temp_agua !== null && paso.temp_agua !== 'N/A' && typeof paso.temp_agua === 'number') {
            tempAguaData.push({ x: tiempoRelativo, y: paso.temp_agua });
        }
        if (paso.temp_ingreso !== null && paso.temp_ingreso !== 'N/A' && typeof paso.temp_ingreso === 'number') {
            tempProdData.push({ x: tiempoRelativo, y: paso.temp_ingreso });
        }
    });

    const chartData = {
        labels: tiempos,
        datasets: [
            {
                label: 'Temperatura de Ingreso',
                backgroundColor: 'rgba(255, 165, 0, 0.5)',
                borderColor: 'rgb(255, 165, 0)',
                fill: false,
                data: tempIngrData
            },
            {
                label: 'Temperatura de Agua',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                fill: false,
                data: tempAguaData
            },
            {
                label: 'Temperatura de Producto',
                backgroundColor: 'rgba(75, 192, 75, 0.5)',
                borderColor: 'rgb(75, 192, 75)',
                fill: false,
                data: tempProdData
            }
        ]
    };

    // Guardar en localStorage
    try {
        localStorage.setItem(`equipo-${id}`, JSON.stringify(chartData));
    } catch (error) {
        console.warn('Error al guardar datos en localStorage:', error);
    }

    return chartData;
};

// Función auxiliar para limpiar datos antiguos
export const clearStoredData = (id: number) => {
    localStorage.removeItem(`equipo-${id}`);
};

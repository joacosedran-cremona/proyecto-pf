import { Paso } from './interface';

export const transformData = (data: { historial: Paso[] }[]) => {
    const labels: string[] = [];
    const tempIngrData: { x: number, y: number }[] = [];
    const tempAguaData: { x: number, y: number }[] = [];
    const tempProdData: { x: number, y: number }[] = [];

    // Iterar sobre los objetos que contienen historial
    data.forEach(item => {
        if (item.historial && Array.isArray(item.historial)) {
            item.historial.forEach(paso => {
                const tiempo = paso.tiempo;
                if (tiempo !== null && !isNaN(tiempo)) {
                    // Agregar temp_Ing a los datos
                    if (paso.temp_Ing !== null && paso.temp_Ing !== 'N/A' && typeof paso.temp_Ing === 'number') {
                        tempIngrData.push({ x: tiempo, y: paso.temp_Ing });
                    }
                    // Agregar temp_Agua a los datos
                    if (paso.temp_Agua !== null && paso.temp_Agua !== 'N/A' && typeof paso.temp_Agua === 'number') {
                        tempAguaData.push({ x: tiempo, y: paso.temp_Agua });
                    }
                    // Agregar temp_Ingreso a los datos
                    if (paso.temp_Ingreso !== null && paso.temp_Ingreso !== 'N/A' && typeof paso.temp_Ingreso === 'number') {
                        tempProdData.push({ x: tiempo, y: paso.temp_Ingreso });
                    }
                }
            });
        }
    });

    return {
        labels,
        datasets: [
            {
                label: 'Temperatura de Ingreso',
                backgroundColor: 'rgba(255, 165, 0, 0.5)', // Naranja/amarillo
                borderColor: 'rgb(255, 165, 0)',
                fill: false,
                data: tempIngrData
            },
            {
                label: 'Temperatura de Agua',
                backgroundColor: 'rgba(54, 162, 235, 0.5)', // Azul
                borderColor: 'rgb(54, 162, 235)',
                fill: false,
                data: tempAguaData
            },
            {
                label: 'Temperatura de Producto',
                backgroundColor: 'rgba(75, 192, 75, 0.5)', // Verde
                borderColor: 'rgb(75, 192, 75)',
                fill: false,
                data: tempProdData
            }
        ]
    };
};
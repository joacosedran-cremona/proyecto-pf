import { Paso } from './interface';

export const transformData = (data: Paso[]) => {
    const labels: string[] = [];
    const tempIngrData: { x: number, y: number }[] = [];
    const tempAguaData: { x: number, y: number }[] = [];
    const tempProdData: { x: number, y: number }[] = [];

    // Iterar directamente sobre los pasos
    data.forEach(item => {
        const tiempo = item.tiempo;
        const tiempoMs = new Date(tiempo).getTime();
    
        if (!isNaN(tiempoMs)) {
            if (item.temp_Ing !== null && item.temp_Ing !== 'N/A' && typeof item.temp_Ing === 'number') {
                tempIngrData.push({ x: tiempoMs, y: item.temp_Ing });
            }
            if (item.temp_Agua !== null && item.temp_Agua !== 'N/A' && typeof item.temp_Agua === 'number') {
                tempAguaData.push({ x: tiempoMs, y: item.temp_Agua });
            }
            if (item.temp_Ingreso !== null && item.temp_Ingreso !== 'N/A' && typeof item.temp_Ingreso === 'number') {
                tempProdData.push({ x: tiempoMs, y: item.temp_Ingreso });
            }
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

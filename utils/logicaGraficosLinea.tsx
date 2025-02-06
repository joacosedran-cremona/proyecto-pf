import { Paso } from './interface';

export const transformData = (data: Paso[]) => {
    const labels: string[] = [];
    const tempAguaData: { x: number, y: number }[] = [];
    const tempProdData: { x: number, y: number }[] = [];

    data.forEach(item => {
        const tiempo = item.tiempo;
        if (tiempo !== null && !isNaN(tiempo)) {
            if (item.temp_Agua !== null && item.temp_Agua !== 'N/A' && typeof item.temp_Agua === 'number') {
                tempAguaData.push({ x: tiempo, y: item.temp_Agua });
            }
            if (item.temp_Prod !== null && item.temp_Prod !== 'N/A' && typeof item.temp_Prod === 'number') {
                tempProdData.push({ x: tiempo, y: item.temp_Prod });
            }
        }
    });

    return {
        labels,
        datasets: [
            {
                label: 'Temperatura de Agua',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                fill: false,
                data: tempAguaData
            },
            {
                label: 'Temperatura de Producto',
                backgroundColor: 'rgba(192, 75, 75, 0.5)',
                borderColor: 'rgb(192, 75, 75)',
                fill: false,
                data: tempProdData
            }
        ]
    };
};

import { CocinaData, EnfriadorData } from './interface';

export const transformData = (data: (CocinaData | EnfriadorData)[]) => {
    const labels: string[] = [];
    const tempAguaData: { x: number, y: number }[] = [];
    const tempProdData: { x: number, y: number }[] = [];

    data.forEach(item => {
        item.pasos.forEach((paso) => {
            const tiempo = paso.tiempo;
            if (tiempo !== null && !isNaN(tiempo)) {
                if (paso.temp_Agua !== null && paso.temp_Agua !== 'N/A' && typeof paso.temp_Agua === 'number') {
                    tempAguaData.push({ x: tiempo, y: paso.temp_Agua });
                }
                if (paso.temp_Prod !== null && paso.temp_Prod !== 'N/A' && typeof paso.temp_Prod === 'number') {
                    tempProdData.push({ x: tiempo, y: paso.temp_Prod });
                }
            }
        });
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
}

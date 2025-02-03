import { CocinaData, EnfriadorData } from './interface';

export const transformData = (data: (CocinaData | EnfriadorData)[]) => {
    const labels: string[] = [];
    const tempIngData: { x: number, y: number }[] = [];
    const tempAguaData: { x: number, y: number }[] = [];
    const tempProdData: { x: number, y: number }[] = [];

    data.forEach(item => {
        item.pasos.forEach((paso) => { // Explicitly declare paso as Paso
            if (paso.tiempo) labels.push(paso.tiempo);
            const tiempo = paso.tiempo ? new Date(paso.tiempo).getTime() : NaN;
            if (paso.temp_Ing !== null && paso.temp_Ing !== 'N/A' && typeof paso.temp_Ing === 'number') {
                tempIngData.push({ x: tiempo, y: paso.temp_Ing });
            }
            if (paso.temp_Agua !== null && paso.temp_Agua !== 'N/A' && typeof paso.temp_Agua === 'number') {
                tempAguaData.push({ x: tiempo, y: paso.temp_Agua });
            }
            if (paso.temp_Prod !== null && paso.temp_Prod !== 'N/A' && typeof paso.temp_Prod === 'number') {
                tempProdData.push({ x: tiempo, y: paso.temp_Prod });
            }
        });
    });

    return {
        labels,
        datasets: [
            {
                label: 'Temperatura de Ingreso',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                fill: false,
                data: tempIngData
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
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                fill: false,
                data: tempProdData
            }
        ]
    };
}

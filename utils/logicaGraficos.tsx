// utils.ts
export interface Paso {
    id: number;
    temp_Ing?: number | null;
    temp_Agua?: number | null;
    temp_Prod?: number | null;
    niv_Agua?: number | null;
    tiempo: string;
    tipo_Fin?: string;
}

export interface CocinaData {
    num_cocina: number;
    num_receta: number;
    nom_receta: string;
    estado: string;
    cant_torres: number;
    pasos: Paso[];
    sector_io: SectorIO[];
}

export interface SectorIO {
    frio: boolean;
    vapor_vivo: boolean;
    vapor_serp: boolean;
    io_yy_eq_xx: boolean;
}

export const transformData = (data: CocinaData[]) => {
    const labels: string[] = [];
    const tempIngData: { x: number, y: number }[] = [];
    const tempAguaData: { x: number, y: number }[] = [];
    const tempProdData: { x: number, y: number }[] = [];

    data.forEach(cocina => {
        cocina.pasos.forEach(paso => {
            labels.push(paso.tiempo);
            if (paso.temp_Ing !== undefined && paso.temp_Ing !== null) {
                tempIngData.push({ x: new Date(paso.tiempo).getTime(), y: paso.temp_Ing });
            }
            if (paso.temp_Agua !== undefined && paso.temp_Agua !== null) {
                tempAguaData.push({ x: new Date(paso.tiempo).getTime(), y: paso.temp_Agua });
            }
            if (paso.temp_Prod !== undefined && paso.temp_Prod !== null) {
                tempProdData.push({ x: new Date(paso.tiempo).getTime(), y: paso.temp_Prod });
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

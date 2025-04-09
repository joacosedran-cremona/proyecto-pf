import { CocinaDataCompleta } from '@/context/CocinaContext';
import { EnfriadorDataCompleta } from '@/context/EnfriadorContext';

export const transformData = (equipo: CocinaDataCompleta | EnfriadorDataCompleta | null) => {
    if (!equipo || !equipo.historial) {
        return {
            labels: [],
            datasets: []
        };
    }

    const tempAguaData: { x: number, y: number }[] = [];
    const tempProdData: { x: number, y: number }[] = [];

    equipo.historial.forEach((registro) => {
        if (registro.tiempo !== undefined && !isNaN(registro.tiempo)) {
            if (registro.temp_Agua !== undefined && !isNaN(registro.temp_Agua)) {
                tempAguaData.push({ 
                    x: registro.tiempo, 
                    y: registro.temp_Agua 
                });
            }
            if (registro.temp_Ingreso !== undefined && !isNaN(registro.temp_Ingreso)) {
                tempProdData.push({ 
                    x: registro.tiempo, 
                    y: registro.temp_Ingreso 
                });
            }
        }
    });

    return {
        labels: [],
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
                backgroundColor: 'rgba(75, 192, 75, 0.5)',
                borderColor: 'rgb(75, 192, 75)',
                fill: false,
                data: tempProdData
            }
        ]
    };
};

// Función auxiliar para determinar el tipo de equipo
export const getEquipoTipo = (equipo: CocinaDataCompleta | EnfriadorDataCompleta) => {
    return equipo.tipo === 'COCINA' ? 'Cocina' : 'Enfriador';
};

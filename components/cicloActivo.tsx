import React from 'react';
import { getColorClass } from '@/utils/logicaColores';

interface CicloActivoProps {
    datosCiclo: { label: string, value: string | number | null }[];
    displayData: (data: string | number | null | boolean) => string | number | boolean;
    defaultColor: 'orange' | 'blue' | 'green';
}

const CicloActivo: React.FC<CicloActivoProps> = ({ datosCiclo, displayData, defaultColor }) => {
    return (
        <>
            <h2 className="text-xl">Ciclo Activo</h2>
            <ul className="grid gap-1h">
                {datosCiclo.map((dato) => (
                    <li key={dato.label} className="bg-grey grid px-20 py-1h rounded-md items-center">
                        <p className="text-[calc(0.4vw+0.9vh)]">
                            {dato.label}
                        </p>
                        <p className={`text-[calc(0.4vw+0.8vh)] ${getColorClass(dato.label, dato.value, defaultColor)}`}>
                            {displayData(dato.value)}
                        </p>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default CicloActivo;

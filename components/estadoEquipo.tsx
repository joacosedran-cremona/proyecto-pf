import React from 'react';

interface EstadoEquipoProps {
    datos: { label: string, value: string | number | null, unit?: string }[];
    getColorClass: (label: string, value: string | number | null) => string;
    displayData: (data: string | number | null | boolean, unit?: string) => string | number | boolean;
}

const EstadoEquipo: React.FC<EstadoEquipoProps> = ({ datos, getColorClass, displayData }) => {
    return (
        <div className="bg-black flex flex-col p-20 w-full h-full rounded-md">
            <h2 className="flex justify-start text-center w-full h-50 py-auto text-xl">Estado Equipo</h2>
            <ul className="flex flex-col h-full w-full gap-1h">
                {datos.map((dato) => (
                    <li key={dato.label} className="bg-grey flex flex-col w-full h-full px-20 py-1h rounded-md items-center">
                        <p className="h-1/2 w-full mb-[1.5wv] text-[calc(0.6vw+1vh)]">{dato.label}</p>
                        <p className={`h-1/2 w-full text-[calc(0.5vw+1vh)] ${getColorClass(dato.label, dato.value)}`}>
                            {displayData(dato.value, dato.unit)}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EstadoEquipo;

import React from 'react';


interface EstadoEquipoProps {
    datos: { label: string, value: string | number | null, unit?: string }[];
    displayData: (data: string | number | null | boolean, unit?: string) => string | number | boolean;
    getColorClass: (label: string, value: string | number | null) => string;
}

const EstadoEquipo: React.FC<EstadoEquipoProps> = ({ datos, getColorClass, displayData }) => {
    return (
        <>
            <h2 className="text-xl">Estado Equipo</h2>
            <ul className="grid gap-1h">
                {datos.map((dato) => (
                    <li key={dato.label} className="bg-grey grid px-20 py-1h rounded-md items-center">
                        <p className="text-[calc(0.6vw+1vh)]">
                            {dato.label}
                        </p>
                        <p className={`text-[calc(0.5vw+1vh)] ${getColorClass(dato.label, dato.value)}`}>
                            {displayData(dato.value, dato.unit)}
                        </p>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default EstadoEquipo;

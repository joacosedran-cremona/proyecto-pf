import React from 'react';

interface CicloActivoProps {
    datosCiclo: { label: string, value: string | number | null }[];
    displayData: (data: string | number | null | boolean) => string | number | boolean;
}

const CicloActivo: React.FC<CicloActivoProps> = ({ datosCiclo, displayData }) => {
    return (
        <div className="bg-black flex flex-col p-20 w-full h-full rounded-md">
            <h2 className="flex justify-start text-center w-full h-50 py-auto text-xl">Ciclo Activo</h2>
            <ul className="flex flex-col h-full w-full gap-1h">
                {datosCiclo.map((dato) => (
                    <li key={dato.label} className="bg-grey flex flex-col w-full h-1/5 px-20 py-1h rounded-md items-center">
                        <p className="h-auto w-full text-[calc(0.4vw+0.9vh)]">{dato.label}</p>
                        <p className="h-auto w-full text-[calc(0.4vw+0.8vh)] text-green">
                            {displayData(dato.value)}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CicloActivo;

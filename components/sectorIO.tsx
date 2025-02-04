import React from 'react';

interface SectorIOProps {
    datosIO: { label: string, value: string | number | boolean | null }[];
    getColorClass: (label: string, value: string | number | null | boolean) => string;
    displayData: (data: string | number | boolean | null) => string | number | boolean;
}

const SectorIO: React.FC<SectorIOProps> = ({ datosIO, getColorClass, displayData }) => {
    return (
        <>
            <h2 className="text-xl">Sector IO</h2>
            <ul className="grid gap-1h 1365:grid-cols-2">
                {datosIO.map((dato) => (
                    <li key={dato.label} className="bg-grey flex justify-between px-20 py-1h rounded-md items-center">
                        <p className="text-[calc(0.4vw+1vh)]">{dato.label}</p>
                        <p className={`text-[calc(0.4vw+1vh)] ${getColorClass(dato.label, dato.value)}`}>{displayData(dato.value)}</p>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default SectorIO;

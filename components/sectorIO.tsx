import React from 'react';

interface SectorIOProps {
    datosIO: { label: string, value: string | number | boolean | null }[];
    displayData: (data: string | number | boolean | null) => string | number | boolean;
}

const SectorIO: React.FC<SectorIOProps> = ({ datosIO, displayData }) => {
    return (
        <div className="flex flex-col bg-black h-full p-20 w-1/3 rounded-md gap-20 custom:w-full custom:h-1/3">
            <h2 className="flex justify-start text-center w-full h-auto text-xl">Sector IO</h2>
            <ul className="flex flex-col gap-20 h-full custom:grid custom:grid-cols-2">
                {datosIO.map((dato) => (
                    <li key={dato.label} className="bg-grey flex flex-row w-full h-full px-20 py-10 rounded-md items-center">
                        <p className="flex h-auto w-full text-[calc(0.4vw+1vh)] items-center">{dato.label}</p>
                        <p className="flex w-auto text-[calc(0.4vw+1vh)] justify-end">{displayData(dato.value)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SectorIO;

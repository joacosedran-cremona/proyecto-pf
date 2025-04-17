"use client";

import { useLinea } from "@/context/LineaContext";
import { useTranslation } from 'react-i18next';

interface SelectorProps {
    selectClasses?: string;
}

const Selector: React.FC<SelectorProps> = ({ selectClasses }) => {
    const { lineaSeleccionada, setLineaSeleccionada } = useLinea();

    const { t } = useTranslation('selectores');

    const lineaList = [
        { id: 1, name: 'Todos' },
        { id: 2, name: 'Cocina 1' },
        { id: 3, name: 'Cocina 2' },
        { id: 4, name: 'Cocina 3' },
        { id: 5, name: 'Enfriador 1' },
        { id: 6, name: 'Enfriador 2' },
        { id: 7, name: 'Enfriador 3' },
        { id: 8, name: 'Enfriador 4' },
    ];

    const defaultClasses =
<<<<<<< HEAD
        "bg-[#0001] h-[100%] w-[100%] px-[20px] border-b-[2px] border-green focus:border-green focus:outline-none text-lg text-green hover:text-green transition-colors cursor-pointer";
=======
        "bg-[#0001] h-[100%] w-[100%] px-[20px] border-b-2 border-white focus:border-white focus:outline-none text-lg text-white hover:text-white transition-colors cursor-pointer";
>>>>>>> d805298da5e6aae46e05ed4ee50479373c9bbcfe

    return (
        <select
            value={lineaSeleccionada}
            onChange={(e) => setLineaSeleccionada(Number(e.target.value))}
            className={selectClasses || defaultClasses}
        >
            {lineaList.map((linea) => (
                <option
                    key={linea.id}
                    value={linea.id}
<<<<<<< HEAD
                    className="p-[2px] text-green hover:text-green bg-black font-bold"
=======
                    className="p-[2px] text-white hover:text-white bg-black font-bold"
>>>>>>> d805298da5e6aae46e05ed4ee50479373c9bbcfe
                >
                    {linea.name}
                </option>
            ))}
        </select>
    );
};

export default Selector;

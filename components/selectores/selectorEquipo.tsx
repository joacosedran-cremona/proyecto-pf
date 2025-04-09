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
        "bg-[#0001] h-full w-full px-20 border-b-2 border-green focus:border-green focus:outline-none text-lg text-green hover:text-green transition-colors cursor-pointer";

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
                    className="p-2 text-green hover:text-green bg-black font-bold"
                >
                    {linea.name}
                </option>
            ))}
        </select>
    );
};

export default Selector;

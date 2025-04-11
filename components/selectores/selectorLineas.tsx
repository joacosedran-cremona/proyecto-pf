"use client";

import { useLinea, type LineaId } from "@/context/LineaContext";
import { useTranslation } from 'react-i18next';

interface SelectorProps {
    selectClasses?: string;
}

const Selector: React.FC<SelectorProps> = ({ selectClasses }) => {
    const { lineaSeleccionada, setLineaSeleccionada } = useLinea();

    const { t } = useTranslation('selectores');

    const lineaList: Array<{ id: LineaId, name: string }> = [
        { id: 1, name: t('lineas.linea1') },
        { id: 2, name: t('lineas.linea2') },
        { id: 3, name: t('lineas.linea3') },
    ];

    const defaultClasses =
        "bg-[#0001] h-full w-full px-20 border-b-2 border-green focus:border-green focus:outline-none text-lg text-green hover:text-green transition-colors cursor-pointer";

    return (
        <select
            value={lineaSeleccionada}
            onChange={(e) => setLineaSeleccionada(Number(e.target.value) as LineaId)}
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

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
        { id: 3, name: t('lineas.linea3') }
    ];

    const defaultClasses =
        "bg-[#0001] h-[100%] w-[100%] px-[20] border-b-2 border-white focus:border-white focus:outline-none text-lg text-white hover:text-white transition-colors cursor-pointer";

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
                    className="p-[2px] text-white hover:text-white bg-black font-bold"
                >
                    {linea.name}
                </option>
            ))}
        </select>
    );
};

export default Selector;

"use client";

import { useLinea } from "@/context/LineaContext";

const Selector: React.FC = () => {
    const { lineaSeleccionada, setLineaSeleccionada } = useLinea();

    const lineaList = [
        { id: 1, name: "Línea 1" },
        { id: 2, name: "Línea 2" },
    ];

    return (
        <select
            value={lineaSeleccionada}
            onChange={(e) => setLineaSeleccionada(Number(e.target.value))}
            className="
                bg-[#0001] h-full w-full px-20 border-b-2 border-green 
                focus:border-green focus:outline-none text-lg text-green 
                hover:text-green transition-colors cursor-pointer
            "
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

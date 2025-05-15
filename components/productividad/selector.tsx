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
                bg-[#0001] h-[100%] w-[100%] px-[20px] border-b-[2px] border-white 
                focus:border-white focus:outline-none text-lg text-white 
                hover:text-white transition-colors cursor-pointer
            "
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

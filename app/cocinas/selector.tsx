"use client";

import { useCocina } from "@/context/CocinaContext";

const Selector: React.FC = () => {
    const { cocinaId, setCocinaId } = useCocina();

    const cocinasList = [
        { id: 1, name: "Cocina 1" },
        { id: 2, name: "Cocina 2" },
        { id: 3, name: "Cocina 3" },
        { id: 4, name: "Cocina 4" },
        { id: 5, name: "Cocina 5" },
        { id: 6, name: "Cocina 6" }
    ];

    return (
        <div className="flex flex-col">
            <div className="flex justify-start w-full h-[50px]">
                <select
                    value={cocinaId}
                    onChange={(e) => setCocinaId(Number(e.target.value))}
                    className="
                        w-full
                        bg-[#0001]
                        px-20
                        border-b-2
                        border-orange
                        focus:border-orange
                        focus:outline-none
                        text-lg
                        text-orange
                        hover:text-orange
                        transition-colors
                        cursor-pointer
                    "
                >
                    <option value="" disabled
                        className=""
                    >
                        Seleccione una cocina
                    </option>
                    {cocinasList.map((cocina) => (
                        <option
                            key={cocina.id}
                            value={cocina.id}
                            className="
                                p-2
                                text-orange
                                hover:text-orange
                                bg-black
                                font-bold
                            "
                        >
                            {cocina.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Selector;
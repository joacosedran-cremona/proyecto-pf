"use client";

import { useEnfriador } from "@/context/EnfriadorContext";
import { Select, SelectItem } from "@heroui/react";

const Selector: React.FC = () => {
    const { enfriadorId, setEnfriadorId } = useEnfriador();

    const enfriadoresList = [
        { id: 1, name: "Enfriador 1" },
        { id: 2, name: "Enfriador 2" },
        { id: 3, name: "Enfriador 3" },
        { id: 4, name: "Enfriador 4" },
        { id: 5, name: "Enfriador 5" },
        { id: 6, name: "Enfriador 6" },
        { id: 7, name: "Enfriador 7" },
        { id: 8, name: "Enfriador 8" },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-start w-full h-[50px]">
            <select
                    value={enfriadorId}
                    onChange={(e) => setEnfriadorId(Number(e.target.value))}
                    className="
                        w-full
                        bg-[#0001]
                        px-20
                        border-b-2
                        border-blue
                        focus:border-water
                        focus:outline-none
                        text-lg
                        text-blue
                        hover:text-water
                        transition-colors
                        cursor-pointer
                    "
                >
                    <option value="" disabled
                        className=""
                    >
                        Seleccione una cocina
                    </option>
                    {enfriadoresList.map((enfriador) => (
                        <option
                            key={enfriador.id}
                            value={enfriador.id}
                            className="
                                p-2
                                text-blue
                                hover:text-water
                                bg-black
                                font-bold
                            "
                        >
                            {enfriador.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Selector;

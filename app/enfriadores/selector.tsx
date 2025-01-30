"use client";

import { useCocina } from "@/context/CocinaContext";
import { Select, SelectItem } from "@heroui/react";

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
        <div className="flex flex-col gap-4">
            <div className="flex justify-start w-full h-[50px]">
                <Select
                    size="lg"
                    items={cocinasList}
                    defaultSelectedKeys={String(cocinaId)}
                    value={String(cocinaId)}
                    variant="underlined"
                    onChange={(e) => setCocinaId(Number(e.target.value))}
                    placeholder="Seleccione una cocina"
                >
                    {(cocina) => (
                        <SelectItem key={cocina.id} className="p-10 text-orange hover:text-orange text-lg font-bold">
                            {cocina.name}
                        </SelectItem>
                    )}
                </Select>
            </div>
        </div>
    );
};

export default Selector;

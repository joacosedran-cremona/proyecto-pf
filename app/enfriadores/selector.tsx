"use client";

import { useEnfriador } from "@/context/EnfriadorContext";
import { Select, SelectItem } from "@heroui/react";

const Selector: React.FC = () => {
    const { enfriadorId, setEnfriadorId } = useEnfriador();

    const enfriadorList = [
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
                <Select
                    size="lg"
                    items={enfriadorList}
                    defaultSelectedKeys={String(enfriadorId)}
                    value={String(enfriadorId)}
                    variant="underlined"
                    onChange={(e) => setEnfriadorId(Number(e.target.value))}
                    placeholder="Seleccione un enfriador"
                >
                    {(enfriador) => (
                        <SelectItem key={enfriador.id} className="p-10 text-blue hover:text-blue text-lg font-bold">
                            {enfriador.name}
                        </SelectItem>
                    )}
                </Select>
            </div>
        </div>
    );
};

export default Selector;

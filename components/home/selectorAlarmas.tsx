"use client";

import React from "react";
import { Select, SelectItem } from "@heroui/react";

const Selector = ({ value = 1}) => {

    const itemsList = [
        { id: 1, shortName: "C1", name: "Cocina 1 - L1" },
        { id: 2, shortName: "C2", name: "Cocina 2 - L1" },
        { id: 3, shortName: "C3", name: "Cocina 3 - L1" },
        { id: 4, shortName: "C4", name: "Cocina 4 - L2" },
        { id: 5, shortName: "C5", name: "Cocina 5 - L2" },
        { id: 6, shortName: "C6", name: "Cocina 6 - L2" },
        { id: 7, shortName: "E1", name: "Enfriador 1 - L1" },
        { id: 8, shortName: "E2", name: "Enfriador 2 - L1" },
        { id: 9, shortName: "E3", name: "Enfriador 3 - L1" },
        { id: 10, shortName: "E4", name: "Enfriador 4 - L1" },
        { id: 11, shortName: "E5", name: "Enfriador 5 - L2" },
        { id: 12, shortName: "E6", name: "Enfriador 6 - L2" },
        { id: 13, shortName: "E7", name: "Enfriador 7 - L2" },
        { id: 14, shortName: "E8", name: "Enfriador 8 - L2" }
    ];

    return (
        <Select
            radius="lg"
            disallowEmptySelection
            selectedKeys={[value.toString()]}
            aria-label="Seleccionar equipo"
            classNames={{
                trigger: "bg-[#27272a] text-white h-[50px] rounded-lg",
                value: "text-white",
                listbox: "bg-black text-white rounded-lg",
                base: "rounded-lg",
            }}
            renderValue={(items) => {
                const selected = itemsList.find(i => i.id === Number(items[0]?.key));
                return (
                    <div className="text-white">
                        {selected?.name || "Seleccionar"}
                    </div>
                );
            }}
        >
            {itemsList.map((item) => (
                <SelectItem 
                    key={item.id.toString()} 
                    value={item.id.toString()}
                    className="text-white hover:bg-gray-800 rounded-lg mx-1 px-2"
                >
                    {item.name}
                </SelectItem>
            ))}
        </Select>
    );
};

export default Selector;
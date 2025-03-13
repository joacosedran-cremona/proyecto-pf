"use client";

import React from "react";

interface SelectorProps {
    value: number;
    onChange: (value: number) => void;
    items: { id: number; name: string }[];
    placeholder?: string;
    selectClasses?: string;
    optionClasses?: string;
}

const Selector: React.FC<SelectorProps> = ({
    value,
    onChange,
    items,
    placeholder = "Seleccione un elemento",
    selectClasses = "w-full bg-[#0001] px-20 border-b-2 focus:outline-none text-lg transition-colors cursor-pointer",
    optionClasses = "p-2 bg-black font-bold",
}) => {
    return (
        <div className="flex justify-start w-full h-[50px]">
            <select
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={selectClasses}
            >
                <option value={0} disabled>
                    {placeholder}
                </option>
                {items.map((item) => (
                    <option key={item.id} value={item.id} className={optionClasses}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Selector;
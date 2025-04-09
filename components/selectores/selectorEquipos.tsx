"use client";

import React from "react";

interface SelectorProps {
    value: number;
    onChange: (value: number) => void;
    isCocina: boolean;
    selectClasses?: string;
    optionClasses?: string;
}

export default function Selector({ value, onChange, isCocina, selectClasses, optionClasses }: SelectorProps) {
    const maxItems = isCocina ? 6 : 14;
    
    const options = Array.from({ length: maxItems }, (_, i) => ({
        value: isCocina ? i + 1 : i + 7,
        label: `${isCocina ? 'Cocina' : 'Enfriador'} ${i + 1} - L${
            isCocina
                ? (i + 1 <= 3 ? '1' : '2')
                : (i + 1 <= 4 ? '1' : '2')
        }`,          
        visibleNumber: i - 1
    }));

    return (
        <select
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className={selectClasses}
        >
            {options.map(option => (
                <option 
                    key={option.value} 
                    value={option.value}
                    className={optionClasses}
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
}
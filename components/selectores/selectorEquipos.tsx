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
    const maxItems = isCocina ? 6 : 8;
    
    // Convertir el ID real al número visible (1-8 para enfriadores, 1-6 para cocinas)
    const visibleNumber = isCocina ? value : value - 1;
    
    const options = Array.from({ length: maxItems }, (_, i) => ({
        value: isCocina ? i + 1 : i + 7,
        label: `${isCocina ? 'Cocina' : 'Enfriador'} ${i + 1} - L${
            isCocina
              ? (i + 1 <= 3 ? '1' : '2')  // Cocina: 1-3 => Línea 1, 4-6 => Línea 2
              : (i + 1 <= 4 ? '1' : '2')  // Enfriador: 1-4 => Línea 1, 5-8 => Línea 2
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
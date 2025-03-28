"use client";

import React, { useMemo, useCallback } from "react";
import { useTranslation } from 'react-i18next';

interface SelectorProps {
    value: number;
    onChange: (value: number) => void;
    isCocina: boolean;
    selectClasses?: string;
    optionClasses?: string;
}

type CocinaKeys = `cocinas.cocina${1 | 2 | 3 | 4 | 5 | 6}`;
type EnfriadorKeys = `enfriadores.enfriador${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;
type TranslationKey = 'select' | CocinaKeys | EnfriadorKeys;

const Selector: React.FC<SelectorProps> = React.memo(({
    value,
    onChange,
    isCocina,
    selectClasses = "",
    optionClasses = "",
}) => {
    const { t } = useTranslation('selectores');
    
    // Memoizar los items para evitar recálculos innecesarios
    const items = useMemo(() => {
        const length = isCocina ? 6 : 8;
        return Array.from({ length }, (_, i) => ({
            id: i + 1,
            name: t(
                `${isCocina ? 'cocinas.cocina' : 'enfriadores.enfriador'}${i + 1}` as TranslationKey,
                { returnNull: true }
            ) || `${isCocina ? 'Cocina' : 'Enfriador'} ${i + 1}`
        }));
    }, [isCocina, t]);

    // Optimizar el handler del cambio
    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = Number(e.target.value);
        if (!isNaN(newValue) && newValue !== value) {
            requestAnimationFrame(() => {
                onChange(newValue);
            });
        }
    }, [onChange, value]);

    // Evitar re-renders innecesarios usando useMemo para el select
    return useMemo(() => (
        <div className="flex min-h-[50px]">
            <select
                value={value}
                onChange={handleChange}
                className={selectClasses}
            >
                {items.map((item) => (
                    <option 
                        key={item.id} 
                        value={item.id} 
                        className={optionClasses}
                    >
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    ), [value, handleChange, selectClasses, optionClasses, items]);
}, 
(prevProps, nextProps) => {
    return prevProps.value === nextProps.value && 
        prevProps.isCocina === nextProps.isCocina;
});

Selector.displayName = 'Selector';

export default Selector;
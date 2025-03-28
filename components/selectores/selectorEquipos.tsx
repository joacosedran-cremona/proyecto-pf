"use client";

import React, { useMemo } from "react";
import { useTranslation } from 'react-i18next';

interface SelectorProps {
    value: number;
    onChange: (value: number) => void;
    isCocina: boolean;
    selectClasses?: string;
    optionClasses?: string;
}

// Tipos específicos para las traducciones
type CocinaKeys = `cocinas.cocina${1 | 2 | 3 | 4 | 5 | 6}`;
type EnfriadorKeys = `enfriadores.enfriador${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;
type TranslationKey = 'select' | CocinaKeys | EnfriadorKeys;

const Selector: React.FC<SelectorProps> = ({
    value,
    onChange,
    isCocina,
    selectClasses,
    optionClasses,
}) => {
    const { t } = useTranslation('selectores');
    
    const items = useMemo(() => {
        const length = isCocina ? 6 : 8;
        return Array.from({ length }, (_, i) => {
            const id = i + 1;
            const key = isCocina 
                ? `cocinas.cocina${id}` 
                : `enfriadores.enfriador${id}`;
            return {
                id,
                name: t(key as TranslationKey)
            };
        });
    }, [isCocina, t]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = Number(e.target.value);
        if (!isNaN(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <div className="flex min-h-[50px]">
            <select
                value={value}
                onChange={handleChange}
                className={selectClasses}
            >
                <option value={0} disabled>
                    {t('select')}
                </option>
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
    );
};

export default Selector;
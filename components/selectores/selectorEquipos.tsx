"use client";

import React from "react";
import { useTranslation } from 'react-i18next';

interface SelectorProps {
    value: number;
    onChange: (value: number) => void;
    isCocina: boolean;
    selectClasses?: string;
    optionClasses?: string;
}

const Selector: React.FC<SelectorProps> = ({
    value,
    onChange,
    isCocina,
    selectClasses,
    optionClasses,
}) => {
    const { t } = useTranslation('selectores');
    
    // Generar items basado en el tipo de equipo
    const items = Array.from({ length: isCocina ? 6 : 8 }, (_, i) => ({
        id: i + 1,
        name: t(isCocina ? `cocinas.cocina${i + 1}` : `enfriadores.enfriador${i + 1}`)
    }));

    return (
        <div className="flex min-h-[50px]">
            <select
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={selectClasses}
            >
                <option value={0} disabled>
                    {t('select')}
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
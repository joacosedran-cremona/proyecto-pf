"use client";

import React from "react";
import { useTranslation } from 'react-i18next';

interface SelectorProps {
    value: number;
    onChange: (value: number) => void;
    items: { id: number; name: string }[];
    selectClasses?: string;
    optionClasses?: string;
}

const Selector: React.FC<SelectorProps> = ({
    value,
    onChange,
    items,
    selectClasses,
    optionClasses,
}) => {
    const { t } = useTranslation('selectores');

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
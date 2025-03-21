"use client";

import React from "react";
import { useTranslation } from 'react-i18next';

interface SelectorProps {
    value: number;
    onChange: (value: number) => void;
    selectClasses?: string;
    optionClasses?: string;
}

const Selector: React.FC<SelectorProps> = ({
    value,
    onChange,
    selectClasses,
    optionClasses,
}) => {
    const { t } = useTranslation('selectores');

    const itemsList = [
        { id: 1,  name: t('cocinas.cocina1') },
        { id: 2,  name: t('cocinas.cocina2') },
        { id: 3,  name: t('cocinas.cocina3') },
        { id: 4,  name: t('cocinas.cocina4') },
        { id: 5,  name: t('cocinas.cocina5') },
        { id: 6,  name: t('cocinas.cocina6') },
        { id: 7,  name: t('enfriadores.enfriador1') },
        { id: 8,  name: t('enfriadores.enfriador2') },
        { id: 9,  name: t('enfriadores.enfriador3') },
        { id: 10, name: t('enfriadores.enfriador4') },
        { id: 11, name: t('enfriadores.enfriador5') },
        { id: 12, name: t('enfriadores.enfriador6') },
        { id: 13, name: t('enfriadores.enfriador7') },
        { id: 14, name: t('enfriadores.enfriador8') }
    ];

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
                {itemsList.map((item) => (
                    <option key={item.id} value={item.id} className={optionClasses}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Selector;
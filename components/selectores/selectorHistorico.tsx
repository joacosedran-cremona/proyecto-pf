"use client";

import React from "react";
import { useTranslation } from 'react-i18next';
import { Select, SelectItem } from "@heroui/react";

interface SelectorProps {
    value: number;
    onChange: (value: number) => void;
    selectClasses?: string;
    optionClasses?: string;
}

const Selector: React.FC<SelectorProps> = ({
    value = 1,
    onChange,
    selectClasses,
}) => {
    const { t } = useTranslation('selectores');

    const itemsList = [
        { id: 1, shortName: "C1", name: t('cocinas.cocina1') },
        { id: 2, shortName: "C2", name: t('cocinas.cocina2') },
        { id: 3, shortName: "C3", name: t('cocinas.cocina3') },
        { id: 4, shortName: "C4", name: t('cocinas.cocina4') },
        { id: 5, shortName: "C5", name: t('cocinas.cocina5') },
        { id: 6, shortName: "C6", name: t('cocinas.cocina6') },
        { id: 7, shortName: "E1", name: t('enfriadores.enfriador1') },
        { id: 8, shortName: "E2", name: t('enfriadores.enfriador2') },
        { id: 9, shortName: "E3", name: t('enfriadores.enfriador3') },
        { id: 10, shortName: "E4", name: t('enfriadores.enfriador4') },
        { id: 11, shortName: "E5", name: t('enfriadores.enfriador5') },
        { id: 12, shortName: "E6", name: t('enfriadores.enfriador6') },
        { id: 13, shortName: "E7", name: t('enfriadores.enfriador7') },
        { id: 14, shortName: "E8", name: t('enfriadores.enfriador8') }
    ];

    const handleChange = (e: any) => {
        const selectedValue = Number(e.target.value);
        onChange(selectedValue);
    };

    return (
        <Select
            radius="md"
            variant="bordered"
            selectedKeys={[value.toString()]}  // Usar solo selectedKeys, no defaultSelectedKeys
            onChange={handleChange}
            aria-label="Seleccionar equipo"
            classNames={{
                trigger: "h-[40px] w-[40px]",
                value: "text-center"
            }}
            renderValue={(items) => {
                return items.map((item) => (
                    <div key={item.key}>
                        {itemsList.find(i => i.id === Number(item.key))?.shortName}
                    </div>
                ));
            }}
        >
            {itemsList.map((item) => (
                <SelectItem 
                    key={item.id} 
                    value={item.id}
                    textValue={item.name}
                    className="text-center"
                >
                    {item.shortName}
                </SelectItem>
            ))}
        </Select>
    );
};

export default Selector;
import { Button } from "@heroui/react";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

interface BotonAplicarProps {
    selectClasses?: string;
    startDate: string | null;
    endDate: string | null;
    lineaId: number;
    equipoId: number;
    onApplyFilters: (data: {
        startDate: string | null,
        endDate: string | null,
        lineaId: number,
        equipoId: number
    }) => void;
}

export default function BotonAplicar({ 
    selectClasses, 
    startDate, 
    endDate, 
    lineaId, 
    equipoId,
    onApplyFilters 
}: BotonAplicarProps) {
    const { t } = useTranslation('botones');
    const isDisabled = !startDate || !endDate;

    const handleClick = () => {
        onApplyFilters({
            startDate,
            endDate,
            lineaId,
            equipoId
        });
    };

    return (
        <Button
            radius="md"
            color="default"
            variant="ghost"
            className={`${selectClasses} min-w-[40px] ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleClick}
            disabled={isDisabled}
        >
            <FaSearch style={{ color: isDisabled ? '#999' : 'grey'}} />
        </Button>
    );
}
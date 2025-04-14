import { Button } from "@heroui/react";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

interface BotonAplicarProps {
    selectClasses?: string;
    onClick?: () => void;
}

export default function BotonAplicar({ selectClasses, onClick }: BotonAplicarProps) {
    const { t } = useTranslation('botones');

    return (
        <Button
            radius="md"
            color="default"
            variant="ghost"
            className={`${selectClasses} min-w-[40px]`}
            onClick={onClick}
        >
            <FaSearch style={{ color: 'grey', marginRight: "5px" }} />
        </Button>
    );
}
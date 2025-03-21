import { Button } from "@heroui/react";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

interface BotonAplicarProps {
    selectClasses?: string;
}

export default function BotonAplicar({ selectClasses }: BotonAplicarProps) {
    const { t } = useTranslation('botones');

    return (
        <Button
            radius="md"
            color="default"
            variant="ghost"
            className={`${selectClasses} min-w-[130px]`}
        >
            <FaSearch style={{ color: 'grey', marginRight: "5px" }} />
            <p className="text-lightGrey">{t('aplicar')}</p>
        </Button>
    );
}

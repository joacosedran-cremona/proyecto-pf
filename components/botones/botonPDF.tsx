import { Button } from "@heroui/react";
import { FaFilePdf } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

interface BotonPDFProps {
    selectClasses?: string;
}

export default function BotonPDF({ selectClasses }: BotonPDFProps) {
    const { t } = useTranslation('botones');
    return (
        <Button
            radius="md"
            color="danger"
            variant="ghost"
            className={`text-danger ${selectClasses || "h-1/5"} min-w-[130px]`}
        >
            <FaFilePdf style={{ marginRight: "8px" }} />
            {t('pdf')}
        </Button>
    );
}

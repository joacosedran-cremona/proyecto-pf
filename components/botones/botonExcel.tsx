import { Button } from "@heroui/react";
import { FaFileExcel } from "react-icons/fa";

interface BotonExcelProps {
    selectClasses?: string;
}

export default function BotonExcel({ selectClasses }: BotonExcelProps) {
    return (
        <Button
            radius="md"
            color="success"
            variant="ghost"
            className={`text-success ${selectClasses || "h-1/5"}`}
        >
            <FaFileExcel style={{ marginRight: "8px" }} />
            Descargar Excel
        </Button>
    );
}

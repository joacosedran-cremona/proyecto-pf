import { Button } from "@heroui/react";
import { FaSearch } from "react-icons/fa";

interface BotonAplicarProps {
    selectClasses?: string;
}

export default function BotonAplicar({ selectClasses }: BotonAplicarProps) {
    return (
        <Button
            radius="md"
            color="default"
            variant="ghost"
            className={selectClasses}
        >
            <FaSearch style={{ marginRight: "5px" }} />
            Aplicar
        </Button>
    );
}

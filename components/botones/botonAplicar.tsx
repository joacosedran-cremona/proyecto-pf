import { Button } from "@heroui/react";
import { Image } from "@heroui/image";

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
            <Image src="SearchIcon.png" alt="Buscar" width={20} height={20} />
            Aplicar
        </Button>
    );
}

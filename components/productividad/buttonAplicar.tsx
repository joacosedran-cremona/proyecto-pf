import {Button} from "@heroui/react";
import { Image } from "@heroui/image"

export default function App() {
    return (
        <Button
            radius="md"
            color="default"
            variant="ghost"
            className="h-1/5 text-lightGrey hover:text-white justify-center gap-5"
        >
            <Image src="SearchIcon.png" alt="Buscar" width={20} height={20} />
            Aplicar
        </Button>
    );
}
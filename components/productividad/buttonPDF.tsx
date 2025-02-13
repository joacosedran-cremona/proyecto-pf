import {Button} from "@heroui/react";
import { FaFilePdf } from "react-icons/fa";

export default function App() {
    return (
        <Button
            radius="md"
            color="danger"
            variant="ghost"
            className="h-1/5 text-danger"
        >
            <FaFilePdf style={{ marginRight: "8px" }} />
            Descargar PDF
        </Button>
    );
}
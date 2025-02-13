import {Button} from "@heroui/react";
import { FaFileExcel } from "react-icons/fa";

export default function App() {
    return (
        <Button
            radius="md"
            color="success"
            variant="ghost"
            className="h-1/5 text-success"
        >
            <FaFileExcel style={{ marginRight: "8px" }} />
            Descargar Excel
        </Button>
    );
}
import { Button } from "@heroui/react";
import { FaFileExcel } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";

interface BotonExcelProps {
    selectClasses?: string;
    equipo?: string;
    cicloId?: number | null;
}

export default function BotonExcel({ selectClasses, equipo, cicloId }: BotonExcelProps) {
    const { t } = useTranslation('botones');

    const handleExcelDownload = async () => {
        if (!equipo || !cicloId) {
            toast.error('Error', {
                description: 'Seleccione un equipo y un ciclo para descargar',
                position: 'bottom-right'
            });
            return;
        }

        try {
            const host = process.env.NEXT_PUBLIC_WS_HOST || 'localhost';
            const port = process.env.NEXT_PUBLIC_WS_PORT || '8000';

            const response = await fetch(
                `http://${host}:${port}/historico-graficos/${equipo}/descargar/${cicloId}`,
                {
                    method: "GET",
                    headers: { 
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error en la descarga: ${response.status} - ${errorText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const filename = `historico_${equipo}_ciclo_${cicloId}.xlsx`;

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('Éxito', {
                description: 'Archivo descargado correctamente',
                position: 'bottom-right'
            });

        } catch (error) {
            console.error('Error al descargar el archivo Excel:', error);
            toast.error('Error', {
                description: error instanceof Error ? error.message : 'Error al descargar el archivo',
                position: 'bottom-right'
            });
        }
    };

    return (
        <Button
            radius="md"
            color="success"
            variant="ghost"
            className={`text-success ${selectClasses || "h-1/5"} min-w-[130px]`}
            onClick={handleExcelDownload}
        >
            <FaFileExcel style={{ marginRight: "8px" }} />
            {t('excel')}
        </Button>
    );
}
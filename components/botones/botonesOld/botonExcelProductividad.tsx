import { Button } from "@heroui/react";
import { FaFileExcel } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface BotonExcelProps {
  selectClasses?: string;
  startDate?: string | null;
  endDate?: string | null;
  dato_enviado?: number;
}

export default function BotonExcel({
  selectClasses,
  startDate,
  endDate,
  dato_enviado,
}: BotonExcelProps) {
  const { t } = useTranslation("botones");

  const handleExcelDownload = async () => {
    try {
      const host = process.env.NEXT_PUBLIC_WS_HOST || "localhost";
      const port = process.env.NEXT_PUBLIC_WS_PORT || "8000";

      const formattedStartDate =
        startDate?.split("T")[0] ||
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
      const formattedEndDate =
        endDate?.split("T")[0] || new Date().toISOString().split("T")[0];

      const response = await fetch(
        `http://${host}:${port}/historico-productividad/descargar/${dato_enviado}?fecha_inicio=${formattedStartDate}&fecha_fin=${formattedEndDate}`,
        {
          method: "GET",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Error en la descarga: ${response.status} - ${errorText}`,
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const filename = `productividad_${formattedStartDate}_${formattedEndDate}.xlsx`;

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Éxito", {
        description: "Archivo descargado correctamente",
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error al descargar el archivo Excel:", error);
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Error al descargar el archivo",
        position: "bottom-right",
      });
    }
  };

  return (
    <Button
      className={`text-success ${selectClasses || "h-1/5"} min-w-[130px]`}
      color="success"
      radius="md"
      variant="ghost"
      onClick={handleExcelDownload}
    >
      <FaFileExcel style={{ marginRight: "8px" }} />
      {t("excel")}
    </Button>
  );
}

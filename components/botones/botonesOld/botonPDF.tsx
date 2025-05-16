import { Button } from "@heroui/react";
import { FaFilePdf } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

import logoDataURL from "../../../public/cremonabase64"; // Importa la data URL de la imagen

interface BotonPDFProps {
  selectClasses?: string;
  equipo?: string;
  cicloId?: number | null;
}

export default function BotonPDF({
  selectClasses,
  equipo,
  cicloId,
}: BotonPDFProps) {
  const { t } = useTranslation("botones");

  const handlePdfDownload = async () => {
    if (!equipo || !cicloId) {
      toast.error("Error", {
        description: "Seleccione un equipo y un ciclo para descargar",
        position: "bottom-right",
      });

      return;
    }

    try {
      // Específicamente buscamos el contenedor del gráfico histórico
      const graphContainer = document.querySelector(".grafico-historico");

      if (!graphContainer) {
        throw new Error("No se encontró el gráfico histórico");
      }

      const canvas = await html2canvas(graphContainer, {
        scale: 3,
        backgroundColor: "#000000",
        logging: false,
        useCORS: true,
        allowTaint: true,
        ignoreElements: (element) => {
          return element.classList.contains("pdf-ignore");
        },
      });

      const imgData = canvas.toDataURL("image/png");

      // Configurar dimensiones para orientación horizontal
      const imgWidth = 287; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = imgHeight + 30; // A4 landscape height in mm

      // Crear PDF en orientación horizontal
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [pageHeight, 297],
      });

      // Agregar la imagen del gráfico
      pdf.addImage(imgData, "PNG", 5, 25, imgWidth, imgHeight);

      // Agregar fondo negro para metadata
      const metadataHeight = 20; // altura del área de metadata

      pdf.setFillColor(19, 19, 19);
      pdf.rect(0, 0, 297, metadataHeight, "F"); // rectangle negro en la parte superior

      // Configurar fuente para texto en negrita
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);

      // Agregar labels en negrita
      pdf.text("Equipo:", 5, 11);
      pdf.text("Ciclo:", 5, 16);
      pdf.text("Fecha de exportación:", 5, 6);

      // Configurar fuente para texto normal
      pdf.setFont("helvetica", "normal");

      // Agregar valores en texto normal
      const currentDate = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Calcular posición X para los valores (después de los labels)
      pdf.text(equipo, 20, 11);
      pdf.text(cicloId.toString(), 16, 16);
      pdf.text(currentDate, 44, 6);

      const logoWidth = 40;
      const logoHeight = 10;

      pdf.addImage(logoDataURL, "PNG", 252, 5, logoWidth, logoHeight);
      pdf.link(252, 4, 40, 12, {
        url: "https://creminox.com",
        target: "_blank",
      });

      // Descargar el PDF
      pdf.save(`${equipo}_Ciclo-${cicloId}.pdf`);

      toast.success("Éxito", {
        description: "PDF descargado correctamente",
        position: "bottom-right",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Error al generar el PDF",
        position: "bottom-right",
      });
    }
  };

  return (
    <Button
      className={`text-danger ${selectClasses || "h-1/5"} min-w-[130px]`}
      color="danger"
      radius="md"
      variant="ghost"
      onClick={handlePdfDownload}
    >
      <FaFilePdf style={{ marginRight: "8px" }} />
      {t("pdf")}
    </Button>
  );
}

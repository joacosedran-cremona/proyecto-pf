import { Button } from "@heroui/react";
import { FaFilePdf } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import logoDataURL from '../../../public/cremonabase64';

interface BotonPDFProps {
    selectClasses?: string;
    lineaId?: number;
    equipoId?: number;
}

export default function BotonPDF({ selectClasses, lineaId, equipoId }: BotonPDFProps) {
    const { t } = useTranslation('botones');

    const getLineaName = (id: number | undefined) => {
        switch(id) {
            case 15: return "Línea 1";
            case 16: return "Línea 2";
            default: return "Todas las líneas";
        }
    };

    const getEquipoName = (id: number | undefined) => {
        if (!id || id === 30) return "Todos los equipos";
        return id <= 6 ? `Cocina ${id}` : `Enfriador ${id-6}`;
    };

    const handlePdfDownload = async () => {
        try {
            const productivityContainer = document.querySelector('.productividad-container');
            
            if (!productivityContainer) {
                throw new Error('No se encontró el contenedor de productividad');
            }
    
            const canvas = await html2canvas(productivityContainer, {
                scale: 3,
                logging: false,
                useCORS: true,
                allowTaint: true,
                ignoreElements: (element) => {
                    return element.classList.contains('pdf-ignore') || 
                           element.classList.contains('recharts-tooltip-wrapper') ||
                           element.classList.contains('ciclos-image') ||
                           element.classList.contains('product-tooltip');
                }
            });
            
            const imgData = canvas.toDataURL('image/png');
    
            // Configurar dimensiones para orientación horizontal
            const imgWidth = 359;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const pageHeight = imgHeight + 35;
    
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [pageHeight, 297]
            });
    
            // Metadatos
            const metadataHeight = 25; // Increased height for additional info
            pdf.setFillColor(19, 19, 19);
            pdf.rect(0, 0, 297, metadataHeight, 'F');

            // Configurar texto en negrita
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(10);
            pdf.setTextColor(255, 255, 255);

            // Labels
            pdf.text('Fecha de exportación:', 5, 8);
            pdf.text('Línea:', 5, 13);
            pdf.text('Equipo:', 5, 18);

            // Texto normal
            pdf.setFont('helvetica', 'normal');

            // Valores
            const currentDate = new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            pdf.text(currentDate, 44, 8);
            pdf.text(getLineaName(lineaId), 17, 13);
            pdf.text(getEquipoName(equipoId), 20, 18);

            // Logo
            const logoWidth = 40;
            const logoHeight = 10;
            pdf.addImage(logoDataURL, 'PNG', 252, 5, logoWidth, logoHeight);
            pdf.link(252, 4, 40, 12, {url: "https://creminox.com", target: '_blank'});

            // Adjust image position due to increased metadata height
            pdf.addImage(imgData, 'PNG', 5, 30, imgWidth, imgHeight);

            // Descargar PDF
            pdf.save(`Productividad_${currentDate}.pdf`);
    
            toast.success('Éxito', {
                description: 'PDF descargado correctamente',
                position: 'bottom-right'
            });
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            toast.error('Error', {
                description: error instanceof Error ? error.message : 'Error al generar el PDF',
                position: 'bottom-right'
            });
        }
    };

    return (
        <Button
            radius="md"
            color="danger"
            variant="ghost"
            className={`text-danger ${selectClasses || "h-1/5"} min-w-[130px]`}
            onClick={handlePdfDownload}
        >
            <FaFilePdf style={{ marginRight: "8px" }} />
            {t('pdf')}
        </Button>
    );
}
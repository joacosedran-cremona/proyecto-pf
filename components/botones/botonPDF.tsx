import { Button } from "@heroui/react";
import { FaFilePdf } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface BotonPDFProps {
    selectClasses?: string;
    equipo?: string;
    cicloId?: number | null;
}

export default function BotonPDF({ selectClasses, equipo, cicloId }: BotonPDFProps) {
    const { t } = useTranslation('botones');

    const handlePdfDownload = async () => {
        if (!equipo || !cicloId) {
            toast.error('Error', {
                description: 'Seleccione un equipo y un ciclo para descargar',
                position: 'bottom-right'
            });
            return;
        }
    
        try {
            const graphContainer = document.querySelector('.grafico-historico');
            
            if (!graphContainer) {
                throw new Error('No se encontró el gráfico histórico');
            }
    
            // Mejorar la calidad y precisión de la captura
            const canvas = await html2canvas(graphContainer, {
                scale: 3, // Aumentar la escala para mejor calidad
                backgroundColor: '#000000',
                logging: false,
                useCORS: true,
                allowTaint: true,
                foreignObjectRendering: true, // Mejor renderizado de elementos HTML
                removeContainer: false, // Mantener el contenedor original
                letterRendering: true, // Mejor renderizado de texto
            });
            
            const imgData = canvas.toDataURL('image/png', 1.0); // Máxima calidad
    
            // Calcular dimensiones manteniendo la proporción original
            const originalRatio = canvas.width / canvas.height;
            const pdfWidth = 297; // A4 landscape width in mm
            const pdfHeight = 210; // A4 landscape height in mm
            
            // Calcular dimensiones de la imagen manteniendo márgenes
            const margins = 10; // márgen en mm
            const availableWidth = pdfWidth - (margins * 2);
            const availableHeight = pdfHeight - (margins * 2);
            
            let imgWidth = availableWidth;
            let imgHeight = imgWidth / originalRatio;
            
            // Ajustar si la altura excede el espacio disponible
            if (imgHeight > availableHeight) {
                imgHeight = availableHeight;
                imgWidth = imgHeight * originalRatio;
            }
    
            // Centrar la imagen en la página
            const xOffset = (pdfWidth - imgWidth) / 2;
            const yOffset = (pdfHeight - imgHeight) / 2;
    
            // Crear PDF
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
                compress: true
            });
    
            // Agregar la imagen centrada
            pdf.addImage(
                imgData, 
                'PNG', 
                xOffset, 
                yOffset, 
                imgWidth, 
                imgHeight
            );
    
            // Descargar el PDF
            pdf.save(`historico_${equipo}_ciclo_${cicloId}.pdf`);
    
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
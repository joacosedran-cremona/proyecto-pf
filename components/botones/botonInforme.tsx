import { Button } from "@heroui/react";
import { FaFilePdf } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import logoDataURL from '../../public/cremonabase64';
import * as XLSX from 'xlsx';

interface BotonInformeProps {
    selectClasses?: string;
    equipo?: string;
    cicloId?: number | null;
}

export default function BotonInforme({ selectClasses, equipo, cicloId }: BotonInformeProps) {
    const { t } = useTranslation('botones');

    const handleInformeDownload = async () => {
        if (!equipo || !cicloId) {
            toast.error('Error', {
                description: 'Seleccione un equipo y un ciclo para descargar',
                position: 'bottom-right'
            });
            return;
        }
    
        try {
            // 1. Capturar la imagen del gráfico
            const graphContainer = document.querySelector('.grafico-historico');
            
            if (!graphContainer) {
                throw new Error('No se encontró el gráfico histórico');
            }
    
            const canvas = await html2canvas(graphContainer, {
                scale: 3,
                backgroundColor: '#000000',
                logging: false,
                useCORS: true,
                allowTaint: true,
                ignoreElements: (element) => {
                    return element.classList.contains('pdf-ignore');
                }
            });
            
            const imgData = canvas.toDataURL('image/png');
    
            // 2. Obtener los datos de Excel
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

            const excelBlob = await response.blob();
            const excelArrayBuffer = await excelBlob.arrayBuffer();

            // 3. Procesar Excel para insertarlo en el PDF
            const workbook = XLSX.read(excelArrayBuffer, { type: 'array' });
            
            // Configurar dimensiones para PDF en orientación horizontal
            const imgWidth = 287; // A4 landscape width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const metadataHeight = 20; // altura del área de metadata
            
            // Crear PDF en orientación horizontal
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });
            
            // PÁGINA 1: Gráfico
            // Agregar la imagen del gráfico
            pdf.addImage(imgData, 'PNG', 5, 25, imgWidth, imgHeight);
            
            // Agregar fondo negro para metadata
            pdf.setFillColor(19, 19, 19);
            pdf.rect(0, 0, 297, metadataHeight, 'F'); // rectangle negro en la parte superior

            // Configurar fuente para texto en negrita
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(10);
            pdf.setTextColor(255, 255, 255);

            // Agregar labels en negrita
            pdf.text('Equipo:', 5, 11);
            pdf.text('Ciclo:', 5, 16);
            pdf.text('Fecha de exportación:', 5, 6);

            // Configurar fuente para texto normal
            pdf.setFont('helvetica', 'normal');

            // Agregar valores en texto normal
            const currentDate = new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Calcular posición X para los valores (después de los labels)
            pdf.text(equipo, 20, 11);
            pdf.text(cicloId.toString(), 16, 16);
            pdf.text(currentDate, 44, 6);

            const logoWidth = 40;
            const logoHeight = 10;
            pdf.addImage(logoDataURL, 'PNG', 252, 5, logoWidth, logoHeight);
            pdf.link(252, 4, 40, 12, {url: "https://creminox.com", target: '_blank'});
            
            // PÁGINAS ADICIONALES: Datos del Excel
            // Iterar sobre cada hoja del Excel
            for (let i = 0; i < workbook.SheetNames.length; i++) {
                const sheetName = workbook.SheetNames[i];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                if (jsonData.length > 0) {
                    // Agregar una nueva página para cada hoja del Excel
                    pdf.addPage();
                    
                    // Agregar encabezado similar al de la primera página
                    pdf.setFillColor(19, 19, 19);
                    pdf.rect(0, 0, 297, metadataHeight, 'F');
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(255, 255, 255);
                    pdf.text(`Datos: ${sheetName}`, 5, 11);
                    pdf.text('Equipo:', 100, 11);
                    pdf.text('Ciclo:', 100, 16);
                    pdf.setFont('helvetica', 'normal');
                    pdf.text(equipo, 115, 11);
                    pdf.text(cicloId.toString(), 111, 16);
                    pdf.addImage(logoDataURL, 'PNG', 252, 5, logoWidth, logoHeight);
                    
                    // Configurar tabla
                    const startY = 30;
                    const cellWidth = 25;
                    const cellHeight = 8;
                    const margin = 10;
                    const maxCols = Math.floor((297 - 2 * margin) / cellWidth);
                    
                    // Calcular cuántas columnas podemos mostrar
                    const numCols = Math.min(maxCols, jsonData[0]?.length || 0);
                    
                    // Dibujar encabezados
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(0, 0, 0);
                    pdf.setFillColor(220, 220, 220);
                    
                    for (let col = 0; col < numCols; col++) {
                        const x = margin + col * cellWidth;
                        pdf.rect(x, startY, cellWidth, cellHeight, 'F');
                        pdf.text(
                            String(jsonData[0][col] || ''),
                            x + 2,
                            startY + cellHeight / 2 + 1,
                            { maxWidth: cellWidth - 4 }
                        );
                    }
                    
                    // Dibujar datos
                    pdf.setFont('helvetica', 'normal');
                    let currentY = startY + cellHeight;
                    
                    for (let row = 1; row < jsonData.length; row++) {
                        // Añadir nueva página si es necesario
                        if (currentY > 200) {
                            pdf.addPage();
                            currentY = startY;
                            
                            // Repetir encabezados en la nueva página
                            pdf.setFont('helvetica', 'bold');
                            pdf.setFillColor(220, 220, 220);
                            for (let col = 0; col < numCols; col++) {
                                const x = margin + col * cellWidth;
                                pdf.rect(x, currentY, cellWidth, cellHeight, 'F');
                                pdf.text(
                                    String(jsonData[0][col] || ''),
                                    x + 2,
                                    currentY + cellHeight / 2 + 1,
                                    { maxWidth: cellWidth - 4 }
                                );
                            }
                            currentY += cellHeight;
                            pdf.setFont('helvetica', 'normal');
                        }
                        
                        // Dibujar celdas
                        for (let col = 0; col < numCols; col++) {
                            const x = margin + col * cellWidth;
                            pdf.rect(x, currentY, cellWidth, cellHeight);
                            pdf.text(
                                String(jsonData[row][col] || ''),
                                x + 2,
                                currentY + cellHeight / 2 + 1,
                                { maxWidth: cellWidth - 4 }
                            );
                        }
                        currentY += cellHeight;
                    }
                }
            }

            // Descargar el PDF
            pdf.save(`Informe_${equipo}_Ciclo-${cicloId}.pdf`);
    
            toast.success('Éxito', {
                description: 'Informe PDF descargado correctamente',
                position: 'bottom-right'
            });
        } catch (error) {
            console.error('Error al generar el informe:', error);
            toast.error('Error', {
                description: error instanceof Error ? error.message : 'Error al generar el informe',
                position: 'bottom-right'
            });
        }
    };

    return (
        <Button
            radius="md"
            color="primary"
            variant="ghost"
            className={`text-primary ${selectClasses || "h-1/5"} min-w-[160px]`}
            onClick={handleInformeDownload}
        >
            <FaFilePdf style={{ marginRight: "8px" }} />
            {t('informe') || "Informe Completo"}
        </Button>
    );
}
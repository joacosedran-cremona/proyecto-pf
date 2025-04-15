'use client';
import { Button } from "@nextui-org/react";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logoDataURL from './cremonabase64'; // Importa la data URL de la imagen
import telIcon from './telbase64'; // Importa la data URL de la imagen
import webIcon from './webbase64'; // Importa la data URL de la imagen
import mailIcon from './mailbase64'; // Importa la data URL de la imagen

export default function BotonesDescarga({ startDate, endDate }) {
    const storedUser = localStorage.getItem('user_data');
    const token = storedUser ? JSON.parse(storedUser).access_token : null;
    
    const handlePdfDownload = async () => {
        const graphSection = document.getElementById('GraficosSection');
    
        if (graphSection) {
            const canvasProduct = await html2canvas(graphSection, {
                scale: 3,
                ignoreElements: (element) => element.classList && element.classList.contains('FiltroPeriodoGraficos'),
            });
            
            const imgDataProduct = canvasProduct.toDataURL('image/png');
    
            const imgProps = {
                width: canvasProduct.width,
                height: canvasProduct.height
            };
            const pdfWidth = 287;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
            // Calculate the height of the PDF dynamically based on the image height plus the margin
            const pdfHeightWithMargin = pdfHeight + 10; // 50px margin + 5px top margin
    
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [pdfHeightWithMargin, 297] // Use calculated height
            });
    
            // Add the image to the PDF
            pdf.addImage(imgDataProduct, 'PNG', 5, 5, pdfWidth, pdfHeight, undefined, 'FAST');
    
            const logoWidth = 40;
            const logoHeight = 10;
            pdf.addImage(logoDataURL, 'PNG', 245, 15, logoWidth, logoHeight);
            
            // Añadir texto "EFA - Proyecto" debajo del logo
            pdf.setFontSize(12);
            pdf.text("EFA - MXEF-04", 253, 32);
            pdf.text("Celda de desmoldeo", 247, 37);
    
            pdf.addImage(webIcon, 'PNG', 240, 60, 5, 5); // Icono de ubicación de 5x5 px
            pdf.text("creminox.com", 247, 64); // Texto al lado del icono
            
            pdf.link(240, 60, 30, 5, { url: "https://creminox.com", target: "_blank" });            
    
            pdf.addImage(telIcon, 'PNG', 240, 66, 5, 5); // Icono de teléfono de 10x10 px
            pdf.text("+54 11 4918-3944", 247, 70); // Texto al lado del icono
    
            pdf.addImage(mailIcon, 'PNG', 240, 72, 5, 5); // Icono de teléfono de 10x10 px
            pdf.text("soporte@creminox.com", 247, 76); // Texto al lado del icono
    
            pdf.save('graficos.pdf');
        }
    };       
    
    const handleExcelDownload = async () => {
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/graficos-historico/descargar-excel?fecha_inicio=${startDate}&fecha_fin=${endDate}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
                }
            );

            if (!response.ok) {
                throw new Error(`Error en la descarga: ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `productividad_${startDate}_to_${endDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", width: "100%" }}>
            <Button
                style={{
                    backgroundColor: "rgba(243, 18, 96, 0.3)",
                    border: "1px solid #F31260",
                    color: "#F31260",
                    width: "100%",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "17px",
                }}
                onClick={handlePdfDownload}
            >
                <FaFilePdf style={{ marginRight: "8px" }} />
                Descargar PDF
            </Button>

            <Button
                style={{
                    backgroundColor: "rgba(17, 171, 90, 0.3)",
                    border: "1px solid #11AB5A",
                    color: "#11AB5A",
                    width: "100%",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "17px",
                }}
                onClick={handleExcelDownload}
            >
                <FaFileExcel style={{ marginRight: "8px" }} />
                Descargar EXCEL
            </Button>
        </div>
    );
}

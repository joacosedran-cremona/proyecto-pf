//React
import React, { useMemo, useState, useEffect } from "react";

//MUI
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, MRT_Row } from "material-react-table";
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import { Box, Button, Typography } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import logoDataURL from '../public/cremonabase64'; 

//PDF conversor
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

//Idioma
import { useTranslation } from "react-i18next";

import { toast } from "sonner";

export type Alerta = {
  key: string;
  description: string;
  type: string;
  time: string;
};

const Tabla: React.FC = () => {
  const { t } = useTranslation("tabla");
  const [data, setData] = useState<Alerta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const host = process.env.NEXT_PUBLIC_WS_HOST || 'localhost';
        const port = process.env.NEXT_PUBLIC_WS_PORT || '8001';

        const response = await fetch(`http://${host}:${port}/alarmas`);
        if (!response.ok) throw new Error("Error en la solicitud");

        const apiData = await response.json();
        const convertedData = apiData.map((alarma: any) => ({
          key: alarma.id_alarma.toString(),
          description: alarma.descripcion,
          type: alarma.tipo,
          time: alarma.fecha_registro,
        }));

        setData(convertedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Alerta>[]>(
    () => [
      {
        accessorKey: "description",
        header: t('descripcion'),
        size: 300,
      },
      {
        accessorKey: "type",
        header: t('tipo'),
        size: 150,
      },
      {
        accessorKey: "time",
        header: t('hora'),
        size: 200,
        Cell: ({ cell }) => {
          const rawDate = new Date(cell.getValue<string>());
          const formattedDate = rawDate.toISOString().slice(0, 16).replace("T", " ");
          return formattedDate;
        }
      }
    ],
    [t]
  );

  const handleExportRows = (rows: MRT_Row<Alerta>[]) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'A4',
      });
    
      const pageWidth = doc.internal.pageSize.getWidth();
      const tableData = rows.map(row =>
        columns.map(col => {
          const value = row.original[col.accessorKey as keyof Alerta];
          if (col.accessorKey === 'time' && typeof value === 'string') {
            const date = new Date(value);
            return date.toISOString().slice(0, 16).replace("T", " ");
          }
          return value;
        })
      );
      const tableHeaders = columns.map((c) => c.header as string);
      const exportDate = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    
      // CABECERA personalizada
      const headerHeight = 70;
      const totalTexto = `Total de registros: ${rows.length}`;
      doc.setFillColor(19, 19, 19); // Fondo oscuro
      doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
    
      doc.text('Fecha de exportación:', 20, 25);
      doc.text('Contacto: soporte@creminox.com', 20, 40);
      doc.text(totalTexto, 20, 55);
    
      doc.setFont('helvetica', 'normal');
      doc.text(exportDate, 130, 25);
    
      const logoWidth = 120;
      const logoHeight = 25;
      const logoX = pageWidth - logoWidth - 40;
      const logoY = (headerHeight - logoHeight) / 2;

      doc.addImage(logoDataURL, 'PNG', logoX, logoY, logoWidth, logoHeight);
      doc.link(logoX, logoY, logoWidth, logoHeight, {
        url: "https://creminox.com",
        target: "_blank"
      });

      // TABLA
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        theme: 'grid',
        margin: { top: headerHeight + 10 },
        styles: {
          fillColor: [41, 41, 41],
          textColor: [255, 255, 255],
          fontSize: 9,
        },
        headStyles: {
          fillColor: [25, 25, 25],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [30, 30, 30],
        },
        tableLineColor: [100, 100, 100],
        tableLineWidth: 0.1,
      });
    
      doc.save("Registro_Eventos.pdf");
      
      // Mostrar toast de éxito
      toast.success('Éxito', {
        description: 'PDF descargado correctamente',
        position: 'bottom-right'
      });
    } catch (error) {
      // Mostrar toast de error si algo falla
      console.error('Error al generar el PDF:', error);
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Error al generar el PDF',
        position: 'bottom-right'
      });
    }
  };
  
  const customTheme = createTheme({
    components: {
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: '#131313',
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          selectLabel: { color: '#ffffff' },
          selectRoot: { color: '#ffffff' },
          selectIcon: { color: '#ffffff' },
          displayedRows: { color: '#ffffff' },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: '#d9d9d9',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              }
            },
          },
        },
      },
    },
  });

  const table = useMaterialReactTable({
    columns,
    data,
    state: { isLoading },
    enableSorting: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    layoutMode: "grid",
    initialState: {
      density: 'spacious'
    },

    //Head
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#131313",
        color: "#d9d9d9",
        fontWeight: "bold",
        '& .MuiDivider-root': {
          backgroundColor: '#FFF5 !important',
          height: '20px',
          '&:hover': {
            backgroundColor: 'rgb(129, 129, 129) !important',
          },
        },
      },
    },

    muiTableHeadRowProps: {
      sx: {
        backgroundColor: "#131313",
      },
    },

    muiTopToolbarProps: {
      sx: {
        backgroundColor: "#131313",
        position: 'relative',
        '& .MuiInputBase-root': {
          color: '#d9d9d9',
        },
        '& .MuiInputBase-input': {
          color: '#d9d9d9',
        },
        '& .MuiSvgIcon-root': {
          color: '#d9d9d9',
        },
      },
    },


    //Body
    muiTableBodyCellProps: {
      sx: {
        backgroundColor: "#131313",
        color: "#d9d9d9",
      },
    },

    muiTableBodyRowProps: {
      sx: {
        backgroundColor: "#131313",
        "&:nth-of-type(odd)": {
          backgroundColor: "#131313",
        }
      },
    },


    //Footer
    muiTableFooterProps: {
      sx : {
        '& .MuiInputLabel-root': {
          color: '#d9d9d9',
        },
        '& .MuiFormLabel-root': {
          color: '#d9d9d9',
        }
      }
    },

    muiBottomToolbarProps: {
      sx: {
        backgroundColor: "#131313",
        color: "#d9d9d9",
        '& .MuiTablePagination-root': {
          color: '#d9d9d9',
        },
        '& .MuiSelect-icon': {
          color: '#d9d9d9',
        },
        '& .MuiInputBase-input': {
          color: '#d9d9d9',
        },
        '& .MuiSvgIcon-root': {
          color: '#d9d9d9',
        },
        '& .MuiInputLabel-root': {
          color: '#d9d9d9 !important',
        },
        '& .MuiFormLabel-root': {
          color: '#d9d9d9 !important',
        }
      },
    },


    //Pagination
    muiTableProps: {
      sx: {
        '& .MuiInputLabel-root': {
          color: '#d9d9d9 !important',
        },
        '& .MuiSelect-select, & .MuiSelect-icon': {
          color: '#d9d9d9',
        }
      },
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
      },
    },

    muiTableContainerProps: {
      sx: {
        backgroundColor: "#131313",
      },
    },

    muiSkeletonProps: {
      sx: {
        backgroundColor: "#131313",
      },
    },
    muiColumnActionsButtonProps: {
      sx: {
        color: '#d9d9d9',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },

    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        width: '100%',
        alignItems: 'center',
        position: 'relative',
        gap: 1,
      }}>
        {/* Sección izquierda - Botones */}
        <Box sx={{
          display: 'flex',
          gap: 1,
          gridColumn: 1,
          justifyContent: 'flex-start'
        }}>
          <Button
            onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
            color="primary"
          >
            {t('exptodas')}
          </Button>
          <Button
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="outlined"
            color="primary"
          >
            {t('expvisibles')}
          </Button>
        </Box>

        {/* Sección central - Título */}
        <Box sx={{
          gridColumn: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
          marginLeft: 25,
        }}>
          <Typography variant="h4" sx={{
            color: '#d9d9d9',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '-5px'
          }}>
            {t('historial')}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#d9d9d9' }}>
            {t('alertas')}
          </Typography>
        </Box>

        {/* Sección derecha - Espacio reservado para componentes de la tabla */}
        <Box sx={{
          gridColumn: 3,
          visibility: 'hidden' // Mantiene el espacio reservado
        }} />
      </Box>
    ),
  });

  return (
    <ThemeProvider theme={customTheme}>
      <MaterialReactTable table={table} />
    </ThemeProvider>
  );
};

export default Tabla;

//React
import React, { useMemo, useState, useEffect } from "react";

//MUI
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, MRT_Row } from "material-react-table";
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import { Box, Button, Typography } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

//PDF conversor
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

//Idioma
import { useTranslation } from "react-i18next";

import {
  MRT_ToggleGlobalFilterButton,
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
} from 'material-react-table';


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
        const port = process.env.NEXT_PUBLIC_WS_PORT || '8000';

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
      },
    ],
    [t]
  );

  const handleExportRows = (rows: MRT_Row<Alerta>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header as string);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: { fillColor: [41, 41, 41] },
      headStyles: { fillColor: [25, 25, 25] },
    });

    doc.save("tabla_alertas.pdf");
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
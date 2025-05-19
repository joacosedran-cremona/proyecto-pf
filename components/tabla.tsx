//React
import React, { useMemo, useState, useEffect } from "react";
//MUI
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_Row,
} from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material";
import {
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff"; // Importamos ícono para limpiar filtros
import * as XLSX from "xlsx"; // Importamos la librería para Excel
//PDF conversor
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
//Idioma
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
// Importaciones adicionales necesarias
import { ColumnFiltersState } from "@tanstack/react-table";

import logoDataURL from "../public/cremonabase64";

// Definimos la interfaz Alerta (descomentada)
export interface Alerta {
  key: string;
  description: string;
  type: string;
  state: string;
  time: string;
}

interface AlarmaData {
  id_alarma: number;
  descripcion: string;
  tipoAlarma: string;
  estadoAlarma: boolean;
  fechaRegistro: string;
}

// Función auxiliar para resaltar el texto que coincide con el filtro
const highlightText = (text: string, filter: string): JSX.Element => {
  if (!filter || filter === "") return <>{text}</>;

  try {
    const regex = new RegExp(
      `(${filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) => {
          const match = part.toLowerCase() === filter.toLowerCase();

          return match ? (
            <span
              key={i}
              style={{
                backgroundColor: "rgba(255, 204, 0, 0.4)",
                color: "#ffffff",
                fontWeight: "bold",
              }}
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          );
        })}
      </>
    );
  } catch {
    // Fallback en caso de error con la expresión regular
    return <>{text}</>;
  }
};

const Tabla: React.FC = () => {
  const { t } = useTranslation("tabla");
  const [data, setData] = useState<Alerta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Nuevo estado para el rango de fechas
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Estado para los datos filtrados por fecha
  const [dateFilteredData, setDateFilteredData] = useState<Alerta[]>([]);

  // Estado para el menú de exportación
  const [exportMenuAnchorEl, setExportMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const exportMenuOpen = Boolean(exportMenuAnchorEl);

  // Implementamos el componente InlineDateRangePicker con elementos nativos
  const InlineDateRangePicker = () => {
    return (
      <Stack alignItems="center" direction="row" spacing={2}>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label={t("fechaInicio")}
          size="small"
          sx={{
            "& .MuiInputBase-root": { color: "#d9d9d9" },
            "& .MuiInputLabel-root": { color: "#d9d9d9" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#515151",
            },
            "& .MuiSvgIcon-root": { color: "#d9d9d9" },
            minWidth: "150px",
          }}
          type="date"
          value={
            dateRange.from
              ? new Date(dateRange.from).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) => {
            const newDate = e.target.value
              ? new Date(e.target.value)
              : undefined;

            setDateRange({
              ...dateRange,
              from: newDate,
            });
          }}
        />
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label={t("fechaFin")}
          size="small"
          sx={{
            "& .MuiInputBase-root": { color: "#d9d9d9" },
            "& .MuiInputLabel-root": { color: "#d9d9d9" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#515151",
            },
            "& .MuiSvgIcon-root": { color: "#d9d9d9" },
            minWidth: "150px",
          }}
          type="date"
          value={
            dateRange.to
              ? new Date(dateRange.to).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) => {
            const newDate = e.target.value
              ? new Date(e.target.value)
              : undefined;

            setDateRange({
              ...dateRange,
              to: newDate,
            });
          }}
        />
      </Stack>
    );
  };

  const handleExportMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setExportMenuAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchorEl(null);
  };

  // Configuración del WebSocket
  const wsUrl = `ws://${process.env.NEXT_PUBLIC_WS_HOST || "localhost"}:${process.env.NEXT_PUBLIC_WS_PORT || "8001"}/ws/datos`;

  const connectWebSocket = () => {
    setIsLoading(true);
    setError(null);

    try {
      const socket = new WebSocket(wsUrl);

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Extraer solo el array de alarmas (último elemento del array principal)
          const alarmas: AlarmaData[] =
            Array.isArray(data) && data.length >= 4 ? data[3] : [];

          if (Array.isArray(alarmas) && alarmas.length > 0) {
            setData((prevData) => {
              const updatedData = [...prevData];

              alarmas.forEach((alarma) => {
                // Verificamos que la descripción no esté vacía
                if (alarma.descripcion && alarma.descripcion.trim() !== "") {
                  const index = updatedData.findIndex(
                    (item) => item.key === alarma.id_alarma.toString(),
                  );

                  const newItem: Alerta = {
                    key: alarma.id_alarma.toString(),
                    description: alarma.descripcion,
                    type: alarma.tipoAlarma,
                    state: alarma.estadoAlarma ? "Activo" : "Inactivo",
                    time: alarma.fechaRegistro,
                  };

                  if (index !== -1) {
                    updatedData[index] = newItem;
                  } else {
                    updatedData.push(newItem);
                  }
                }
              });

              // Filtrar items con descripción vacía
              return updatedData.filter(
                (item) => item.description && item.description.trim() !== "",
              );
            });
            setIsLoading(false);
          }
        } catch {
          setError(t("noSePudieronObtenerDatos"));
          setIsLoading(false);
        }
      };

      socket.onerror = () => {
        setError(t("noSePudieronObtenerDatos"));
        setIsLoading(false);
      };

      return () => {
        socket.close();
      };
    } catch {
      setError(t("error"));
      setIsLoading(false);

      return () => {};
    }
  };

  // Intento inicial con WebSocket
  useEffect(() => {
    const cleanup = connectWebSocket();

    return cleanup;
  }, [wsUrl]);

  // Fallback a la API fetch si el WebSocket falla
  useEffect(() => {
    if (error) {
      const loadDataFromAPI = async () => {
        setIsLoading(true);
        try {
          const host = process.env.NEXT_PUBLIC_WS_HOST || "localhost";
          const port = process.env.NEXT_PUBLIC_WS_PORT || "8001";

          const response = await fetch(`http://${host}:${port}/alarmas`);

          if (!response.ok) throw new Error("Error en la solicitud");

          const apiData = await response.json();
          const convertedData = apiData.map((alarma: any) => ({
            key: alarma.id_alarma.toString(),
            description: alarma.descripcion,
            type: alarma.tipo,
            state: alarma.estadoAlarma ? "Activo" : "Inactivo",
            time: alarma.fecha_registro,
          }));

          setData(convertedData);
          setError(null);
        } catch {
          setError(t("noSePudieronObtenerDatos"));
        } finally {
          setIsLoading(false);
        }
      };

      loadDataFromAPI();
    }
  }, [error, t]);

  // Función para aplicar filtro de rango de fechas
  useEffect(() => {
    if (data.length === 0) {
      setDateFilteredData(data);

      return;
    }

    // Si no hay fechas seleccionadas, mostrar todos los datos
    if (!dateRange.from && !dateRange.to) {
      setDateFilteredData(data);

      return;
    }

    try {
      const fromDate = dateRange.from ? new Date(dateRange.from) : new Date(0); // fecha mínima si no hay from
      const toDate = dateRange.to ? new Date(dateRange.to) : new Date(); // fecha actual si no hay to

      // Aseguramos que toDate sea el final del día para incluir todo el día seleccionado
      if (dateRange.to) {
        toDate.setHours(23, 59, 59, 999);
      }

      const filtered = data.filter((item) => {
        try {
          const itemDate = new Date(item.time);

          return itemDate >= fromDate && itemDate <= toDate;
        } catch {
          return false;
        }
      });

      setDateFilteredData(filtered);
    } catch {
      // En caso de error, mostrar todos los datos
      setDateFilteredData(data);
    }
  }, [data, dateRange.from, dateRange.to]);

  // Función para limpiar todos los filtros
  const handleClearFilters = () => {
    // Limpiar filtros de columna
    setColumnFilters([]);

    // Limpiar filtro de fechas
    setDateRange({
      from: undefined,
      to: undefined,
    });

    setDateFilteredData(data);

    toast.success(t("filtrosLimpiados"), {
      position: "bottom-right",
    });
  };

  // Extraer valores de filtro para hacer accesibles en las celdas
  const getFilterValue = (columnId: string): string => {
    const filter = columnFilters.find((f) => f.id === columnId);

    return filter?.value ? String(filter.value).toLowerCase() : "";
  };

  const columns = useMemo<MRT_ColumnDef<Alerta>[]>(
    () => [
      {
        accessorKey: "description",
        header: t("descripcion"),
        size: 400,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>() || "";
          const filterValue = getFilterValue("description");

          return highlightText(value, filterValue);
        },
      },
      {
        accessorKey: "type",
        header: t("tipo"),
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>() || "";
          const filterValue = getFilterValue("type");

          return highlightText(value, filterValue);
        },
      },
      {
        accessorKey: "state",
        header: t("estado"),
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>() || "";
          const filterValue = getFilterValue("state");

          return highlightText(value, filterValue);
        },
      },
      {
        accessorKey: "time",
        header: t("fechaRegistro"),
        size: 200,
        filterVariant: "text",
        accessorFn: (row) => {
          try {
            const date = new Date(row.time);

            return date.toISOString().slice(0, 16).replace("T", " ");
          } catch {
            return row.time || "";
          }
        },
        Cell: ({ cell }) => {
          try {
            const rawDate = new Date(cell.row.original.time);
            const formattedDate = rawDate
              .toISOString()
              .slice(0, 16)
              .replace("T", " ");
            const filterValue = getFilterValue("time");

            return highlightText(formattedDate, filterValue);
          } catch {
            const value = cell.getValue<string>() || "";
            const filterValue = getFilterValue("time");

            return highlightText(value, filterValue);
          }
        },
      },
    ],
    [t, columnFilters],
  );

  const handleExportRows = (rows: MRT_Row<Alerta>[]) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "A4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const tableData = rows.map((row) =>
        columns.map((col) => {
          const value = row.original[col.accessorKey as keyof Alerta];

          if (col.accessorKey === "time" && typeof value === "string") {
            const date = new Date(value);

            return date.toISOString().slice(0, 16).replace("T", " ");
          }

          return value;
        }),
      );
      const tableHeaders = columns.map((c) => c.header as string);
      const exportDate = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // CABECERA personalizada
      const headerHeight = 70;
      const totalTexto = `Total de registros: ${rows.length}`;

      doc.setFillColor(19, 19, 19); // Fondo oscuro
      doc.rect(0, 0, pageWidth, headerHeight, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);

      doc.text("Fecha de exportación:", 20, 25);
      doc.text("Contacto: soporte@creminox.com", 20, 40);
      doc.text(totalTexto, 20, 55);

      doc.setFont("helvetica", "normal");
      doc.text(exportDate, 130, 25);

      const logoWidth = 120;
      const logoHeight = 25;
      const logoX = pageWidth - logoWidth - 40;
      const logoY = (headerHeight - logoHeight) / 2;

      doc.addImage(logoDataURL, "PNG", logoX, logoY, logoWidth, logoHeight);
      doc.link(logoX, logoY, logoWidth, logoHeight, {
        url: "https://creminox.com",
        target: "_blank",
      });

      // TABLA
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        theme: "grid",
        margin: { top: headerHeight + 10 },
        styles: {
          fillColor: [41, 41, 41],
          textColor: [255, 255, 255],
          fontSize: 9,
        },
        headStyles: {
          fillColor: [25, 25, 25],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [30, 30, 30],
        },
        tableLineColor: [100, 100, 100],
        tableLineWidth: 0.1,
      });

      doc.save("Registro_Eventos.pdf");

      // Mostrar toast de éxito
      toast.success("Éxito", {
        description: "PDF descargado correctamente",
        position: "bottom-right",
      });
    } catch (error) {
      // Mostrar toast de error si algo falla
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Error al generar el PDF",
        position: "bottom-right",
      });
    }
    handleExportMenuClose();
  };

  const handleExportExcel = (rows: MRT_Row<Alerta>[], fileName: string) => {
    try {
      // Preparar los datos para Excel
      const excelData = rows.map((row) => {
        const rowData: Record<string, any> = {};

        columns.forEach((column) => {
          const key = column.accessorKey as keyof Alerta;
          let value = row.original[key];

          // Formatear la fecha si es la columna de tiempo
          if (key === "time" && typeof value === "string") {
            const date = new Date(value);

            value = date.toISOString().slice(0, 16).replace("T", " ");
          }

          // Usar el header traducido como nombre de columna
          const headerName = column.header as string;

          rowData[headerName] = value;
        });

        return rowData;
      });

      // Crear una hoja de cálculo
      const workSheet = XLSX.utils.json_to_sheet(excelData);
      const workBook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workBook, workSheet, "Alertas");

      // Generar y descargar el archivo
      XLSX.writeFile(workBook, `${fileName}.xlsx`);

      // Mostrar toast de éxito
      toast.success("Éxito", {
        description: "Excel descargado correctamente",
        position: "bottom-right",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Error al generar el Excel",
        position: "bottom-right",
      });
    }

    // Cerrar el menú después de la exportación
    handleExportMenuClose();
  };

  const customTheme = createTheme({
    palette: {
      primary: {
        main: "#761122",
      },
      background: {
        default: "#131313 !important",
        paper: "#131313 !important",
      },
      text: {
        primary: "#d9d9d9",
        secondary: "#8c8c8c",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: "#131313 !important",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "#131313 !important",
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          selectLabel: { color: "#ffffff" },
          selectRoot: { color: "#ffffff" },
          selectIcon: { color: "#ffffff" },
          displayedRows: { color: "#ffffff" },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: "#131313 !important",
          },
        },
      },
    },
  });

  const table = useMaterialReactTable({
    columns,
    data:
      dateFilteredData.length > 0 || dateRange.from !== undefined
        ? dateFilteredData
        : data,
    state: {
      isLoading,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    enableSorting: true,
    enableColumnResizing: true,
    enableColumnFilters: true,
    columnResizeMode: "onChange",
    layoutMode: "grid",
    initialState: {
      density: "spacious",
      showColumnFilters: true,
    },
    renderEmptyRowsFallback: () => (
      <Box
        sx={{
          textAlign: "center",
          padding: "2rem",
          color: "#d9d9d9",
        }}
      >
        {error || t("noExistenDatos")}
      </Box>
    ),

    //Head
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#131313 !important",
        color: "#d9d9d9",
        fontWeight: "bold",
        borderBottom: "none", // Eliminar bordes de celdas para evitar duplicación
        "& .MuiDivider-root": {
          backgroundColor: "#FFF5 !important",
          height: "20px",
          "&:hover": {
            backgroundColor: "rgb(129, 129, 129) !important",
          },
        },
        // Estilos específicos para el icono de ordenamiento
        "& .MuiTableSortLabel-root": {
          color: "#d9d9d9",
          "& .MuiTableSortLabel-icon": {
            color: "#d9d9d9 !important", // Forzar color para el ícono
          },
        },
        // Cuando está activo
        "& .MuiTableSortLabel-root.Mui-active": {
          color: "#d9d9d9",
          "& .MuiTableSortLabel-icon": {
            color: "#d9d9d9 !important",
          },
        },
        // Para todos los íconos SVG dentro del encabezado
        "& .MuiSvgIcon-root": {
          color: "#d9d9d9",
        },
      },
    },

    muiTableHeadRowProps: {
      sx: {
        backgroundColor: "#131313 !important",
        // Agregar borde inferior a la fila de cabecera
        borderBottom: "1px solid #515151",
      },
    },

    muiTopToolbarProps: {
      sx: {
        backgroundColor: "#131313 !important",
        position: "relative",
        "& .MuiInputBase-root": {
          color: "#d9d9d9",
        },
        "& .MuiInputBase-input": {
          color: "#d9d9d9",
        },
        "& .MuiSvgIcon-root": {
          color: "#d9d9d9",
        },
      },
    },

    // Personalizamos los estilos del filtro
    muiFilterTextFieldProps: {
      sx: {
        "& .MuiInputBase-root": {
          color: "#d9d9d9",
        },
        "& .MuiInputBase-input": {
          color: "#d9d9d9",
        },
        "& .MuiInputLabel-root": {
          color: "#d9d9d9",
        },
        "& .MuiSvgIcon-root": {
          color: "#d9d9d9",
        },
      },
    },

    //Body
    muiTableBodyCellProps: {
      sx: {
        backgroundColor: "#131313 !important",
        color: "#d9d9d9",
        borderBottom: "none", // Eliminar bordes de celdas para evitar duplicación
      },
    },

    muiTableBodyRowProps: {
      sx: {
        backgroundColor: "#131313 !important",
        "&:nth-of-type(odd)": {
          backgroundColor: "#131313 !important",
        },
        // Agregar borde inferior a cada fila
        borderBottom: "1px solid #515151",
      },
    },

    //Footer
    muiTableFooterProps: {
      sx: {
        "& .MuiInputLabel-root": {
          color: "#d9d9d9",
        },
        "& .MuiFormLabel-root": {
          color: "#d9d9d9",
        },
      },
    },

    muiBottomToolbarProps: {
      sx: {
        backgroundColor: "#131313 !important",
        color: "#d9d9d9",
        "& .MuiTablePagination-root": {
          color: "#d9d9d9",
        },
        "& .MuiSelect-icon": {
          color: "#d9d9d9",
        },
        "& .MuiInputBase-input": {
          color: "#d9d9d9",
        },
        "& .MuiSvgIcon-root": {
          color: "#d9d9d9",
        },
        "& .MuiInputLabel-root": {
          color: "#d9d9d9 !important",
        },
        "& .MuiFormLabel-root": {
          color: "#d9d9d9 !important",
        },
      },
    },

    //Pagination
    muiTableProps: {
      sx: {
        "& .MuiInputLabel-root": {
          color: "#d9d9d9 !important",
        },
        "& .MuiSelect-select, & .MuiSelect-icon": {
          color: "#d9d9d9",
        },
      },
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        backgroundColor: "#131313",
        borderRadius: "8px",
      },
    },

    muiTableContainerProps: {
      sx: {
        backgroundColor: "#131313 !important",
      },
    },

    muiSkeletonProps: {
      sx: {
        backgroundColor: "#131313 !important",
        "&::after": {
          background:
            "linear-gradient(90deg, transparent, rgba(80, 80, 80, 0.1), transparent)",
        },
      },
    },
    muiColumnActionsButtonProps: {
      sx: {
        color: "#d9d9d9",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      },
    },

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          width: "100%",
          alignItems: "center",
          position: "relative",
          gap: 1,
        }}
      >
        {/* Sección izquierda - Botones */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            gridColumn: 1,
            justifyContent: "flex-start",
          }}
        >
          {/* Botón de exportación con menú */}
          <Button
            aria-controls={exportMenuOpen ? "export-menu" : undefined}
            aria-expanded={exportMenuOpen ? "true" : undefined}
            aria-haspopup="true"
            color="primary"
            id="export-button"
            startIcon={<FileDownloadIcon />}
            sx={{ backgroundColor: "#761122" }}
            variant="contained"
            onClick={handleExportMenuClick}
          >
            {t("exportar")}
          </Button>

          <Menu
            MenuListProps={{
              "aria-labelledby": "export-button",
            }}
            anchorEl={exportMenuAnchorEl}
            id="export-menu"
            open={exportMenuOpen}
            onClose={handleExportMenuClose}
          >
            {/* Opciones de menú sin cambios */}
            <MenuItem
              onClick={() =>
                handleExportRows(table.getPrePaginationRowModel().rows)
              }
            >
              {t("exptodaspdf")}
            </MenuItem>
            <MenuItem
              onClick={() => handleExportRows(table.getRowModel().rows)}
            >
              {t("expvisiblespdf")}
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleExportExcel(
                  table.getPrePaginationRowModel().rows,
                  "Todas_Alertas",
                )
              }
            >
              {t("exptodasexcel")}
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleExportExcel(table.getRowModel().rows, "Alertas_Visibles")
              }
            >
              {t("expvisiblesexcel")}
            </MenuItem>
          </Menu>

          {/* Selector de rango de fechas integrado */}
          <Box
            sx={{
              minWidth: "300px",
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <InlineDateRangePicker />
          </Box>

          {/* Botón para limpiar filtros */}
          <Button
            startIcon={<FilterAltOffIcon />}
            sx={{
              color: "#d9d9d9",
              borderColor: "#515151",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "#d9d9d9",
              },
            }}
            variant="outlined"
            onClick={handleClearFilters}
          >
            {t("limpiarFiltros")}
          </Button>
        </Box>

        {/* Sección central - Título */}
        <Box
          sx={{
            gridColumn: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
            marginLeft: 25,
          }}
        >
          <Typography
            sx={{
              color: "#d9d9d9",
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "-5px",
            }}
            variant="h4"
          >
            {t("historial")}
          </Typography>
          <Typography sx={{ color: "#d9d9d9" }} variant="subtitle1">
            {t("alertas")}
          </Typography>
        </Box>

        {/* Sección derecha - Espacio reservado para componentes de la tabla */}
        <Box
          sx={{
            gridColumn: 3,
            visibility: "hidden", // Mantiene el espacio reservado
          }}
        />
      </Box>
    ),
  });

  return (
    <ThemeProvider theme={customTheme}>
      <div className="w-full bg-[#131313] rounded-[15px] p-[20px]">
        {error && (
          <div className="mb-4">
            <Button
              color="primary"
              sx={{ backgroundColor: "#761122" }}
              variant="contained"
              onClick={connectWebSocket}
            >
              {t("reintentar")}
            </Button>
          </div>
        )}
        <MaterialReactTable table={table} />
      </div>
    </ThemeProvider>
  );
};

export default Tabla;

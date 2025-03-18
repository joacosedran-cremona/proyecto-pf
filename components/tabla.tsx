import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, MRT_Row } from "material-react-table";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import alertas from "./alertas.json";

export type Alerta = {
  key: string;
  description: string;
  type: string;
  state: string;
  time: string;
};

const Tabla: React.FC = () => {
  const [data, setData] = useState<Alerta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      const convertedData = alertas.map((alerta) => ({
        ...alerta,
        key: alerta.key.toString(),
      }));
      setData(convertedData);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Alerta>[]>(
    () => [
      {
        accessorKey: "description",
        header: "DESCRIPCIÓN",
        grow: 1
      },
      {
        accessorKey: "type",
        header: "TIPO",
        grow: 1
      },
      {
        accessorKey: "state",
        header: "ESTADO",
        grow: 1
      },
      {
        accessorKey: "time",
        header: "HORA",
        grow: 1
      },
    ],
    []
  );

  const handleExportRows = (rows: MRT_Row<Alerta>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("tabla_alertas.pdf");
  };

  const table = useMaterialReactTable({
    columns,
    data,
    state: { isLoading },
    enableSorting: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    layoutMode: "semantic",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Exportar Todas las Filas
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Exportar Filas Visibles
        </Button>
      </Box>
    ),
  });

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default Tabla;

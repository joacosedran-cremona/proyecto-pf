import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { toast } from "sonner";

interface Ciclo {
  id_ciclo: number;
  lote: string;
  fecha_inicio: string;
  fecha_fin: string;
  tiempo_transcurrido: string;
}

interface TablaCiclosProps {
  fechaInicio: string;
  fechaFin: string;
  equipo: string;
  selectedCicloId?: number | null;
  onCicloSelect?: (ciclo: Ciclo) => void;
  onTableClose?: () => void; // Añadir esta prop
}

const TablaCiclos: React.FC<TablaCiclosProps> = ({
  fechaInicio,
  fechaFin,
  equipo,
  selectedCicloId,
  onCicloSelect,
  onTableClose,
}) => {
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(true);
  // Inicializar selectedKeys con el ciclo actual si existe
  const [selectedKeys, setSelectedKeys] = useState(
    new Set(selectedCicloId ? [selectedCicloId.toString()] : []),
  );

  useEffect(() => {
    const fetchCiclos = async () => {
      setLoading(true);
      try {
        const host = process.env.NEXT_PUBLIC_WS_HOST;
        const port = process.env.NEXT_PUBLIC_WS_PORT;
        const url = `http://${host}:${port}/historico-graficos/${equipo}?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || error || !data || data.length === 0) {
          if (onTableClose) {
            onTableClose(); // Llamar a onTableClose cuando no hay datos
          }
          toast.error("Error al obtener sus ciclos", {
            description: "No existen datos en el equipo/fecha ingresada",
            position: "bottom-right",
            id: `no-data-${fechaInicio}-${fechaFin}-${equipo}`, // Unique ID based on parameters
          });
          return null;
        }

        setCiclos(data);
        setError(null);
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchCiclos();
  }, [fechaInicio, fechaFin, equipo]);

  useEffect(() => {
    if (selectedCicloId) {
      setSelectedKeys(new Set([selectedCicloId.toString()]));
    }
  }, [selectedCicloId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[150px] max-w-[600px]">
        <Spinner label="Cargando ciclos..." />
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className="max-h-[600px] overflow-y-auto overflow-x-hidden">
      <Table
        aria-label="Tabla de ciclos"
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          const selection = new Set(keys);
          setSelectedKeys(selection);

          const selectedId = Array.from(selection)[0];
          const cicloSeleccionado = ciclos.find(
            (c) => c.id_ciclo.toString() === selectedId?.toString(),
          );

          if (cicloSeleccionado && onCicloSelect) {
            console.log(
              "🎯 Ciclo seleccionado en Tabla:",
              cicloSeleccionado.id_ciclo,
            );
            onCicloSelect(cicloSeleccionado);
          }
        }}
        className="min-w-[600px] bg-black/50 backdrop-blur-sm text-white"
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Lote</TableColumn>
          <TableColumn>Inicio</TableColumn>
          <TableColumn>Fin</TableColumn>
        </TableHeader>
        <TableBody>
          {ciclos.map((ciclo) => (
            <TableRow
              key={ciclo.id_ciclo}
              className="text-sm hover:bg-gray-700/50 cursor-pointer"
            >
              <TableCell>{ciclo.id_ciclo}</TableCell>
              <TableCell>{ciclo.lote}</TableCell>
              <TableCell>
                {new Date(ciclo.fecha_inicio).toLocaleDateString("es-ES")}
              </TableCell>
              <TableCell>
                {new Date(ciclo.fecha_fin).toLocaleDateString("es-ES")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TablaCiclos;

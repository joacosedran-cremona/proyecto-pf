import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner
} from "@heroui/react";

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
  onCicloSelect?: (ciclo: Ciclo) => void;
}

const TablaCiclos: React.FC<TablaCiclosProps> = ({ fechaInicio, fechaFin, equipo, onCicloSelect }) => {
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));

  useEffect(() => {
    const fetchCiclos = async () => {
      try {
        const host = process.env.NEXT_PUBLIC_WS_HOST;
        const port = process.env.NEXT_PUBLIC_WS_PORT;
        const url = `http://${host}:${port}/historico-graficos/${equipo}?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Error al obtener los ciclos');
        }
        
        const data = await response.json();
        setCiclos(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchCiclos();
  }, [fechaInicio, fechaFin, equipo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <Spinner label="Cargando ciclos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <Table 
      aria-label="Tabla de ciclos"
      selectionMode="single"
      selectedKeys={selectedKeys}
      onSelectionChange={(keys) => {
        const selection = new Set(keys);
        setSelectedKeys(selection);
        
        // Obtener el ID seleccionado
        const selectedId = Array.from(selection)[0];
        
        // Encontrar el ciclo correspondiente
        const cicloSeleccionado = ciclos.find(c => c.id_ciclo.toString() === selectedId?.toString());
        
        if (cicloSeleccionado && onCicloSelect) {
          onCicloSelect(cicloSeleccionado);
        }
      }}
      className="w-[600px] bg-black/50 backdrop-blur-sm text-white"
    >
      <TableHeader>
        <TableColumn>ID</TableColumn>
        <TableColumn>Lote</TableColumn>
        <TableColumn>Inicio</TableColumn>
        <TableColumn>Fin</TableColumn>
      </TableHeader>
      <TableBody>
        {ciclos.map((ciclo) => (
          <TableRow key={ciclo.id_ciclo} className="text-sm hover:bg-gray-700/50 cursor-pointer">
            <TableCell>{ciclo.id_ciclo}</TableCell>
            <TableCell>{ciclo.lote}</TableCell>
            <TableCell>{new Date(ciclo.fecha_inicio).toLocaleDateString('es-ES')}</TableCell>
            <TableCell>{new Date(ciclo.fecha_fin).toLocaleDateString('es-ES')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablaCiclos;
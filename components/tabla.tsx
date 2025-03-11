"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import alertas from "./alertas.json";

type Alerta = {
  key: string;
  description: string;
  type: string;
  state: string;
  time: string;
};

const Tabla: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  let list = useAsyncList<Alerta>({
    async load() {
      setIsLoading(true);
      setPage(1);
      return { items: alertas };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column as keyof Alerta];
          let second = b[sortDescriptor.column as keyof Alerta];
          let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  useEffect(() => {
    list.reload();
    setIsLoading(false);
  }, []);

  return (
    <div className="w-full h-full">
      <Table
        removeWrapper 
        aria-label="Tabla de alertas"
        classNames={{
          base: "max-h-screen bg-black rounded-2xl",
          table: "min-h-[59vh] items-center",
          thead: "flex flex-row bg-footerbg py-auto items-center p-20 rounded-2xl",
          th: "flex flex-row h-full w-[15%] justify-start items-center cursor-pointer bg-footerbg",
          tr: "flex flex-row h-full w-full justify-between items-center",
          td: "flex flex-row h-full w-[15%] justify-start items-center"
        }}
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader>
          <TableColumn key="description" allowsSorting> DESCRIPCIÓN </TableColumn>
          <TableColumn    key="type"     allowsSorting>    TIPO     </TableColumn>
          <TableColumn   key="state"     allowsSorting>   ESTADO    </TableColumn>
          <TableColumn    key="time"     allowsSorting>    HORA     </TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          items={list.items}
          loadingContent={<Spinner label="Cargando..." />}
        >
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey as keyof Alerta)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Tabla;

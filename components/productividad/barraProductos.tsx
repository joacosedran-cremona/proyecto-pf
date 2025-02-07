// ProductBar.tsx
"use client";

import React from "react";

interface ProductoRealizado {
  NombreProducto: string;
  pesoTotal: number;
  cantidadCiclos: number;
  tiempoTotal: number;
}

interface FixedData {
  ProductosRealizados: ProductoRealizado[];
  PesoTotalCiclos: number;
}

interface ProductBarProps {
  data: FixedData;
}

const BarraProductos: React.FC<ProductBarProps> = ({ data }) => {
  const PesoTotalCiclosNum: number = data.PesoTotalCiclos;

  const generarColorAleatorio = (): string => {
    const letras = "23456789ABCDE";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letras[Math.floor(Math.random() * 13)];
    }
    return color;
  };

  const productos = data.ProductosRealizados.map((producto) => {
    const porcentaje = (producto.pesoTotal * 100) / PesoTotalCiclosNum;
    return {
      nombre: producto.NombreProducto,
      peso: producto.pesoTotal.toFixed(2) + "kg",
      cantidadCiclos: producto.cantidadCiclos,
      porcentaje: porcentaje.toFixed(2),
      color: generarColorAleatorio(),
    };
  });

  return (
    <div>
      <h3 className="text-xl font-bold">% Producto realizado</h3>
      <div className="flex h-[20px] rounded-[5px] overflow-hidden bg-[#444] mb-[15px]">
        {productos.map((producto, index) => (
          <div
            key={index}
            className="relative h-full after:content-[attr(data-tooltip)] after:absolute after:bg-[rgba(0,0,0,0.7)] after:text-white after:px-[10px] after:rounded-[5px] after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:whitespace-nowrap after:z-10 after:pointer-events-none after:opacity-0 hover:after:opacity-100 hover:after:left-auto hover:after:right-0 hover:after:translate-x-0 hover:after:-translate-y-1/2"
            style={{
              width: `${producto.porcentaje}%`,
              backgroundColor: producto.color,
            }}
            data-tooltip={`Ciclos: ${producto.cantidadCiclos}`}
          ></div>
        ))}
      </div>
      <div className="flex justify-around flex-wrap">
        {productos.map((producto, index) => (
          <div key={index} className="flex items-center my-[5px] mx-[10px]">
            <span
              className="w-[15px] h-[15px] rounded-[3px] mr-[5px]"
              style={{ backgroundColor: producto.color }}
            ></span>
            <p>{`${producto.nombre} - ${producto.porcentaje}% (${producto.peso})`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarraProductos;

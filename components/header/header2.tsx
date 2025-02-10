"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface Header2Props {
  currentPath: string;
}

interface OpcionBoton {
  id: number;
  path: string;
  text: string;
  styleClass: string;
}

// Datos estáticos definidos fuera del componente
const opcionesBotones: OpcionBoton[] = [
  {
    id: 1,
    path: "/cocinas",
    text: "COCINAS",
    styleClass: "text-orange text-2xl",
  },
  {
    id: 2,
    path: "/enfriadores",
    text: "ENFRIADORES",
    styleClass: "text-blue text-2xl",
  },
];

const Header2: React.FC<Header2Props> = ({ currentPath }) => {
  useEffect(() => {
    console.log("Ruta actual:", currentPath);
  }, [currentPath]);

  return (
    <header className="flex flex-col text-black w-full sticky top-0 z-[999]">
      <nav className="flex flex-row w-full bg-black p-3 h-40">
        <div className="w-1/4"></div>
        <ul className="flex flex-row w-1/2 h-full align-middle">
          {opcionesBotones.map(({ id, path, text, styleClass }) => (
            <li key={id} className="flex flex-row w-full h-full justify-center align-center">
              <Link href={path} className="flex justify-center gap-5 h-full align-middle">
                <span className={styleClass}>{text}</span>
              </Link>
              {currentPath === path && <div className=""></div>}
            </li>
          ))}
        </ul>
        <div className="w-1/4"></div>
      </nav>
    </header>
  );
};

export default Header2;

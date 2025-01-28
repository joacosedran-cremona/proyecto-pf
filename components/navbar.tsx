"use client";

import React, { useEffect, ReactElement, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface OpcionIcono {
id: number;
url?: string;
icon: string;
}

interface OpcionMenu {
id: number;
url: string;
text: string;
}

interface OpcionBoton {
id: number;
path: string;
text: string;
styleClass: string;
}

interface CombinedProps {
children?: ReactNode; // Hacer children opcional
}

const Header: React.FC<CombinedProps> = ({ children }): ReactElement => {
const pathname = usePathname();

const opcionesIconos: OpcionIcono[] = [
    { id: 1, icon: "/usuario.png" },
    { id: 2, url: "/alarma", icon: "/campana.png" },
];

const opcionesMenu: OpcionMenu[] = [
    { id: 1, url: "/", text: "Home" },
    { id: 2, url: "/panel", text: "Panel" },
    { id: 3, url: "/graficos", text: "Graficos" },
];

const opcionesBotones: OpcionBoton[] = [
    {
        id: 1,
        path: "/datos_graficos",
        text: "Cocinas",
        styleClass: "text-orange text-2xl"
    },
    {
        id: 2,
        path: "/productividad",
        text: "Enfriadores",
        styleClass: "text-blue text-2xl"
    },
];

useEffect(() => {
    // Sincroniza el estado con la ruta actual en la carga del cliente
    console.log("Ruta actual:", pathname);
}, [pathname]);

return (
    <header
        className="flex flex-col text-black w-full"
    >
        <nav
        className="flex flex-row w-full p-20 h-[65px] bg-white"
        >
            <div
                className="flex flex-row h-full w-[40%] justify-start gap-30"
            >
                {opcionesIconos.map(({ id, url, icon }) => (
                    <div
                        key={id}
                        className="h-full w-auto"
                    >
                        {url ? (
                            <Link
                                href={url}
                            >
                                <Image
                                    className=""
                                    src={icon}
                                    alt={`Icono ${id}`}
                                    width={25}
                                    height={25}
                                />
                            </Link>
                        ) : (
                            <Image
                                className=""
                                src={icon}
                                alt={`Icono ${id}`}
                                width={25}
                                height={25}
                            />
                        )}
                    </div>
                ))}
            </div>

            <p
                className="flex w-[20%] justify-center"
            >
                Planta Piloto - PF PROYECTO
            </p>

            <div
                className="flex flex-row w-[40%] justify-end"
            >
                <ul
                    className="flex flex-row gap-60 h-full"
                >
                    {opcionesMenu.map(({ id, url, text }) => (
                    <li
                        key={id}
                        className="h-full"
                    >
                        <Link 
                            href={url}
                            className={pathname === url ? "activeLink" : ''}
                        >
                            <span
                                className=""
                            >
                                {text}
                            </span>
                        </Link>
                    </li>
                    ))}
                    <div
                        className="h-full w-auto"
                    >
                        <Link
                            href="https://creminox.com"
                            target="_blank" rel="noopener noreferrer"
                        >
                            <Image
                                className="h-full w-auto"
                                src="/creminox.png"
                                alt="Creminox"
                                width={1000}
                                height={1000}
                            />
                        </Link>
                    </div>
                </ul>
            </div>
        </nav>

        {/*Segundo Nav*/}

        <nav
            className="flex flex-row w-full"
        >
            <ul
                className="flex flex-row w-full"
            >
                {opcionesBotones.map(({ id, path, text, styleClass }) => (
                <li
                    key={id}
                    className="flex flex-row w-full justify-center align-center"
                >
                    <Link
                        href={path}
                        className="flex justify-center gap-5 align-middle"
                    >
                        <span
                            className={styleClass}
                        >
                            {text}
                        </span>
                    </Link>
                    {pathname === path && (
                    <div
                        className=""
                    >

                    </div>
                    )}
                </li>
                ))}
            </ul>
        </nav>
    </header>
    );
};

export default Header;
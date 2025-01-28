"use client";

import React, { useState, useEffect, ReactElement, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
Navbar as HeroUINavbar,
NavbarContent,
NavbarMenu,
NavbarBrand,
NavbarItem,
} from "@heroui/react"; // Asegúrate de que esta importación sea correcta
import clsx from "clsx";

interface OpcionIcono {
id: number;
url?: string;
icon: string;
onClick?: () => void;
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
const [logoutVisible, setLogoutVisible] = useState<boolean>(false);

const toggleLogout = () => {
    setLogoutVisible(!logoutVisible);
};

const opcionesIconos: OpcionIcono[] = [
    { id: 1, icon: "/usuario.png", onClick: toggleLogout },
    { id: 2, url: "/alarma", icon: "/alarma.png" },
    { id: 3, url: "/configuraciones", icon: "/configuracion.png" },
];

const opcionesMenu: OpcionMenu[] = [
    { id: 1, url: "/camaras", text: "CAMARAS" },
    { id: 2, url: "/completo", text: "HOME" },
];

const opcionesBotones: OpcionBoton[] = [
    { id: 1, path: "/completo", text: "COMPLETO", styleClass: "text-white" },
    { id: 2, path: "/desmoldeo", text: "DESMOLDEO", styleClass: "text-white" },
    { id: 3, path: "/encajonado", text: "ENCAJONADO", styleClass: "text-gray" },
    { id: 4, path: "/paletizado", text: "PALETIZADO", styleClass: "text-gray" },
];

useEffect(() => {
    // Sincroniza el estado con la ruta actual en la carga del cliente
    console.log("Ruta actual:", pathname);
}, [pathname]);

return (
    <HeroUINavbar maxWidth="xl" position="sticky">
    <NavbarContent justify="start">
        <NavbarBrand>
        <Link href="/" className="flex items-center gap-1">
            <Image src="/creminox.png" alt="Creminox" width={40} height={40} />
            <span className="font-bold">SDDA - EFA PROYECTO</span>
        </Link>
        </NavbarBrand>
    </NavbarContent>

    <NavbarContent justify="center">
        {opcionesBotones.map(({ id, path, text, styleClass }) => (
        <NavbarItem key={id}>
            <Link
            href={path}
            className={clsx(
                pathname === path ? "font-bold" : "",
                styleClass,
                "p-2.5 text-[#D9D9D9] transition-colors duration-300 ease-in-out relative"
            )}
            >
            <Image
                className="max-w-[12px] max-h-[12px] mr-1"
                src={pathname === path ? "/puntoVerde.png" : "/puntoGris.png"}
                alt="Punto"
                width={12}
                height={12}
            />
            {text}
            {pathname === path && (
                <div className="w-[187px] h-[5px] bg-[#D9D9D9] rounded-[10px] absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out"></div>
            )}
            </Link>
        </NavbarItem>
        ))}
    </NavbarContent>

    <NavbarContent justify="end" className="gap-[30px]">
        {opcionesIconos.map(({ id, url, icon, onClick }) => (
        <NavbarItem key={id}>
            {onClick ? (
            <div onClick={onClick}>
                <Image
                className="w-[25px] h-full cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-md hover:scale-110"
                src={icon}
                alt={`Icono ${id}`}
                width={25}
                height={25}
                />
            </div>
            ) : (
            <Link href={url!}>
                <Image
                className="w-[25px] h-full cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-md hover:scale-110"
                src={icon}
                alt={`Icono ${id}`}
                width={25}
                height={25}
                />
            </Link>
            )}
        </NavbarItem>
        ))}
    </NavbarContent>

    <NavbarMenu>
        <div className="w-full">{children}</div>
    </NavbarMenu>
    </HeroUINavbar>
);
};

export default Header;
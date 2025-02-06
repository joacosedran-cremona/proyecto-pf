"use server";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface FooterOption {
id: number;
icono: any;
link: string;
texto: string;
}

const Footer: React.FC = () => {
const opcionesIzq: FooterOption[] = [
    {
    id: 1,
    icono: "/ubicacion.png",
    link: "https://www.google.com/maps/place/Beron+de+Astrada+2745,+CABA,+Argentina",
    texto: "Beron de Astrada 2745, CABA, Argentina",
    },
    {
    id: 2,
    icono: "/mail.png",
    link: "mailto:soporte@creminox.com",
    texto: "soporte@creminox.com",
    },
];

const opcionesDer: FooterOption[] = [
    {
    id: 3,
    icono: "/facebook.png",
    link: "https://facebook.com/creminox",
    texto: "/creminox",
    },
    {
    id: 4,
    icono: "/linkedin.png",
    link: "https://ar.linkedin.com/company/creminox",
    texto: "Creminox",
    },
];

return (
    <footer
        className="flex flex-col align-middle bg-footerbg w-full text-white inset-x-0 bottom-0"
    >
            <div
                className="flex flex-row w-full max-w-1920 h-[165px] justify-between align-middle p-40"
            >
                <ul
                    className="flex flex-col justify-center align-middle h-full w-[30%]"
                >
                    {opcionesIzq.map(({ id, icono, link, texto }) => (
                        <li 
                            key={id}
                            className="flex flex-row items-center justify-start h-1/2 py-[1vh] gap-10"
                        >
                            <Link
                                className="flex flex-row items-center h-full gap-15"
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >  
                                <Image
                                    src={icono}
                                    alt={texto}
                                    className="w-auto h-full items-center"
                                    width={35}
                                    height={35}
                                />
                                <p
                                    className="items-center"
                                >
                                    {texto}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div
                    className="flex justify-center align-middle h-full w-[40%]"
                >
                    <Link 
                        className="flex w-auto h-full p-0 justify-center items-center"
                        href="https://creminox.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            src="/creminox-logo.png"
                            alt="Creminox logo"
                            className="h-1/2 w-auto"
                            width={2000}
                            height={2000}
                        />
                    </Link>
                </div>
                
                <ul
                    className="flex flex-col justify-center align-middle h-full w-[30%]"
                >
                    {opcionesDer.map(({ id, icono, link, texto }) => (
                        <li
                            key={id}
                            className="flex flex-row items-center justify-end h-1/2 py-[1vh] gap-10"
                        >
                            <Link
                                className="flex flex-row items-center h-full gap-15"
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <p
                                    className="items-center"
                                >
                                    {texto}
                                </p>
                                <Image
                                    src={icono}
                                    alt={texto}
                                    className="w-auto h-full items-center"
                                    width={35}
                                    height={35}
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <hr
                className="border-[#6668]"
            />

            <p
                className="flex text-xs font-light text-[#666] py-[5px] w-full justify-center align-middle"
            >
                ©2025 All Rights Reserved Cremona Inoxidable
            </p>
        </footer>
    );
};

export default Footer;
"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { VscBell } from "react-icons/vsc";

import DropdownBanderas from "@/components/traduccion/dropdownBanderas";
import Desloguear from "@/components/botones/desloguear";

interface Header1Props {
  currentPath: string;
}

interface OpcionIcono {
  id: number;
  url?: string;
  icon: JSX.Element | React.ReactNode;
}

interface OpcionMenu {
  id: number;
  url: string;
  text: string;
}

const opcionesIconos: OpcionIcono[] = [
  { id: 1, icon: <Desloguear /> },
  {
    id: 2,
    url: "/alertas",
    icon: (
      <Link
        className="group relative flex items-center justify-center w-[25px] h-[25px] transition-all duration-200 ease-in-out"
        href="/alertas"
      >
        {/* Efecto de glow */}
        <div className="absolute inset-0 rounded-[100%] bg-gray-400/0 group-hover:bg-gray-400/20 transition-all duration-200 ease-in-out group-hover:scale-150 pointer-events-none" />

        {/* Icono con escala */}
        <VscBell className="w-[25px] h-[25px] text-[#131313] transition-transform duration-300 ease-in-out group-hover:scale-110" />
      </Link>
    ),
  },
  { id: 3, icon: <DropdownBanderas /> },
];

const Header1: React.FC<Header1Props> = ({ currentPath }) => {
  const { t } = useTranslation("header");

  const opcionesMenu: OpcionMenu[] = [
    { id: 1, url: "/", text: t("menu.home") },
    { id: 2, url: "/monitoreo", text: t("menu.monitoreo") },
    { id: 3, url: "/historico", text: t("menu.historico") },
  ];

  return (
    <nav className="fixed top-[0px] left-[0px] right-[0px] z-[950] flex flex-row w-[100%] p-[20px] h-[65px] bg-[#EEE]">
      <div className="flex flex-row h-[100%] w-[30%] justify-start gap-[30px]">
        {opcionesIconos.map(({ id, url, icon }) => (
          <div key={id}>{icon}</div>
        ))}
      </div>

      <p className="flex w-[40%] justify-center text-[#000]">
        {t("header1.titulo")}
      </p>

      <div className="flex flex-row w-[30%] justify-end">
        <ul className="flex flex-row w-[100%] h-[100%] gap-[1vw] justify-end">
          {opcionesMenu.map(({ id, url, text }) => (
            <li key={id} className="h-[100%]">
              <Link
                className={currentPath === url ? "activeLink" : ""}
                href={url}
              >
                <span>{text}</span>
              </Link>
            </li>
          ))}
          <div className="h-[100%] min-w-[105px] w-[105px] hidden 1050:block">
            <Link
              href="https://creminox.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                alt="Creminox"
                className="h-[100%] w-[105px]"
                height={1000}
                src="/creminox.png"
                width={1000}
              />
            </Link>
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Header1;

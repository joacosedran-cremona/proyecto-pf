"use client";

import { useTranslation } from 'react-i18next';
import Link from "next/link";
import Image from "next/image";
import { VscAccount, VscBell  } from "react-icons/vsc";
import DropdownBanderas from '@/components/traduccion/dropdownBanderas';
import Desloguear from '@/components/desloguear/desloguear';

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
  { id: 2, url: "/alertas", icon: <VscBell className="w-auto h-[100%]" /> },
  { id: 3, icon: <DropdownBanderas /> },
];

const Header1: React.FC<Header1Props> = ({ currentPath }) => {

  const { t } = useTranslation('header');

  const opcionesMenu: OpcionMenu[] = [
    { id: 1, url: "/", text: t('menu.home') },
    { id: 2, url: "/monitoreo", text: t('menu.monitoreo') },
    { id: 3, url: "/historico", text: t('menu.historico') },
  ];

  return (
    <nav className="fixed top-[0px] left-[0px] right-[0px] z-[950] flex flex-row w-[100%] p-[20px] h-[65px] bg-[#EEE]">
      <div className="flex flex-row h-[100%] w-[30%] justify-start gap-[30px]">
        {opcionesIconos.map(({ id, url, icon }) => (
          <div key={id}>
            {url ? (
              <Link href={url}>
                {icon}
              </Link>
            ) : (
              icon
            )}
          </div>
        ))}
      </div>

      <p className="flex w-[40%] justify-center text-[#000]">
        {t("header1.titulo")}
      </p>

      <div className="flex flex-row w-[30%] justify-end">
        <ul className="flex flex-row w-[100%] h-[100%] gap-[1vw] justify-end">
          {opcionesMenu.map(({ id, url, text }) => (
            <li key={id} className="h-[100%]">
              <Link href={url} className={currentPath === url ? "activeLink" : ""}>
                <span>{text}</span>
              </Link>
            </li>
          ))}
          <div className="h-[100%] min-w-[105px] w-[105px] hidden 1050:block">
            <Link href="https://creminox.com" target="_blank" rel="noopener noreferrer">
              <Image
                className="h-[100%] w-[105px]"
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
  );
};

export default Header1;

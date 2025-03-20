"use client";

import { useTranslation } from 'react-i18next';
import Link from "next/link";
import Image from "next/image";
import { VscAccount, VscBell  } from "react-icons/vsc";

interface Header1Props {
  currentPath: string;
}

interface OpcionIcono {
  id: number;
  url?: string;
  icon: JSX.Element;
}

interface OpcionMenu {
  id: number;
  url: string;
  text: string;
}


const opcionesIconos: OpcionIcono[] = [
  { id: 1, icon: <VscAccount className="w-auto h-full" /> },
  { id: 2, url: "/alertas", icon: <VscBell className="w-auto h-full" /> },
];

const Header1: React.FC<Header1Props> = ({ currentPath }) => {

  const { t } = useTranslation('header');

  const opcionesMenu: OpcionMenu[] = [
    { id: 1, url: "/", text: t('menu.home') },
    { id: 2, url: "/monitoreo", text: t('menu.monitoreo') },
    { id: 3, url: "/historico", text: t('menu.historico') },
  ];

  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  }; 

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-row w-full p-20 h-[65px] bg-[#EEE]">
      <div className="flex flex-row h-full w-[30%] justify-start gap-30">
        {opcionesIconos.map(({ id, url, icon }) => (
          <div key={id} className="h-full w-auto">
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
        <div className="flex gap-2">
          <button onClick={() => changeLanguage('es')}>🇪🇸</button>
          <button onClick={() => changeLanguage('en')}>🇺🇸</button>
        </div>
        <ul className="flex flex-row w-full h-full gap-[1vw] justify-end">
          {opcionesMenu.map(({ id, url, text }) => (
            <li key={id} className="h-full">
              <Link href={url} className={currentPath === url ? "activeLink" : ""}>
                <span>{text}</span>
              </Link>
            </li>
          ))}
          <div className="h-full min-w-[105px] w-[105px] hidden 1050:block">
            <Link href="https://creminox.com" target="_blank" rel="noopener noreferrer">
              <Image
                className="h-full w-[105px]"
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

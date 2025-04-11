"use client";

import { useTranslation } from 'react-i18next';
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

const Header2: React.FC<Header2Props> = ({ currentPath }) => {
  const { t } = useTranslation('header');

  const opcionesBotones: OpcionBoton[] = [
    {
      id: 1,
      path: "/cocinas",
      text: t('header2.botones.cocinas'),
      styleClass: "text-orange text-2xl",
    },
    {
      id: 2,
      path: "/enfriadores",
      text: t('header2.botones.enfriadores'),
      styleClass: "text-blue text-2xl",
    },
  ];

  return (
    <header className="fixed top-[65px] left-0 right-0 z-[900] flex flex-col text-black w-full">
      <nav className="flex flex-row w-full bg-black p-3 h-40">
        <div className="w-1/4"></div>
        <ul className="flex flex-row w-1/2 h-full items-center justify-center">
          {opcionesBotones.map(({ id, path, text, styleClass }) => (
            <li key={id} className="flex flex-row w-full h-full items-center justify-center">
              <Link href={path} className="flex justify-center gap-5 h-full items-center">
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

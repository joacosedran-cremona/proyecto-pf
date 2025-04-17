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
    <header className="fixed top-[65px] left-[0px] right-[0px] z-[900] flex flex-col text-black w-[100%]">
      <nav className="flex flex-row w-[100%] bg-black p-[3px] h-[40px]">
        <div className="w-1/4"></div>
        <ul className="flex flex-row w-1/2 h-[100%] items-center justify-center">
          {opcionesBotones.map(({ id, path, text, styleClass }) => (
            <li key={id} className="flex flex-row w-[100%] h-[100%] items-center justify-center">
              <Link href={path} className="flex justify-center gap-[5px] h-[100%] items-center">
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

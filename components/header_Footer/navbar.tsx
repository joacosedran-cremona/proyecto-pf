"use client";

import { usePathname } from "next/navigation";
import Header1 from "./header1";
import Header2 from "./header2";

export default function Header() {
const pathname = usePathname();
const isHome = (pathname === "/cocinas" || pathname === "/enfriadores");

return (
    <header className="w-full text-black">
        <Header1 currentPath={pathname} />
        {isHome && <Header2 currentPath={pathname} />} {/* Header2 solo aparece si no es la página de inicio */}
        </header>
    );
}

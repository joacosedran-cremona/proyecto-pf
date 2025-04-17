'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/header_Footer/navbar";
import Footer from "@/components/header_Footer/footer";
import clsx from "clsx";

function LayoutHandler({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-[100%] min-h-screen">
      {pathname !== '/login' && <Navbar />}
      <main className={clsx(
        "min-h-screen w-[100%] bg-grey p-[20px]",
        pathname !== '/login' && "pt-[85px]"
      )}>
        {children}
      </main>
      {pathname !== '/login' && <Footer />}
    </div>
  );
}

export default LayoutHandler;
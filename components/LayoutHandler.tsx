"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";

import Navbar from "@/components/header_Footer/navbar";
import Footer from "@/components/header_Footer/footer";

function LayoutHandler({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isLoginRoute = ["/login", "/login/recuperacion"].includes(pathname);

  return (
    <div className="flex flex-col w-[100%] min-h-screen">
      {!isLoginRoute && <Navbar />}
      <main
        className={clsx(
          "min-h-screen w-[100%] bg-grey p-[20px]",
          !isLoginRoute && "pt-[85px]",
        )}
      >
        {children}
      </main>
      {!isLoginRoute && <Footer />}
    </div>
  );
}

export default LayoutHandler;

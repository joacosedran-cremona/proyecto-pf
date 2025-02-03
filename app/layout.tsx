import "@/styles/globals.css";
import clsx from "clsx";

import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen flex flex-col bg-grey font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          {/* Estructura principal con flexbox */}
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-grey p-20">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

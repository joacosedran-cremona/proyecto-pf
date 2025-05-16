import "@/styles/globals.css";
import { cookies } from "next/headers";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialLanguage = cookieStore.get("selectedLanguage")?.value || "es";

  return (
    <html suppressHydrationWarning className="dark" lang="en">
      <head />
      <body
        className={
          "min-h-screen bg-grey font-mono antialiased w-[100%] items-center justify-center"
        }
      >
        <Providers initialLanguage={initialLanguage}>{children}</Providers>
      </body>
    </html>
  );
}

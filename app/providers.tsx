"use client";

import * as React from "react";

import type { ThemeProviderProps } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { CocinaProvider } from "@/context/CocinaContext";
import { EnfriadorProvider } from "@/context/EnfriadorContext";
import { LineaProvider } from "@/context/LineaContext";

import LayoutHandler from "@/components/LayoutHandler";

import { WebSocketProvider } from "@/context/WebSocketContext";

import { I18nextProvider } from "react-i18next";
import { i18n } from "@/i18n";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Toaster } from "sonner";

import ProtectedRoute from "@/components/ProtectedRoute";

export interface ProvidersProps {
  initialLanguage: string;
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({
  initialLanguage,
  children,
  themeProps,
}: ProvidersProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.init({
        lng: initialLanguage,
        fallbackLng: "es",
      });
    }

    const handleLanguageChange = (lng: string) => {
      localStorage.setItem("selectedLanguage", lng);
      document.cookie = `selectedLanguage=${lng}; path=/`;
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, [initialLanguage]);

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        <I18nextProvider i18n={i18n}>
          {mounted && (
            <LayoutHandler>
              <ProtectedRoute>
                <WebSocketProvider>
                  <LineaProvider>
                    <CocinaProvider>
                      <EnfriadorProvider>
                        <Toaster richColors />
                        {children}
                        <Toaster richColors />
                      </EnfriadorProvider>
                    </CocinaProvider>
                  </LineaProvider>
                </WebSocketProvider>
              </ProtectedRoute>
            </LayoutHandler>
          )}
        </I18nextProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

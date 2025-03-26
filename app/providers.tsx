"use client";

import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { CocinaProvider } from "@/context/CocinaContext";
import { EnfriadorProvider } from "@/context/EnfriadorContext";
import { LineaProvider } from "@/context/LineaContext";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { useEffect, useState } from 'react';

export interface ProvidersProps {
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

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Sincronizar idioma al montar el cliente
  useEffect(() => {
    const syncLanguage = () => {
      const savedLang = localStorage.getItem('selectedLanguage') || document.cookie.match(/selectedLanguage=([^;]+)/)?.[1];
      if (savedLang && i18n.language !== savedLang) {
        i18n.changeLanguage(savedLang);
      }
    };
    
    setMounted(true);
    syncLanguage();
  }, []);

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        {/* Mover I18nextProvider al nivel superior */}
        <I18nextProvider i18n={i18n}>
          {/* Esperar a montaje en cliente para evitar hydration mismatch */}
          {mounted && (
            <LineaProvider>
              <CocinaProvider>
                <EnfriadorProvider>
                  {children}
                </EnfriadorProvider>
              </CocinaProvider>
            </LineaProvider>
          )}
        </I18nextProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
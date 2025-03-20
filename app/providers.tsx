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

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        <I18nextProvider i18n={i18n}>
          <LineaProvider>
            <CocinaProvider>
              <EnfriadorProvider>
                {children}
              </EnfriadorProvider>
            </CocinaProvider>
          </LineaProvider>
        </I18nextProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

"use client";

import { useTranslation } from "react-i18next";

import Tabla from "@/components/tabla";

export default function Home() {
  const { t } = useTranslation("hist_alert_tit");

  return (
    <section className="flex flex-col w-[100%] min-h-[70vh] min-w-[650px] gap-[20px]">
      <Tabla />
    </section>
  );
}

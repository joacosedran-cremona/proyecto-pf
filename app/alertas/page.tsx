"use client"

import Tabla from "@/components/tabla";
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation('hist_alert_tit');
  return (
    <section className="flex flex-col w-[100%] min-h-[70vh] gap-[20px]">
      <Tabla />
    </section>
  );
}

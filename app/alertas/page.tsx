"use client"

import Tabla from "@/components/tabla";
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation('hist_alert_tit');
  return (
    <section className="flex flex-col w-[100%] min-h-[70vh] justify-center gap-[20px]">
      <h1
        className="flex w-[100%] text-4xl text-white"
      >
        {t('alertas')}
      </h1>
      <Tabla />
    </section>
  );
}

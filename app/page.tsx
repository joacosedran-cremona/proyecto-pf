"use client"

import { ImagenLayout } from "@/components/imagenLayout";
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation('layout');
  return (
    <section className="flex flex-col w-full items-center justify-center gap-20 bg-black rounded-md p-20">
      <div>
        <h1
          className="flex align-center justify-center w-full text-4xl text-white"
        >
          {t('titulo')}
        </h1>
        <p
          className="flex align-center justify-center w-full text-xl text-white"
        >
          {t('subtitulo')}
        </p>
      </div>
      <ImagenLayout />
    </section>
  );
}

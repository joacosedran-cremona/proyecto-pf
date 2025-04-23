"use client"

import { ImagenLayout } from "@/components/imagenLayout";
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation('layout');
  return (
    <section className="laptop:pb-[70px] laptop:pt-[25px] pb-[125px] pt-[50px] flex flex-col w-[100%] h-[50%] items-center justify-center gap-[20px] bg-black rounded-md p-[20px]">
      <div>
        <h1
          className="flex align-center justify-center w-[100%] text-4xl text-white font-semibold"
        >
          {t('titulo')}
        </h1>
        <p
          className="flex align-center justify-center w-[100%] text-xl text-white"
        >
          {t('subtitulo')}
        </p>
      </div>
      <ImagenLayout />
    </section>
  );
}

"use client"

import { ImagenLayout } from "@/components/imagenLayout";

export default function Home() {

  return (
    <section className="flex flex-col w-full items-center justify-center gap-20">
      <h1
        className="flex align-center w-full text-4xl"
      >
        COCINAS & ENFRIADORES
      </h1>
      <ImagenLayout />
    </section>
  );
}

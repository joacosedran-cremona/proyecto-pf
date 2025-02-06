"use client";

import Grafico from "@/components/grafico";
import { Productividad } from "@/components/productividad";

export default function Historico() {
  return (
    <section className="flex flex-col w-full items-center justify-center gap-20">
      <h1 className="flex align-center w-full text-2xl">HISTORICO</h1>
      <div className="w-full h-[75vh]">
        <Grafico contextType="enfriadores" />
      </div>
      <div className="bg-black p-20 w-full rounded-md ">
        <Productividad />
      </div>
    </section>
  );
}

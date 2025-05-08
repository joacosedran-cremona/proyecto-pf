"use client"

import { ImagenLayout } from "@/components/home/imagenLayout";
import { Alarmas } from "@/components/home/alarmas";

export default function Home() {
  return (
    <section className="p-[20px] h-[90vh] flex flex-row w-[100%] gap-[20px] items-center bg-black rounded-md">
      <div className="w-1/6 h-[100%] flex items-center justify-center">
        <Alarmas />
      </div>
        
      <hr className="h-[85%] w-[2px] mx-[2px] border-none bg-white/30 z-9999"/>
      
      {/* Ampliado a w-full en lugar de w-5/6 */}
      <div className="w-full h-[100%] flex items-center justify-center">
        <ImagenLayout />
      </div>
    </section>
  );
}

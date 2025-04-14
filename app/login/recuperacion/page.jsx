"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import crem from "@/public/creminox.png";

export default function ForgotPassword() {
  return (
    <div className="w-full h-[80%] flex absolute items-center justify-center bg-[#1f1f1f]">
      <div className="w-auto h-auto gap-5 flex flex-col absolute items-center justify-center m-auto p-[3rem_4rem_2rem_4rem] max-w-[1920px] text-[#D9D9D9] bg-[#131313] rounded-[15px]">
        <Image
          src={crem}
          alt="Creminox"
          priority={true}
          className="flex w-[60%] m-auto p-0 h-auto"
        />
        
        <form className="w-full max-w-[100vw] h-auto flex flex-col gap-5">
          <div className="flex flex-col gap-[5px]">
            <label className="flex font-bold text-[17px] tracking-[0.5px]">
              Email
            </label>
            <input
              type="email"
              className="bg-[#1f1f1f] p-4 rounded-[10px] w-full max-w-[60vw] min-h-[5vh] h-full max-h-[70vw] border-none"
            />
          </div>

          {/* Botón de recuperación */}
          <button 
            type="submit"
            className="bg-[#e82a31] p-4 flex-row rounded-[10px] w-full h-12 flex items-center justify-center border-none text-[#D9D9D9] font-bold mb-[0.4rem] cursor-pointer disabled:bg-[#a82328] disabled:cursor-not-allowed"
          >
            Recuperar Contraseña
          </button>
        </form>

        <div>
          <Link 
            href="../login"
            className="w-full flex text-center justify-center text-[#5d5d5d]"
          >
            ¿Recordó su contraseña? Inicie sesión aquí
          </Link>
        </div>

        {/* Error container - Add this if you need it */}
        <div className="h-[20px] flex items-center justify-center">
          <span className="text-red-500 text-center text-sm"></span>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import crem from "@/public/creminox.png";

const Login = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    sessionStorage.setItem("access", "permitido");
    router.push("/");
  };

  return (
    <div className="flex w-[100%] h-[90vh] items-center justify-center">
      <div className="w-auto h-auto gap-[5px] flex flex-col items-center justify-center p-[3rem_4rem_2rem_4rem] max-w-[1920px] text-[#D9D9D9] bg-[#131313] rounded-[15px]">
        <Image
          src={crem}
          alt="Creminox"
          className="flex w-[60%] p-[0px] h-auto"
        />
        
        <form onSubmit={handleSubmit} className="w-[100%] h-auto flex flex-col gap-[5px]">
          <div className="flex flex-col gap-[5px]">
            <label className="flex font-bold text-[17px] tracking-[0.5px]">
              Username
            </label>
            <input
              type="text"
              className="bg-[#1f1f1f] p-[4px] rounded-[10px] w-[100%] h-[12px] flex items-center justify-center border-none mb-[0.4rem]"
            />
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className="flex font-bold text-[17px] tracking-[0.5px]">
              Contraseña
            </label>
            <input
              type="password"
              className="bg-[#1f1f1f] p-[4px] rounded-[10px] w-[100%] h-[12px] flex items-center justify-center border-none mb-[0.4rem]"
            />
          </div>

          <button 
            type="submit"
            className="bg-[#e82a31] p-[4px] rounded-[10px] w-[100%] h-[12px] flex items-center justify-center border-none text-[#D9D9D9] font-bold mb-[0.4rem] cursor-pointer disabled:bg-[#a82328] disabled:cursor-not-allowed"
          >
            Login
          </button>
        </form>

        <div>
          <Link 
            href="/login/recuperacion"
            className="w-[100%] flex text-center justify-center text-[#5d5d5d]"
          >
            ¿Olvidó su contraseña? Recupérela aquí
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

export default Login;
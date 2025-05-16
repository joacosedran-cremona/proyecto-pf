"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import crem from "@/public/creminox.png";

const ForgotPassword = () => {
  const { t } = useTranslation("login");

  return (
    <section className="flex w-[100%] h-[90vh] items-center justify-center">
      <div className="w-auto h-[60%] gap-[15px] flex flex-col items-center justify-between p-[3rem_4rem_2rem_4rem] max-w-[1920px] text-[#D9D9D9] bg-[#131313] rounded-[15px]">
        <Image
          alt="Creminox"
          className="flex w-[60%] p-[0px] h-auto"
          src={crem}
        />

        <form className="w-[100%] h-3/5 flex flex-col justify-evenly">
          <div className="flex flex-col gap-[5px] h-1/3">
            <label className="flex font-bold text-[17px] tracking-[0.5px]">
              {t("formulario.correo")}
            </label>
            <input
              className="bg-[#1f1f1f] p-[4px] rounded-[10px] w-[100%] h-[60%] flex items-center justify-center border-none"
              type="text"
            />
          </div>

          <button
            className="bg-[#e82a31] p-[4px] rounded-[10px] w-[100%] h-1/6 flex items-center justify-center border-none text-[#D9D9D9] font-bold cursor-pointer disabled:bg-[#a82328] disabled:cursor-not-allowed"
            type="submit"
          >
            <Link
              className="w-[100%] flex text-center justify-center text-white"
              href="../login"
            >
              {t("formulario.enviar")}
            </Link>
          </button>
        </form>

        <Link
          className="w-[100%] flex text-center justify-center text-[#5d5d5d]"
          href="../login"
        >
          {t("formulario.recordo")}
        </Link>
      </div>
    </section>
  );
};

export default ForgotPassword;

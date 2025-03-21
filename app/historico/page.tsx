"use client";

import React, { useState } from "react";
import Grafico from "@/components/graficos/graficoHistorico";
import Productividad from "@/components/productividad/productividad";
import Selector from "@/components/selectores/selectorHistorico";
import DatePicker from "@/components/dateRangePicker"
import BotonExcel from "@/components/botones/botonExcel";
import BotonPDF from "@/components/botones/botonPDF";
import BotonAplicar from "@/components/botones/botonAplicar";
import { useTranslation } from 'react-i18next';

export default function Historico() {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<"cocina" | "enfriador">("cocina");
  const [setData] = useState<any>(null);

  const { t } = useTranslation('selectores');

  const itemsList = [
    { id: 1,  name: t('cocinas.cocina1') },
    { id: 2,  name: t('cocinas.cocina2') },
    { id: 3,  name: t('cocinas.cocina3') },
    { id: 4,  name: t('cocinas.cocina4') },
    { id: 5,  name: t('cocinas.cocina5') },
    { id: 6,  name: t('cocinas.cocina6') },
    { id: 7,  name: t('enfriadores.enfriador1') },
    { id: 8,  name: t('enfriadores.enfriador2') },
    { id: 9,  name: t('enfriadores.enfriador3') },
    { id: 10, name: t('enfriadores.enfriador4') },
    { id: 11, name: t('enfriadores.enfriador5') },
    { id: 12, name: t('enfriadores.enfriador6') },
    { id: 13, name: t('enfriadores.enfriador7') },
    { id: 14, name: t('enfriadores.enfriador8') }
  ];

  const handleSelection = async (id: number) => {
    setSelectedId(id);
    if (id === 0) return;
    const type = id <= 6 ? "cocina" : "enfriador";
    setSelectedType(type);
    const filePath = type === "cocina" ? "/data/cocinas.json" : "/data/enfriadores.json";

    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error("Error al cargar el archivo JSON");
      }
      const jsonData = await response.json();
      const equipmentData = jsonData.find((item: any) => item.id === id);
      setData(equipmentData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(null);
    }
  };

  const borderColor = selectedType === "cocina" ? "border-orange" : "border-blue";
  const color = selectedType === "cocina" ? "orange" : "blue";

  return (
    <section className="flex flex-col w-full items-center justify-center gap-20">
      <div className="flex flex-row w-full min-h-[50px] h-[5vh] items-bottom">
        <h1 className="flex w-1/3 h-full text-3xl align-bottom text-white">HISTORICO</h1>
        <div className="flex flex-row w-2/3 justify-end gap-20">
          <Selector
            value={selectedId}
            onChange={handleSelection}
            items={itemsList}
            selectClasses={`w-auto bg-[#0001] px-20 border-b-2 ${borderColor} focus:outline-none text-lg text-${color} hover:text-${color} transition-colors cursor-pointer`}
            optionClasses="p-2 bg-black font-bold"
          />
          <DatePicker />
          <BotonAplicar selectClasses={`h-full w-1/6 text-lightGrey hover:text-white justify-center gap-5`}/>
          <BotonExcel selectClasses={`h-full w-1/6`}/>
          <BotonPDF selectClasses={`h-full w-1/6`}/>
        </div>
      </div>

      <div className="w-full h-[80vh]">
        <Grafico contextType={selectedType === "cocina" ? "cocinas" : "enfriadores"} />
      </div>
      <div className="w-full h-auto">
        <Productividad />
      </div>
    </section>
  );
}

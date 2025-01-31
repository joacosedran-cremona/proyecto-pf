"use client";

import { useEnfriador } from "@/context/EnfriadorContext";
import Selector from "./selector";

export default function Home() {
    const { enfriadorData } = useEnfriador();

    function displayData(data: string | number | null | boolean, unit?: string) {
        if (data === "N/A" || data === null) return data;
        if (typeof data === "boolean") return data ? "True" : "False"; // Para manejar booleanos
        return unit ? `${data} ${unit}` : data;
    }
    

    const getColorClass = (label: string, value: string | number | null) => {
        if (value === "N/A") {
            return "text-white"; // Si el valor es "N/A", se aplica color blanco
        }
        return label === "Nivel Agua" ? "text-water" : "text-blue";
    };
    
    
    const datosEnfriador = [
        { label: "Temp. Ingreso", value: enfriadorData.tempIng ?? "N/A", unit: "°C" },
        {
            label: "Temp. Agua",
            value: enfriadorData.ultimoPaso?.temp_Agua ?? "N/A", // Verificamos que `ultimoPaso` no sea null
            unit: "°C"
        },
        { label: "Temp. Producto", value: enfriadorData.tempProd ?? "N/A", unit: "°C" },
        { label: "Nivel Agua", value: enfriadorData.nivAgua ?? "N/A", unit: "mm" }
    ];
    
    const datosCiclo = [
        {
            label: "Paso N°",
            value: enfriadorData.ultimoPaso?.id ?? "N/A" // Verificamos que `ultimoPaso` no sea null y obtenemos el id del paso
        },
        { label: "N° Receta", value: enfriadorData.num_receta ?? "N/A" },
        { label: "Cant. Torres", value: enfriadorData.cant_torres ?? "N/A" },
        { label: "Tiempo Transcurrido", value: enfriadorData.tiempo ?? "N/A"},
        { label: "Tipo Fin", value: enfriadorData.tipo_Fin ?? "N/A" }
    ];

    const datosIO = [
        { label: "Frio", value: enfriadorData.sectorIO[0]?.frio ?? "N/A" },
        { label: "Vapor Vivo", value: enfriadorData.sectorIO[0]?.vapor_vivo ?? "N/A" },
        { label: "IO YY EQ XX", value: enfriadorData.sectorIO[0]?.io_yy_eq_xx ?? "N/A" },
        { label: "Vapor Serp", value: enfriadorData.sectorIO[0]?.vapor_serp ?? "N/A" },
    ];

    return (
        <section className="flex flex-col w-full h-full gap-20">
            <div className="flex flex-row w-full h-full gap-20">
                <div className="w-1/3">
                    <Selector />
                </div>
                <p className="bg-bluet flex justify-start items-center h-50 p-15 w-1/3 border-1 border-blue text-[20px] font-semibold rounded-md">
                    Receta: {enfriadorData.nom_receta ?? "N/A"}
                </p>
                <p className="bg-black flex justify-start items-center h-50 p-15 w-1/3 border-1 border-blue text-[20px] font-semibold rounded-md">
                    Estado: {enfriadorData.estado ?? "N/A"}
                </p>
            </div>
            <div
                className="w-full flex flex-col w-1/3 h-full gap-20
                    custom:flex-row"
            >
                <div
                    className="w-full flex flex-row h-full gap-20
                    custom:w-1/3 custom:flex-col"
                >
                    <div
                        className="w-3/4 flex flex-row h-3/4 gap-20
                        custom:w-full"
                    >
                        {/* Estado Equipo */}
                        <div className="bg-black flex flex-col p-20 w-1/2 min-w-[210px] rounded-md flex-1">
                            <h2 className="flex justify-start text-center w-full h-50 py-auto text-xl">
                                Estado Equipo
                            </h2>
                            <ul className="flex flex-col h-full w-full gap-1h">
                                {datosEnfriador.map((dato) => (
                                    <li key={dato.label} className="bg-grey flex flex-col w-full h-full px-20 py-1h rounded-md items-center">
                                        <p className="h-1/2 w-full mb-[1.5wv] text-[calc(0.6vw+1vh)]">
                                            {dato.label}
                                        </p>
                                        <p
                                            className={`h-1/2 w-full text-[calc(0.5vw+1vh)] ${getColorClass(dato.label, dato.value)}`}
                                        >
                                            {displayData(dato.value, dato.unit)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Ciclo Activo */}
                        <div className="flex flex-col w-1/2 min-w-[210px] gap-20 flex-1">
                            <div className="bg-black flex flex-col p-20 w-full h-full rounded-md flex-1">
                                <h2 className="flex justify-start text-center w-full h-50 py-auto text-xl">
                                    Ciclo Activo
                                </h2>
                                <ul className="flex flex-col h-full w-full gap-1h">
                                    {datosCiclo.map((dato) => (
                                        <li key={dato.label} className="bg-grey flex flex-col w-full h-full px-20 py-1h rounded-md items-center">
                                            <p
                                                className="h-1/2 w-full mb-[1.5wv] text-[calc(0.5vw+1vh)]"
                                            >
                                                {dato.label}
                                            </p>
                                            <p
                                                className="h-1/2 w-full text-[calc(0.5vw+1vh)]"
                                            >
                                                {displayData(dato.value)}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div
                        className="flex flex-col bg-black h-full p-20 w-1/3 rounded-md gap-20 flex-1
                        custom:w-full custom:h-1/4"
                    >
                        <h2 className="flex justify-start text-center w-full h-50 py-auto text-xl">
                            Sector IO
                        </h2>
                        <ul className=" flex flex-col gap-4
                            custom:grid custom:grid-cols-2"
                        >
                            {datosIO.map((dato) => (
                                <li key={dato.label} className="bg-grey flex flex-row w-full h-full px-20 py-1h rounded-md items-center">
                                    <p
                                        className="flex h-1/2 w-full text-[calc(0.5vw+1vh)] items-center"
                                    >
                                        {dato.label}
                                    </p>

                                    <p
                                        className="flex w-1/2 text-[calc(0.5vw+1vh)] justify-end"
                                    >
                                        {displayData(dato.value)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div
                    className="bg-black p-20 w-full rounded-md
                    custom:w-2/3"
                >
                    <h2 className="flex justify-start text-center w-full h-50 py-auto text-xl">
                        Gráfico
                    </h2>
                </div>
            </div>
        </section>
    );
}

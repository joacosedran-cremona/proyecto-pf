"use client";

import { useEffect } from "react";
import { Select, SelectItem } from "@heroui/react";
import "../../styles/selector.module.css";

interface CocinaData {
    tempIng: string | number | null;
    tempAgua: string | number | null;
    tempProd: string | number | null;
    nivAgua: string | number | null;
}

interface SelectorProps {
    cocinaId: number;
    setCocinaId: (id: number) => void;
    setCocinaData: (data: CocinaData) => void;
}

const Selector: React.FC<SelectorProps> = ({ cocinaId, setCocinaId, setCocinaData }) => {
    const cocinasList = [
        { id: 1, name: "Cocina 1" },
        { id: 2, name: "Cocina 2" },
        { id: 3, name: "Cocina 3" },
        { id: 4, name: "Cocina 4" },
        { id: 5, name: "Cocina 5" },
        { id: 6, name: "Cocina 6" }
    ];

    // Función para obtener los datos de la cocina
    async function getData() {
        try {
            const response = await fetch("/data/cocinas.json");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching cocina data:", error);
            return null;
        }
    }

    // Fetch de datos cuando el `cocinaId` cambia
    useEffect(() => {
        async function fetchData() {
            const data = await getData();
            if (data) {
                const selectedCocina = data.find((item: { num_cocina: number }) => item.num_cocina === cocinaId);
                if (selectedCocina) {
                    if (selectedCocina.estado === "INACTIVO") {
                        // Si la cocina está INACTIVA, establecemos los valores como "N/A"
                        setCocinaData({
                            tempIng: "N/A",
                            tempAgua: "N/A",
                            tempProd: "N/A",
                            nivAgua: "N/A"
                        });
                    } else {
                        // Si la cocina está activa, tomamos los datos del primer paso
                        const paso = selectedCocina.pasos[0];
                        setCocinaData({
                            tempIng: paso.temp_Ing,
                            tempAgua: paso.temp_Agua,
                            tempProd: paso.temp_Prod,
                            nivAgua: paso.niv_Agua
                        });
                    }
                } else {
                    // Si no se encuentra la cocina, establecemos los valores como "N/A"
                    setCocinaData({
                        tempIng: "N/A",
                        tempAgua: "N/A",
                        tempProd: "N/A",
                        nivAgua: "N/A"
                    });
                }
            } else {
                // Si no se pueden obtener los datos, establecemos los valores como "N/A"
                setCocinaData({
                    tempIng: "N/A",
                    tempAgua: "N/A",
                    tempProd: "N/A",
                    nivAgua: "N/A"
                });
            }
        }
        fetchData();
    }, [cocinaId, setCocinaData]);

    return (
        <div
            className="flex flex-col gap-4"
        >
            <div
                className="flex justify-start w-1/4 h-[50px]"
            >
                <Select
                    size="lg"
                    items={cocinasList}
                    defaultSelectedKeys={String(cocinaId)}
                    value={String(cocinaId)} // Sincronizamos el valor con `cocinaId`
                    variant="underlined"
                    onChange={(e) => setCocinaId(Number(e.target.value))}
                    aria-label="Select a kitchen"
                    classNames={{
                        base: "h-full relative",
                        label: "group-data-[filled=true]:-translate-y-5",
                        trigger: "h-full",
                        listboxWrapper: "max-h-[400px]",
                    }}
                >
                    {(cocina) => (
                        <SelectItem
                            key={cocina.id}
                            className="p-10 text-orange hover:text-orange text-lg font-bold"
                        >
                            {cocina.name}
                        </SelectItem>
                    )}
                </Select>
            </div>
        </div>
    );
};

export default Selector;

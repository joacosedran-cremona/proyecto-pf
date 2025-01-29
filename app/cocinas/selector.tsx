"use client";

import { useEffect } from "react";
import { Select, SelectItem } from "@heroui/react";
import "../../styles/selector.module.css";

interface CocinaData {
    tempIng: string | number | null;
    tempAgua: string | number | null;
    tempProd: string | number | null;
    nivAgua: string | number | null;
    nom_receta: string | null;
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

    useEffect(() => {
        async function fetchData() {
            const data = await getData();
            if (data) {
                const selectedCocina = data.find((item: { num_cocina: number }) => item.num_cocina === cocinaId);
                if (selectedCocina) {
                    if (selectedCocina.estado === "INACTIVO") {
                        setCocinaData({
                            tempIng: "N/A",
                            tempAgua: "N/A",
                            tempProd: "N/A",
                            nivAgua: "N/A",
                            nom_receta: null, // Asegurar que no sea undefined
                        });
                    } else {
                        const paso = selectedCocina.pasos?.[0]; // Tomamos el primer paso
                        setCocinaData({
                            tempIng: paso?.temp_Ing ?? "N/A",
                            tempAgua: paso?.temp_Agua ?? "N/A",
                            tempProd: paso?.temp_Prod ?? "N/A",
                            nivAgua: paso?.niv_Agua ?? "N/A",
                            nom_receta: selectedCocina.nom_receta ?? null, // Evitamos undefined
                        });
                    }
                } else {
                    setCocinaData({
                        tempIng: "N/A",
                        tempAgua: "N/A",
                        tempProd: "N/A",
                        nivAgua: "N/A",
                        nom_receta: null,
                    });
                }
            }
        }
        fetchData();
    }, [cocinaId, setCocinaData]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-start w-1/4 h-[50px]">
                <Select
                    size="lg"
                    items={cocinasList}
                    defaultSelectedKeys={String(cocinaId)}
                    value={String(cocinaId)}
                    variant="underlined"
                    onChange={(e) => setCocinaId(Number(e.target.value))}
                    placeholder="Seleccione una cocina"
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

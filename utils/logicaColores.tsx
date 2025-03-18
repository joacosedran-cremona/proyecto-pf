// utils.ts
type Value = string | number | null | boolean;

export const getColorClass = (label: string, value: Value, defaultColor: 'orange' | 'blue' | 'lightRed'): string => {
    if (value === "N/A") return "text-white !important";
    if (value === false) return "text-red !important";
    if (value === true) return "text-green !important";
    if (label === "Nivel Agua") return "text-water !important";
    if (label === "Temp. Ingreso") return "text-yellowGraph !important";
    if (label === "Temp. Agua") return "text-blueGraph !important";
    if (label === "Temp. Producto") return "text-greenGraph !important";
    const colorClass = defaultColor === 'orange' ? "text-orange !important" : defaultColor === 'blue' ? "text-blue !important" : "text-lightRed !important";
    return colorClass;
};

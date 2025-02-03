// utils.ts
type Value = string | number | null | boolean;

export const getColorClass = (label: string, value: Value, defaultColor: 'orange' | 'blue' | 'green'): string => {
    if (value === "N/A") return "text-white !important";
    if (value === false) return "text-red !important";
    if (value === true) return "text-green !important";
    if (label === "Nivel Agua") return "text-water !important";
    const colorClass = defaultColor === 'orange' ? "text-orange !important" : defaultColor === 'blue' ? "text-blue !important" : "text-green !important";
    return colorClass;
};

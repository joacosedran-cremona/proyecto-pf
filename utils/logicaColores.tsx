
type Value = string | number | null | boolean;

export const getColorClass = (label: string, value: Value, defaultColor: 'orange' | 'blue' | 'green'): string => {
    if (value === "N/A") return "text-white";
    if (value === false) return "text-red";
    if (value === true) return "text-red";
    if (label === "Nivel Agua") return "text-water";
    if (defaultColor === 'green') return "text-green";
    return defaultColor === 'orange' ? "text-orange" : "text-blue";
};

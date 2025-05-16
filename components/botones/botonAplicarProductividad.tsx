import { Button } from "@heroui/react";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface BotonAplicarProps {
  selectClasses?: string;
  startDate: string | null;
  endDate: string | null;
  lineaId: number;
  equipoId: number;
  dato_enviado?: number; // Add this missing prop
  onApplyFilters: (data: {
    startDate: string | null;
    endDate: string | null;
    lineaId: number;
    equipoId: number;
    dato_enviado?: number; // Add this to match the implementation
  }) => void;
}

export default function BotonAplicar({
  selectClasses,
  startDate,
  endDate,
  lineaId,
  equipoId,
  dato_enviado,
  onApplyFilters,
}: BotonAplicarProps) {
  const { t } = useTranslation("botones");
  const isDisabled = !startDate || !endDate;

  const handleClick = () => {
    onApplyFilters({
      startDate,
      endDate,
      lineaId,
      equipoId,
      dato_enviado,
    });
  };

  return (
    <Button
      className={`${selectClasses} min-w-[40px] ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      color="default"
      disabled={isDisabled}
      radius="md"
      variant="ghost"
      onClick={handleClick}
    >
      <FaSearch style={{ color: isDisabled ? "#999" : "grey" }} />
    </Button>
  );
}

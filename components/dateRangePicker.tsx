import { DateRangePicker } from "@heroui/react";
import { useState, useEffect } from "react";
import { CalendarDate } from "@internationalized/date";

// Definimos nuestro propio tipo para el rango de fechas
interface DateRange {
  start: CalendarDate;
  end: CalendarDate;
}

interface DatePickerProps {
  selectClasses?: string;
  onDateChange?: (startDate: string | null, endDate: string | null) => void;
}

export default function DatePicker({
  selectClasses,
  onDateChange,
}: DatePickerProps) {
  // Usamos nuestro tipo personalizado DateRange
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  // Establecer el día actual como valor predeterminado al cargar
  useEffect(() => {
    // Crear una fecha actual usando CalendarDate con los parámetros correctos
    const today = new CalendarDate(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
    );

    // Crear un rango donde inicio y fin son el día actual
    const initialRange: DateRange = {
      start: today,
      end: today,
    };

    setDateRange(initialRange);

    // También notificar al componente padre sobre este valor inicial
    if (onDateChange) {
      const currentDate = new Date();
      const formattedDate = formatToYYYYMMDD(currentDate);

      onDateChange(formattedDate, formattedDate);
    }
  }, [onDateChange]);

  const convertToDate = (temporalObj: any): Date | null => {
    if (!temporalObj) return null;
    if (temporalObj instanceof Date) return temporalObj;

    if (temporalObj.year && temporalObj.month && temporalObj.day) {
      return new Date(temporalObj.year, temporalObj.month - 1, temporalObj.day);
    }

    return null;
  };

  const formatToYYYYMMDD = (date: Date | null): string | null => {
    if (!date) return null;

    return date.toISOString().split("T")[0];
  };

  // Corregir la firma de la función para usar nuestro tipo DateRange
  const handleDateChange = (range: DateRange | null) => {
    if (!range) return;

    try {
      setDateRange(range);

      const startDate = convertToDate(range.start);
      const endDate = convertToDate(range.end);

      if (startDate && isNaN(startDate.getTime())) {
        return;
      }

      if (endDate && isNaN(endDate.getTime())) {
        return;
      }

      const formattedStart = formatToYYYYMMDD(startDate);
      const formattedEnd = formatToYYYYMMDD(endDate);

      if (onDateChange) {
        onDateChange(formattedStart, formattedEnd);
      }
    } catch {}
  };

  return (
    <div className={selectClasses}>
      <DateRangePicker
        aria-label="Seleccionar rango de fechas"
        calendarProps={{
          classNames: {
            base: "bg-background",
            headerWrapper: "bg-background",
            prevButton: "border-[1px] border-default-200 rounded-small",
            nextButton: "border-[1px] border-default-200 rounded-small",
            gridHeader:
              "bg-background shadow-none border-b-[1px] border-default-100",
            cellButton: [
              "data-[today=true]:bg-default-100",
              "data-[selected=true]:bg-primary",
              "data-[selected=true]:text-primary-foreground",
            ],
          },
        }}
        className={selectClasses}
        size="lg"
        value={dateRange}
        onChange={handleDateChange}
      />
    </div>
  );
}

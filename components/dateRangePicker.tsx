import { DateRangePicker } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

interface DatePickerProps {
  selectClasses?: string;
  onDateChange?: (startDate: string | null, endDate: string | null) => void;
}

export default function DatePicker({
  selectClasses,
  onDateChange,
}: DatePickerProps) {
  const { t } = useTranslation("botones");
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

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

  const handleDateChange = (range: { start: any; end: any }) => {
    try {
      const startDate = convertToDate(range?.start);
      const endDate = convertToDate(range?.end);

      if (startDate && isNaN(startDate.getTime())) {
        console.error("Invalid start date");
        return;
      }

      if (endDate && isNaN(endDate.getTime())) {
        console.error("Invalid end date");
        return;
      }

      setDateRange({ startDate, endDate });

      const formattedStart = formatToYYYYMMDD(startDate);
      const formattedEnd = formatToYYYYMMDD(endDate);

      if (onDateChange) {
        onDateChange(formattedStart, formattedEnd);
      }
    } catch (error) {
      console.error("Error processing dates:", error);
    }
  };

  return (
    <div className={selectClasses}>
      <DateRangePicker
        size="lg"
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
        placeholder={t("fecha")}
        className={selectClasses}
        value={dateRange}
        onChange={(range) => handleDateChange(range)}
      />
    </div>
  );
}

import { DateRangePicker } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

interface DatePickerProps {
  onDateChange: (start: string | null, end: string | null) => void;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  onDateChange,
  defaultStartDate,
  defaultEndDate,
}) => {
  const { t } = useTranslation("botones");
  const [_startDate, setStartDate] = useState<string | null>(
    defaultStartDate || null,
  );
  const [_endDate, setEndDate] = useState<string | null>(
    defaultEndDate || null,
  );

  // Set default date (today) when component mounts if no defaults provided
  useEffect(() => {
    if (defaultStartDate && defaultEndDate) {
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    } else {
      const today = new Date();
      const formattedToday = formatToYYYYMMDD(today);

      setStartDate(formattedToday);
      setEndDate(formattedToday);
      if (onDateChange) {
        onDateChange(formattedToday, formattedToday);
      }
    }
  }, []);

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

  const handleDateChange = (range: any) => {
    try {
      // Si range es null, usar la fecha actual
      if (!range) {
        const today = new Date();
        const formattedToday = formatToYYYYMMDD(today);

        setStartDate(formattedToday);

        setEndDate(formattedToday);
        if (onDateChange) {
          onDateChange(formattedToday, formattedToday);
        }

        return;
      }

      const startDateObj = convertToDate(range.start);
      const endDateObj = convertToDate(range.end);

      // Si alguna fecha no es válida, usar la fecha actual
      if (
        !startDateObj ||
        !endDateObj ||
        isNaN(startDateObj.getTime()) ||
        isNaN(endDateObj.getTime())
      ) {
        const today = new Date();
        const formattedToday = formatToYYYYMMDD(today);

        setStartDate(formattedToday);
        setEndDate(formattedToday);
        if (onDateChange) {
          onDateChange(formattedToday, formattedToday);
        }

        return;
      }

      const formattedStart = formatToYYYYMMDD(startDateObj);
      const formattedEnd = formatToYYYYMMDD(endDateObj);

      // Update local state
      setStartDate(formattedStart);
      setEndDate(formattedEnd);

      if (onDateChange) {
        onDateChange(formattedStart, formattedEnd);
      }
    } catch {
      // Si ocurre un error, usar la fecha actual
      const today = new Date();
      const formattedToday = formatToYYYYMMDD(today);

      setStartDate(formattedToday);
      setEndDate(formattedToday);
      if (onDateChange) {
        onDateChange(formattedToday, formattedToday);
      }
    }
  };

  return <DateRangePicker label={t("fecha")} onChange={handleDateChange} />;
};

export default DatePicker;

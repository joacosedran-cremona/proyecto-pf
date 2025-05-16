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

  // Only set the initial values once, not on every defaultDate change
  useEffect(() => {
    if (defaultStartDate && defaultEndDate) {
      // Initialize with defaults, but don't call onDateChange here
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, []); // Empty dependency array means this runs once on mount

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
      const startDateObj = convertToDate(range?.start);
      const endDateObj = convertToDate(range?.end);

      if (startDateObj && isNaN(startDateObj.getTime())) {
        return;
      }

      if (endDateObj && isNaN(endDateObj.getTime())) {
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
    } catch {}
  };

  return (
    <DateRangePicker
      label={t("fecha")}
      onChange={(range) => handleDateChange(range)}
      // You may need to add a value prop based on startDate and endDate
      // if your DateRangePicker component supports controlled behavior
    />
  );
};

export default DatePicker;

import {DateRangePicker} from "@heroui/react";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface DatePickerProps {
  selectClasses?: string;
  onDateChange: (start: string | null, end: string | null) => void;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ 
  selectClasses, 
  onDateChange,
  defaultStartDate,
  defaultEndDate
}) => {
  const { t } = useTranslation('botones');
  const [startDate, setStartDate] = useState<string | null>(defaultStartDate || null);
  const [endDate, setEndDate] = useState<string | null>(defaultEndDate || null);

  useEffect(() => {
    if (defaultStartDate && defaultEndDate) {
      onDateChange(defaultStartDate, defaultEndDate);
    }
  }, [defaultStartDate, defaultEndDate, onDateChange]);

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
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (range: { start: any; end: any }) => {
    try {
      const startDate = convertToDate(range?.start);
      const endDate = convertToDate(range?.end);

      if (startDate && isNaN(startDate.getTime())) {
        console.error('Invalid start date');
        return;
      }

      if (endDate && isNaN(endDate.getTime())) {
        console.error('Invalid end date');
        return;
      }

      setDateRange({ startDate, endDate });

      const formattedStart = formatToYYYYMMDD(startDate);
      const formattedEnd = formatToYYYYMMDD(endDate);

      if (onDateChange) {
        onDateChange(formattedStart, formattedEnd);
      }
    } catch (error) {
      console.error('Error processing dates:', error);
    }
  };
    return <DateRangePicker
                label={t('fecha')}
                onChange={(range) => handleDateChange(range)}
            />;
}

export default DatePicker;

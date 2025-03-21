import {DateRangePicker} from "@heroui/react";
import { useTranslation } from 'react-i18next';

interface DatePickerProps {
  selectClasses?: string;
}

export default function DatePicker({ selectClasses }: DatePickerProps) {
  const { t } = useTranslation('botones');
  return (
    <div className={selectClasses}>
      <DateRangePicker
        calendarProps={{
          classNames: {
            base: "bg-background",
            headerWrapper: "pt-2 bg-background",
            prevButton: "border-1 border-default-200 rounded-small",
            nextButton: "border-1 border-default-200 rounded-small",
            gridHeader: "bg-background shadow-none border-b-1 border-default-100",
            cellButton: [
              "data-[today=true]:bg-default-100 data-[selected=true]:bg-transparent rounded-small",
              // start (pseudo)
              "data-[range-start=true]:before:rounded-l-small",
              "data-[selection-start=true]:before:rounded-l-small",
              // end (pseudo)
              "data-[range-end=true]:before:rounded-r-small",
              "data-[selection-end=true]:before:rounded-r-small",
              // start (selected)
              "data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:rounded-small",
              // end (selected)
              "data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:rounded-small",
            ],
          },
        }}
        radius="sm"
        className="w-full h-full"
        label={t('fecha')}
        variant="bordered"
      />
    </div>
    
  );
}

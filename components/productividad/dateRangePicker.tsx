import {DateRangePicker} from "@heroui/react";

export default function App() {
  return (
    <div className="w-full h-1/4">
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
        radius="md"
        className="w-full h-full"
        label="Elija un rango de fechas"
        variant="bordered"
      />
    </div>
    
  );
}

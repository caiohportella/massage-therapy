import * as React from "react";
import { format, setHours, setMinutes } from "date-fns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date) => void;
  minutesStep?: number;
  className?: string;
}

const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  ({ date, setDate, minutesStep = 1, className, ...props }, ref) => {
    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const [hours, minutes] = event.target.value.split(":").map(Number);
      let newDate = date || new Date();
      newDate = setHours(newDate, hours);
      newDate = setMinutes(newDate, minutes);
      setDate(newDate);
    };

    return (
      <Input
        type="time"
        value={date ? format(date, "HH:mm") : ""}
        onChange={handleTimeChange}
        step={minutesStep * 60} // input step is in seconds
        className={cn("w-full", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
TimePicker.displayName = "TimePicker";

export { TimePicker };

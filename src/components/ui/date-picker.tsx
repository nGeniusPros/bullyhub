"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  showTimeSelect?: boolean;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export function DatePicker({
  selected,
  onChange,
  placeholderText = "Select date",
  showTimeSelect = false,
  dateFormat = "PPP",
  minDate,
  maxDate,
  disabled = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, dateFormat) : placeholderText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onChange}
          initialFocus
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
        />
        {showTimeSelect && selected && (
          <div className="p-3 border-t">
            <div className="flex items-center justify-center">
              <input
                type="time"
                className="border rounded p-1"
                value={selected ? format(selected, "HH:mm") : ""}
                onChange={(e) => {
                  if (!selected) return;
                  const [hours, minutes] = e.target.value.split(":");
                  const newDate = new Date(selected);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  onChange(newDate);
                }}
              />
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

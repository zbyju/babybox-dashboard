"use client";

import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";
import { SelectSingleEventHandler } from "react-day-picker";
import { cs } from "date-fns/locale";

export function DatePicker({
  date,
  onChange,
}: {
  onChange: SelectSingleEventHandler;
  date: Date | undefined;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale: cs })
          ) : (
            <span>Vyberte datum</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          locale={cs}
          mode="single"
          selected={date}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

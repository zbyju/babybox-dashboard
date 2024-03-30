"use client";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { addDays, format, parse } from "date-fns";
import { CalendarRange } from "lucide-react";
import { useState } from "react";

export type DateRange = {
  from: string;
  to: string;
};

interface Props {
  dateRange: DateRange;
  onChange: (dateRange: DateRange) => unknown;
}

export function dateToStringDate(str: Date): string {
  return format(str, "yyyy-MM-dd");
}

export default function TimeFilter(props: Props) {
  const [dateRange, setDateRange] = useState<DateRange>(props.dateRange);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="lg" className="inline-flex flex-row gap-2">
          <CalendarRange size="24" />
          Kalendář
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto">
          <DrawerHeader>
            <DrawerTitle className="text-center">
              Nastavení časového rozsahu
            </DrawerTitle>
            <DrawerDescription className="text-center">
              Nastavte časový rozsah, ve kterém budou zobrazena data.
            </DrawerDescription>
          </DrawerHeader>

          <div className="mx-auto flex flex-row justify-center">
            <DateRangePicker
              date={{
                from: parse(dateRange.from, "yyyy-MM-dd", new Date()),
                to: parse(dateRange.to, "yyyy-MM-dd", new Date()),
              }}
              onDateChange={(val) => {
                if (
                  val === undefined ||
                  (val.from === undefined && val.to === undefined)
                ) {
                  setDateRange({
                    from: dateToStringDate(addDays(new Date(), -3)),
                    to: dateToStringDate(new Date()),
                  });
                } else if (val.to !== undefined && val.from === undefined) {
                  setDateRange({
                    from: dateToStringDate(val.to),
                    to: dateToStringDate(val.to),
                  });
                } else if (val.from !== undefined && val.to === undefined) {
                  setDateRange({
                    from: dateToStringDate(val.from),
                    to: dateToStringDate(val.from),
                  });
                } else {
                  setDateRange({
                    // @ts-expect-error typescript is stupid
                    from: dateToStringDate(val.from),
                    // @ts-expect-error typescript is stupid
                    to: dateToStringDate(val.to),
                  });
                }
              }}
            />
          </div>

          <div className="mx-auto mt-2 flex flex-row flex-wrap justify-center gap-2">
            {/* TODO: Check if buttons set the correct date based on backend implementation */}
            <Button
              size="sm"
              className="text-xs"
              variant="secondary"
              onClick={() =>
                setDateRange({
                  from: dateToStringDate(addDays(new Date(), -0)),
                  to: dateToStringDate(new Date()),
                })
              }
            >
              Poslední den
            </Button>
            <Button
              size="sm"
              className="text-xs"
              variant="secondary"
              onClick={() =>
                setDateRange({
                  from: dateToStringDate(addDays(new Date(), -2)),
                  to: dateToStringDate(new Date()),
                })
              }
            >
              Poslední 3 dny
            </Button>
            <Button
              size="sm"
              className="text-xs"
              variant="secondary"
              onClick={() =>
                setDateRange({
                  from: dateToStringDate(addDays(new Date(), -7)),
                  to: dateToStringDate(new Date()),
                })
              }
            >
              Poslední týden
            </Button>
            <Button
              size="sm"
              className="text-xs"
              variant="secondary"
              onClick={() =>
                setDateRange({
                  from: dateToStringDate(addDays(new Date(), -14)),
                  to: dateToStringDate(new Date()),
                })
              }
            >
              Poslední 2 týdny
            </Button>
          </div>

          <DrawerFooter>
            <div className="flex flex-row flex-wrap justify-center gap-4">
              <DrawerClose asChild>
                <div className="flex flex-row flex-wrap gap-4">
                  <Button onClick={() => props.onChange(dateRange)}>
                    Načíst data
                  </Button>
                  <Button variant="outline">Storno</Button>
                </div>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

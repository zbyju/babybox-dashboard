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
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

export default function TimeFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [dateRange, setDateRange] = useState<{
    from: string;
    to: string;
  }>({
    from: dateToStringDate(addDays(new Date(), -3)),
    to: dateToStringDate(new Date()),
  });

  function dateToStringDate(str: Date): string {
    return format(str, "dd-MM-yyyy");
  }

  useEffect(() => {
    if (searchParams === null) return;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let newVal = {
      ...dateRange,
    };
    if (from !== null) {
      newVal.from = from;
    }
    if (to !== null) {
      newVal.to = to;
    }

    setDateRange(newVal);
  }, [searchParams]);

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
                from: parse(dateRange.from, "dd-MM-yyyy", new Date()),
                to: parse(dateRange.to, "dd-MM-yyyy", new Date()),
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
                    // @ts-ignore
                    from: dateToStringDate(val.from),
                    // @ts-ignore
                    to: dateToStringDate(val.to),
                  });
                }
              }}
            />
          </div>

          <DrawerFooter>
            <div className="flex flex-row flex-wrap justify-center gap-4">
              <DrawerClose asChild>
                <div>
                  <Button
                    onClick={() => {
                      router.push(
                        `?${new URLSearchParams({
                          from: dateRange.from,
                          to: dateRange.to,
                        })}`,
                      );
                    }}
                  >
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

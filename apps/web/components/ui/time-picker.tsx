"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "./time-picker-input";
import { Button } from "./button";

interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: Props) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-end justify-between gap-2">
      <div className="flex items-end gap-2">
        <div className="grid gap-1 text-center">
          <Label htmlFor="hours" className="text-xs">
            Hodiny
          </Label>
          <TimePickerInput
            picker="hours"
            date={date}
            setDate={setDate}
            ref={hourRef}
            onRightFocus={() => minuteRef.current?.focus()}
          />
        </div>
        <div className="grid gap-1 text-center">
          <Label htmlFor="minutes" className="text-xs">
            Minuty
          </Label>
          <TimePickerInput
            picker="minutes"
            date={date}
            setDate={setDate}
            ref={minuteRef}
            onLeftFocus={() => hourRef.current?.focus()}
            onRightFocus={() => secondRef.current?.focus()}
          />
        </div>
        <div className="grid gap-1 text-center">
          <Label htmlFor="seconds" className="text-xs">
            Sekundy
          </Label>
          <TimePickerInput
            picker="seconds"
            date={date}
            setDate={setDate}
            ref={secondRef}
            onLeftFocus={() => minuteRef.current?.focus()}
          />
        </div>
      </div>
      <div className="flex h-10 items-center">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setDate(new Date())}
        >
          Dnes
        </Button>
      </div>
    </div>
  );
}

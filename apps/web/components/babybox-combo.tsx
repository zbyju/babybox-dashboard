"use client";

import { ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BabyboxesContext } from "./contexts/babyboxes-context";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import Link from "next/link";

export function BabyboxCombo() {
  const [open, setOpen] = useState(false);
  const babyboxes = useContext(BabyboxesContext);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          Vyberte Babybox...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Vyhledejte Babybox" />
          <CommandEmpty>Žádny babybox nenalezen.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {babyboxes.map((babybox) => (
              <Link
                className="cursor-pointer"
                key={babybox.slug}
                href={"/app/babybox/" + babybox.slug}
              >
                <CommandItem
                  value={babybox.slug}
                  onSelect={() => {
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {babybox.name}
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

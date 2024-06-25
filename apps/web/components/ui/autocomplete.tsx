import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "./input";

interface Props {
  value: string;
  onChange: (value: string) => unknown;
  values: { value: string; label: string }[];
  searchLabel?: string;
  emptyLabel?: string;
  chooseLabel?: string;
}

export default function Autocomplete({
  values,
  value,
  onChange,
  emptyLabel = "Nenalezeno",
  searchLabel = "Vyhledejte...",
  chooseLabel = "Vyberte...",
}: Props) {
  const [open, setOpen] = useState(false);
  const filteredValues = values.filter(
    (v) => !value || v.value.toLowerCase().includes(value.toLowerCase()),
  );

  const items =
    filteredValues && filteredValues.length > 0 ? (
      filteredValues.map((value) => (
        <CommandItem
          key={value.value}
          value={value.value}
          onSelect={(_) => {
            // Command automatically converts values to lowercase => using the original value instead
            onChange(value.value);
            setOpen(false);
          }}
          className="cursor-pointer"
        >
          {value.label}
        </CommandItem>
      ))
    ) : (
      <CommandEmpty className="py-2 text-center text-muted-foreground">
        {emptyLabel}
      </CommandEmpty>
    );

  return (
    <Popover open={open}>
      <span>
        <PopoverTrigger>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            role="combobox"
            aria-expanded={open}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            className="w-[200px] justify-between"
          />
        </PopoverTrigger>
      </span>
      <PopoverContent
        className="w-[200px] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {items}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

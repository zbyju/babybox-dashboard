import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Props {
  values: { value: string; label: string }[] | string[];
  selected:
    | { value: string; label: string }
    | { value: string; label: string }[]
    | undefined;
  onSelect: (selectedValue: string | string[]) => void;
  searchLabel?: string;
  emptyLabel?: string;
  chooseLabel?: string;
}

export default function Combobox({
  values,
  selected,
  onSelect,
  emptyLabel = "Nenalezeno",
  searchLabel = "Vyhledejte...",
  chooseLabel = "Vyberte...",
}: Props) {
  const [open, setOpen] = useState(false);

  const normalizedValues =
    typeof values[0] === "string"
      ? (values as string[]).map((v) => ({ value: v, label: v }))
      : (values as { label: string; value: string }[]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {Array.isArray(selected)
            ? "Počet vybraných: " + selected.length
            : selected
              ? selected.label
              : chooseLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchLabel} />
          <CommandEmpty>{emptyLabel}</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {normalizedValues.map((value) => (
              <CommandItem
                key={value.value}
                value={value.value}
                onSelect={(currentValue) => {
                  if (Array.isArray(selected)) {
                    if (selected.find((x) => x.value === currentValue)) {
                      onSelect(
                        selected
                          .filter((x) => x.value !== currentValue)
                          .map((x) => x.value),
                      );
                    } else {
                      onSelect(
                        selected
                          .concat({ value: currentValue, label: currentValue })
                          .map((x) => x.value),
                      );
                    }
                    return;
                  }
                  onSelect(
                    currentValue === selected?.value ? "" : currentValue,
                  );
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                {Array.isArray(selected) &&
                selected.find((x) => x.value === value.value) ? (
                  <>
                    <Check height="16" /> {value.label}
                  </>
                ) : (
                  value.label
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

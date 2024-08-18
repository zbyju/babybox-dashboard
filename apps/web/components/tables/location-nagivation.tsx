import { Command, CommandGroup, CommandItem } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { BabyboxesContext } from "../contexts/babyboxes-context";
import { BabyboxAddress } from "@/types/babybox.types";
import { ChevronsUpDown } from "lucide-react";
import { useContext, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

interface Props {
  slug: string;
  location?: BabyboxAddress;
}

export default function LocationNavigation({ slug, location }: Props) {
  const [open, setOpen] = useState(false);
  const { getBabyboxBySlug } = useContext(BabyboxesContext);
  const name = getBabyboxBySlug(slug)?.name || slug;
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            Navigovat k babyboxu
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {location?.coordinates && (
                <>
                  <a
                    target="_blank"
                    href={`https://www.google.com/maps/place/${location.coordinates.latitude},${location.coordinates.longitude}`}
                  >
                    <CommandItem className="cursor-pointer">
                      Google Maps Souřadnice
                    </CommandItem>
                  </a>
                  <a
                    target="_blank"
                    href={`https://mapy.cz/zakladni?y=${location.coordinates.latitude}&x=${location.coordinates.longitude}&z=18`}
                  >
                    <CommandItem className="cursor-pointer">
                      Mapy.cz Souřadnice
                    </CommandItem>
                  </a>
                  <a
                    target="_blank"
                    href={`https://waze.com/ul?ll=${location.coordinates.latitude},${location.coordinates?.longitude}`}
                  >
                    <CommandItem className="cursor-pointer">
                      Waze Souřadnice
                    </CommandItem>
                  </a>
                  <a
                    target="_blank"
                    href={`https://maps.apple.com/?ll=${location.coordinates.latitude},${location.coordinates.longitude}`}
                  >
                    <CommandItem className="cursor-pointer">
                      Apple Maps Souřadnice
                    </CommandItem>
                  </a>
                  <Separator className="my-1" />
                </>
              )}

              <a
                target="_blank"
                href={`https://www.google.com/maps/search/?api=1&query=Babybox+${name}`}
              >
                <CommandItem className="cursor-pointer">
                  Google Maps Vyhledání
                </CommandItem>
              </a>
              <a
                target="_blank"
                href={`https://mapy.cz/zakladni?q=Babybox+${name}`}
              >
                <CommandItem className="cursor-pointer">
                  Mapy.cz Vyhledání
                </CommandItem>
              </a>
              <a target="_blank" href={`https://waze.com/ul?q=Babybox+${name}`}>
                <CommandItem className="cursor-pointer">
                  Waze Vyhledání
                </CommandItem>
              </a>
              <a
                target="_blank"
                href={`https://maps.apple.com/?q=Babybox+${name}`}
              >
                <CommandItem className="cursor-pointer">
                  Apple Maps Vyhledání
                </CommandItem>
              </a>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

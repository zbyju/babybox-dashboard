import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cog } from "lucide-react";
import { useState } from "react";

export interface ChartSettingsObject {
  strokeWidth: number;
  strokeType: "straight" | "smooth" | "monotoneCubic";
}

interface Props {
  settings: ChartSettingsObject;
  onChange: (val: ChartSettingsObject) => any;
}

export default function ChartSettings(props: Props) {
  const [settings, setSettings] = useState({ ...props.settings });

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="lg" className="inline-flex flex-row gap-2">
          <Cog size="24" />
          Nastavení grafu
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto">
          <DrawerHeader>
            <DrawerTitle className="text-center">
              Nastavení prvků grafu
            </DrawerTitle>
            <DrawerDescription className="text-center">
              Změňte různé detaily pro vykreslování grafu.
            </DrawerDescription>
          </DrawerHeader>

          <div className="mx-auto flex flex-row flex-wrap justify-center gap-4">
            <div>
              <Label htmlFor="strokeWidth">Šířka tahu</Label>
              <Input
                type="number"
                placeholder="1"
                value={settings.strokeWidth}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setSettings({ ...settings, strokeWidth: val });
                }}
              />
            </div>
            <div>
              <Label htmlFor="strokeWidth">Typ tahu</Label>
              <Select
                value={settings.strokeType}
                onValueChange={(val) =>
                  //@ts-ignore
                  setSettings({ ...settings, strokeType: val })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Vyberte typ tahu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Typy tahu</SelectLabel>
                    <SelectItem value="straight">Rovný</SelectItem>
                    <SelectItem value="smooth">Hladký</SelectItem>
                    <SelectItem value="monotoneCubic">
                      Kubicky hladký
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DrawerFooter>
            <div className="flex flex-row flex-wrap justify-center gap-4">
              <DrawerClose asChild>
                <div>
                  <Button onClick={() => props.onChange(settings)}>
                    Načíst
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSettings(props.settings)}
                  >
                    Storno
                  </Button>
                </div>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

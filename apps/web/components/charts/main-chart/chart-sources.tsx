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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ListCollapse } from "lucide-react";
import { useState } from "react";

export interface ChartSourcesObject {
  temperature: boolean;
  voltage: boolean;
  heating: boolean;
  fans: boolean;
  doors: boolean;
  temperatureSetting: boolean;
  sun: boolean;
}

interface Props {
  sources: ChartSourcesObject;
  onChange: (val: ChartSourcesObject) => unknown;
}

export default function ChartSources(props: Props) {
  const [sources, setSources] = useState({
    ...props.sources,
  });

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="lg" className="inline-flex flex-row gap-2">
          <ListCollapse size="24" />
          Zdroje dat
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto">
          <DrawerHeader>
            <DrawerTitle className="text-center">
              Zobrazení/Skrytí dat grafu
            </DrawerTitle>
            <DrawerDescription className="text-center">
              Změňte, co bude zobrazeno a co bude skryto v grafu.
            </DrawerDescription>
          </DrawerHeader>

          <div className="mx-auto flex flex-row justify-center gap-14">
            <div className="flex flex-col items-start gap-2">
              <h5 className="text-lg font-semibold">Data</h5>
              <div className="flex items-center space-x-2">
                <Switch
                  id="temperatures"
                  checked={sources.temperature}
                  onCheckedChange={(val) =>
                    setSources({ ...sources, temperature: val })
                  }
                />
                <Label htmlFor="temperatures">Teploty</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="voltages"
                  checked={sources.voltage}
                  onCheckedChange={(val) =>
                    setSources({ ...sources, voltage: val })
                  }
                />
                <Label htmlFor="voltages">Napětí</Label>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2">
              <h5 className="text-lg font-semibold">Události</h5>
              <div className="flex items-center space-x-2">
                <Switch
                  id="heating"
                  checked={sources.heating}
                  onCheckedChange={(val) =>
                    setSources({ ...sources, heating: val })
                  }
                />
                <Label htmlFor="heating">Topení</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="fans"
                  checked={sources.fans}
                  onCheckedChange={(val) =>
                    setSources({ ...sources, fans: val })
                  }
                />
                <Label htmlFor="doors">Větráky</Label>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <div className="mb-4 flex flex-row flex-wrap justify-center gap-4 lg:mb-0">
              <DrawerClose asChild>
                <div className="flex flex-row flex-wrap gap-4">
                  <Button
                    onClick={() => setTimeout(() => props.onChange(sources), 1)}
                  >
                    Načíst
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSources(props.sources)}
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

"use client";

import { BabyboxNetworkConfiguration } from "@/types/babybox.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Network } from "lucide-react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Props {
  networkConfiguration: BabyboxNetworkConfiguration | undefined;
  onClick: (newNetworkConfiguration: BabyboxNetworkConfiguration) => void;
}

export default function NetworkConfigurationEdit(props: Props) {
  const [networkConfiguration, setNetworkConfiguration] =
    useState<BabyboxNetworkConfiguration>(
      props.networkConfiguration ?? {
        type: "vlan",
        ip_addresses: {
          router: "",
          engine_unit: "",
          thermal_unit: "",
          camera: "",
          pc: "",
          gateway: "",
        },
      },
    );

  function handleSaveClicked(): void {
    toast.error("Error when saivng");
  }

  return (
    <Card className="min-w-[300px] max-w-[400px] flex-grow">
      <CardHeader>
        <CardTitle>
          <span className="flex flex-row items-center gap-1">
            <Network /> Síťová Konfigurace
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 pl-1">
          <div className="flex flex-col gap-2">
            <Label htmlFor="type" className="leading-3 text-muted-foreground">
              Typ síťového zapojení:
            </Label>
            <Select
              value={networkConfiguration.type}
              onValueChange={(val) =>
                setNetworkConfiguration({
                  ...networkConfiguration,
                  // @ts-expect-error select types
                  type: val,
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Vyberte typ zapojení" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Typy zapojení</SelectLabel>
                  <SelectItem value="vlan">VLAN</SelectItem>
                  <SelectItem value="routing">Routování</SelectItem>
                  <SelectItem value="lan">LAN - Síť nemocnice</SelectItem>
                  <SelectItem value="custom">Vlastní</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="router" className="leading-3 text-muted-foreground">
              Router:
            </Label>
            <Input
              id="router"
              onChange={(e) =>
                setNetworkConfiguration({
                  ...networkConfiguration,
                  ip_addresses: {
                    ...networkConfiguration.ip_addresses,
                    router: e.target.value,
                  },
                })
              }
              value={networkConfiguration.ip_addresses.router}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="engine" className="leading-3 text-muted-foreground">
              Motorová jednotka:
            </Label>
            <Input
              id="engine"
              value={networkConfiguration.ip_addresses.engine_unit}
              onChange={(e) =>
                setNetworkConfiguration({
                  ...networkConfiguration,
                  ip_addresses: {
                    ...networkConfiguration.ip_addresses,
                    engine_unit: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="thermal"
              className="leading-3 text-muted-foreground"
            >
              Jednotka topení:
            </Label>
            <Input
              id="thermal"
              value={networkConfiguration.ip_addresses.thermal_unit}
              onChange={(e) =>
                setNetworkConfiguration({
                  ...networkConfiguration,
                  ip_addresses: {
                    ...networkConfiguration.ip_addresses,
                    thermal_unit: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="camera" className="leading-3 text-muted-foreground">
              Kamera:
            </Label>
            <Input
              id="camera"
              value={networkConfiguration.ip_addresses.camera}
              onChange={(e) =>
                setNetworkConfiguration({
                  ...networkConfiguration,
                  ip_addresses: {
                    ...networkConfiguration.ip_addresses,
                    camera: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pc" className="leading-3 text-muted-foreground">
              PC:
            </Label>
            <Input
              id="pc"
              value={networkConfiguration.ip_addresses.pc}
              onChange={(e) =>
                setNetworkConfiguration({
                  ...networkConfiguration,
                  ip_addresses: {
                    ...networkConfiguration.ip_addresses,
                    pc: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="gateway"
              className="leading-3 text-muted-foreground"
            >
              Gateway:
            </Label>
            <Input
              id="gateway"
              value={networkConfiguration.ip_addresses.gateway}
              onChange={(e) =>
                setNetworkConfiguration({
                  ...networkConfiguration,
                  ip_addresses: {
                    ...networkConfiguration.ip_addresses,
                    gateway: e.target.value,
                  },
                })
              }
            />
          </div>
          <Label htmlFor="note" className="leading-3 text-muted-foreground">
            Poznámka:
          </Label>
          <Textarea
            className=""
            id="note"
            value={networkConfiguration.note || ""}
            onChange={(e) =>
              setNetworkConfiguration({
                ...networkConfiguration,
                note: e.target.value,
              })
            }
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row flex-wrap gap-2">
          <Button onClick={() => props.onClick(networkConfiguration)}>
            Uložit
          </Button>
          <Button
            onClick={() =>
              setNetworkConfiguration(
                props.networkConfiguration ?? {
                  type: "vlan",
                  ip_addresses: {
                    router: "",
                    engine_unit: "",
                    thermal_unit: "",
                    camera: "",
                    pc: "",
                    gateway: "",
                  },
                },
              )
            }
            variant="secondary"
          >
            Storno
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

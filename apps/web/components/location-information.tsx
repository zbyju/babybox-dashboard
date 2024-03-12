"use client";

import { BabyboxAddress } from "@/types/babybox.types";
import OptionalRender from "./optional-render";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Copy, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface Props {
  address: BabyboxAddress;
}

export default function LocationInformation(props: Props) {
  function handleCopyCoordinates(): void {
    navigator.clipboard.writeText(
      props.address.coordinates?.latitude +
        ", " +
        props.address.coordinates?.longitude,
    );
    toast("Souřadnice byly zkopírovány.");
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>
          <span className="flex flex-row items-center gap-1">
            <MapPin /> Umístění
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 pl-1">
          <OptionalRender content={props.address.hospital}>
            <div className="flex flex-col">
              <span className="leading-3 text-muted-foreground">
                Nemocnice:{" "}
              </span>
              <span className="text-lg">{props.address.hospital}</span>
            </div>
          </OptionalRender>
          <OptionalRender content={props.address.city}>
            <div className="flex flex-col">
              <span className="leading-3 text-muted-foreground">Město:</span>
              <span className="text-lg">{props.address.city}</span>
            </div>
          </OptionalRender>
          <OptionalRender content={props.address.street}>
            <div className="flex flex-col">
              <span className="leading-3 text-muted-foreground">Ulice:</span>
              <span className="text-lg">{props.address.street}</span>
            </div>
          </OptionalRender>
          <OptionalRender content={props.address.postcode}>
            <div className="flex flex-col">
              <span className="leading-3 text-muted-foreground">
                Směrovací číslo:
              </span>
              <span className="text-lg">{props.address.postcode}</span>
            </div>
          </OptionalRender>

          <OptionalRender content={props.address.coordinates}>
            <div className="flex flex-col">
              <div className="mb-3 flex flex-row flex-wrap items-center gap-2">
                <Button
                  size="icon"
                  className="h-7 w-7 rounded-sm"
                  onClick={() => handleCopyCoordinates()}
                >
                  <Copy size="14" />
                </Button>
                <span className="text-muted-foreground">Souřadnice:</span>
              </div>

              <span className="leading-3 text-muted-foreground">
                Zeměpisná šířka
              </span>
              <span className="mb-1 text-lg">
                {props.address.coordinates?.latitude}
              </span>
              <span className="leading-3 text-muted-foreground">
                Zeměpisná délka
              </span>
              <span className="text-lg">
                {props.address.coordinates?.longitude}
              </span>
              <div className="mt-2 flex w-full flex-row flex-wrap gap-x-3 gap-y-2">
                <a
                  target="_blank"
                  href={`https://www.google.com/maps/place/${props.address.coordinates?.latitude},${props.address.coordinates?.longitude}`}
                >
                  <Button className="bg-green-500 transition duration-500 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-500">
                    Google Maps
                  </Button>
                </a>
                <a
                  target="_blank"
                  href={`https://en.mapy.cz/zakladni?y=${props.address.coordinates?.latitude}&x=${props.address.coordinates?.longitude}&z=18`}
                >
                  <Button className="bg-lime-500 transition duration-500 hover:bg-lime-400 dark:bg-lime-600 dark:hover:bg-lime-500">
                    Mapy.cz
                  </Button>
                </a>
              </div>
            </div>
          </OptionalRender>
        </div>
      </CardContent>
    </Card>
  );
}

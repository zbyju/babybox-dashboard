"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { BabyboxAddress } from "@/types/babybox.types";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  address: BabyboxAddress | undefined;
  onClick: (newAddress: BabyboxAddress) => void;
}

export default function LocationInformationEdit(props: Props) {
  const [address, setAddress] = useState<BabyboxAddress>(
    props.address ?? {
      hospital: "",
      street: "",
      postcode: "",
    },
  );

  function handleLoadLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress({
          ...address,
          coordinates: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
        });
        toast.success("Poloha úspěšně načtena.");
      },
      (err) => {
        console.error(err);
        toast.error("Chyba při získávání polohy.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  return (
    <Card className="min-w-[300px] max-w-[400px] flex-grow">
      <CardHeader>
        <CardTitle>
          <span className="flex flex-row items-center gap-1">
            <MapPin /> Umístění
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 pl-1">
          <div className="flex flex-col">
            <Label
              htmlFor="postcode"
              className="mb-2 leading-3 text-muted-foreground"
            >
              Nemocnice:
            </Label>
            <Input
              id="postcode"
              value={address.hospital}
              onChange={(e) =>
                setAddress({
                  ...address,
                  hospital: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col">
            <Label
              htmlFor="postcode"
              className="mb-2 leading-3 text-muted-foreground"
            >
              Město:
            </Label>
            <Input
              id="city"
              value={address.city}
              onChange={(e) =>
                setAddress({
                  ...address,
                  city: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col">
            <Label
              htmlFor="street"
              className="mb-2 leading-3 text-muted-foreground"
            >
              Ulice:
            </Label>
            <Input
              id="postcode"
              value={address.street}
              onChange={(e) =>
                setAddress({
                  ...address,
                  street: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col">
            <Label
              htmlFor="postcode"
              className="mb-2 leading-3 text-muted-foreground"
            >
              Směrovací číslo:
            </Label>
            <Input
              id="postcode"
              value={address.postcode}
              onChange={(e) =>
                setAddress({
                  ...address,
                  postcode: e.target.value,
                })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-row flex-wrap items-center gap-2">
              <Switch
                id="coordinatesSwitch"
                checked={address.coordinates !== undefined}
                onCheckedChange={(val) => {
                  setAddress({
                    ...address,
                    coordinates:
                      val === true
                        ? {
                            latitude:
                              props.address?.coordinates?.latitude || "",
                            longitude:
                              props.address?.coordinates?.longitude || "",
                          }
                        : undefined,
                  });
                }}
              />
              <Label
                htmlFor="coordinatesSwitch"
                className="text-muted-foreground"
              >
                Souřadnice:
              </Label>
            </div>

            {address.coordinates !== undefined ? (
              <>
                <Button
                  onClick={handleLoadLocation}
                  size="sm"
                  className="my-2"
                  variant={"secondary"}
                >
                  Načíst moji polohu
                </Button>
                <Label
                  htmlFor="latitude"
                  className="leading-3 text-muted-foreground"
                >
                  Zeměpisná šířka
                </Label>
                <Input
                  id="latitude"
                  className="mb-2 text-lg"
                  value={address.coordinates?.latitude || ""}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      coordinates: {
                        latitude: e.target.value || "",
                        longitude: address.coordinates?.longitude || "",
                      },
                    })
                  }
                />
                <Label
                  htmlFor="longitude"
                  className="leading-3 text-muted-foreground"
                >
                  Zeměpisná délka
                </Label>
                <Input
                  id="longitude"
                  className="mb-2 text-lg"
                  value={address.coordinates?.longitude || ""}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      coordinates: {
                        latitude: address.coordinates?.latitude || "",
                        longitude: e.target.value || "",
                      },
                    })
                  }
                />
              </>
            ) : null}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row flex-wrap gap-2">
          <Button
            onClick={() => {
              const addressToSave = { ...address };
              if (
                addressToSave.coordinates?.latitude &&
                typeof addressToSave.coordinates.latitude === "string"
              ) {
                addressToSave.coordinates.latitude = Number.parseFloat(
                  addressToSave.coordinates.latitude,
                );
              }
              if (
                addressToSave.coordinates?.longitude &&
                typeof addressToSave.coordinates.longitude === "string"
              ) {
                addressToSave.coordinates.longitude = Number.parseFloat(
                  addressToSave.coordinates.longitude,
                );
              }
              props.onClick(address);
            }}
          >
            Uložit
          </Button>
          <Button
            onClick={() =>
              setAddress(
                props.address || {
                  hospital: "",
                  street: "",
                  postcode: "",
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

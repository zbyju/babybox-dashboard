"use client";

import { BabyboxAddress } from "@/types/babybox.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { useState } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface Props {
  address: BabyboxAddress;
}

export default function LocationInformationEdit(props: Props) {
  const [address, setAddress] = useState<BabyboxAddress>(props.address);

  function handleSaveClicked(): void {
    toast.error("Error saving data");
    console.log(address);
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
                            latitude: props.address.coordinates?.latitude || 0,
                            longitude:
                              props.address.coordinates?.longitude || 0,
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
                        latitude: parseFloat(e.target.value) || 0,
                        longitude:
                          address.coordinates?.longitude ||
                          props.address.coordinates?.longitude ||
                          0,
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
                        latitude:
                          address.coordinates?.latitude ||
                          props.address.coordinates?.latitude ||
                          0,
                        longitude: parseFloat(e.target.value) || 0,
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
          <Button onClick={() => handleSaveClicked()}>Uložit</Button>
          <Button onClick={() => setAddress(props.address)} variant="secondary">
            Storno
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

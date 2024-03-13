"use client";

import { BabyboxNetworkConfiguration } from "@/types/babybox.types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Network } from "lucide-react";
import OptionalRender from "./optional-render";

interface Props {
  networkConfiguration: BabyboxNetworkConfiguration;
}

export default function NetworkConfiguration(props: Props) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>
          <span className="flex flex-row items-center gap-1">
            <Network /> Síťová Konfigurace
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 pl-1">
          <div className="flex flex-col">
            <span className="leading-3 text-muted-foreground">Nemocnice:</span>
            <span className="text-lg">{props.networkConfiguration.type}</span>
          </div>
          <div className="flex flex-col">
            <span className="leading-3 text-muted-foreground">Router:</span>
            <span className="text-lg">
              {props.networkConfiguration.ip.router}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="leading-3 text-muted-foreground">
              Motorová jednotka:
            </span>
            <span className="text-lg">
              {props.networkConfiguration.ip.engineUnit}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="leading-3 text-muted-foreground">
              Jednotka topení:
            </span>
            <span className="text-lg">
              {props.networkConfiguration.ip.thermalUnit}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="leading-3 text-muted-foreground">Kamera:</span>
            <span className="text-lg">
              {props.networkConfiguration.ip.camera}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="leading-3 text-muted-foreground">PC:</span>
            <span className="text-lg">{props.networkConfiguration.ip.pc}</span>
          </div>
          <div className="flex flex-col">
            <span className="leading-3 text-muted-foreground">Gateway:</span>
            <span className="text-lg">
              {props.networkConfiguration.ip.gateway}
            </span>
          </div>
          <OptionalRender content={props.networkConfiguration.note}>
            <span className="leading-3 text-muted-foreground">Poznámka:</span>
            <span className="text-lg">{props.networkConfiguration.note}</span>
          </OptionalRender>
        </div>
      </CardContent>
    </Card>
  );
}

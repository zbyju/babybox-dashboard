import { BatteryMeasurement } from "@/types/battery-measurement.types";
import { Accordion } from "../ui/accordion";
import BatteryMeasurementAccordionItem from "./battery-measurement-accordion-item";

interface Props {
  batteryMeasurements: BatteryMeasurement[];
}

export default function BatteryMeasurements(props: Props) {
  return (
    <div className="flex w-full flex-col gap-4 mt-4">
      {props.batteryMeasurements.length > 0 ? (
        <>
          {props.batteryMeasurements.map((b: BatteryMeasurement) => (
            <Accordion key={b._id} type="multiple">
              <BatteryMeasurementAccordionItem batteryMeasurement={b} />
            </Accordion>
          ))}
        </>
      ) : (
        <div className="flex flex-col justify-center py-10 text-center">
          <h3 className="text-3xl">Žádné měření</h3>
          <h4 className="text-xl text-muted-foreground">
            Zatím neproběhlo žádné měření kvality baterie.
          </h4>
        </div>
      )}
    </div>
  );
}

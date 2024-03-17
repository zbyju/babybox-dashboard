import BabyboxSideMenu from "@/components/babybox-side-menu";

import Widget from "@/components/ui/widget";

import { events } from "../../../../data/heating_cooling_events.js";
import { snapshots } from "../../../../data/snapshots.js";
import LatestSnapshots from "@/components/widgets/latest-snapshots";
import { Snapshot, SnapshotGroupStat } from "@/types/snapshot.types";
import { Event } from "@/types/event.types";
import LatestEvents from "@/components/widgets/latest-events";
import VariableStats from "@/components/widgets/variable-stats";
import { calculateSnapshotStats } from "@/utils/stats";
import TextualSnapshotStats from "@/components/misc/textual-snapshot-stats";
import { Separator } from "@/components/ui/separator";
import VariableOverview from "@/components/widgets/variable-overview";

export default function BabyboxPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const stats = calculateSnapshotStats(snapshots);
  const statsSmall = calculateSnapshotStats(
    snapshots.slice(0, snapshots.length / 2),
  );
  const statsSmaller = calculateSnapshotStats(
    snapshots.slice(0, snapshots.length / 4),
  );

  const temperatureVariableOverviews = [
    { key: "inside", name: "Vnitřní teplota", color: "inside" },
    { key: "outside", name: "Venkovní teplota", color: "outside" },
    { key: "casing", name: "Teplota pláště", color: "casing" },
    { key: "top", name: "Teplota horní", color: "heating" },
    { key: "bottom", name: "Teplota spodní", color: "cooling" },
  ].map((o) => (
    <Widget key={o.key} title={o.name} subtitle="Přehled">
      <VariableOverview
        source={{
          group: "temperature",
          variable: o.key,
          color: `hsl(var(--${o.color}))`,
          name: o.name,
        }}
        lastWeek={(stats.temperature as SnapshotGroupStat)[o.key]}
        last3Days={(statsSmall.temperature as SnapshotGroupStat)[o.key]}
        lastDay={(statsSmaller.temperature as SnapshotGroupStat)[o.key]}
        snapshots={snapshots}
      />
    </Widget>
  ));

  const voltageVariableOverviews = [
    { key: "in", name: "Vstupní napětí", color: "in" },
    { key: "battery", name: "Napětí akumulátoru", color: "battery" },
  ].map((o) => (
    <Widget key={o.key} title={o.name} subtitle="Přehled">
      <VariableOverview
        source={{
          group: "voltage",
          variable: o.key,
          color: `hsl(var(--${o.color}))`,
          name: o.name,
        }}
        lastWeek={(stats.voltage as SnapshotGroupStat)[o.key]}
        last3Days={(statsSmall.voltage as SnapshotGroupStat)[o.key]}
        lastDay={(statsSmaller.voltage as SnapshotGroupStat)[o.key]}
        snapshots={snapshots}
      />
    </Widget>
  ));

  return (
    <div className="w-screen lg:pb-24 lg:pr-5">
      <BabyboxSideMenu babybox={{ slug, name: slug }} />
      <div className="lg:ml-main mb-1 mt-5 flex-grow">
        <div className="mx-auto flex w-11/12 flex-col">
          <div className="mb-4">
            <h4 className="ml-1 text-3xl font-black leading-6">Teploty</h4>
            <h5 className="mb-3 ml-1 text-xl text-muted-foreground">
              Minimum, Průměr, Maximum
            </h5>

            <div className="mb-4 flex flex-row flex-wrap justify-center justify-items-center gap-4 md:justify-start">
              {temperatureVariableOverviews}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="ml-1 text-3xl font-black leading-6">Napětí</h4>
            <h5 className="mb-3 ml-1 text-xl text-muted-foreground">
              Minimum, Průměr, Maximum
            </h5>

            <div className="mb-4 flex flex-row flex-wrap justify-center justify-items-center gap-4 md:justify-start">
              {voltageVariableOverviews}
            </div>
          </div>

          <h4 className="mb-3 ml-1 text-3xl font-black">Data</h4>
          <div className="mb-4 flex flex-row flex-wrap justify-center justify-items-center gap-4 md:justify-start">
            <Widget title="Nejnovější data">
              <LatestSnapshots snapshots={snapshots as Snapshot[]} take={11} />
              <Separator className="my-2" />
              <TextualSnapshotStats
                snapshots={snapshots as Snapshot[]}
                take={11}
              />
            </Widget>
            <Widget title="Nejnovější události">
              <LatestEvents events={events as Event[]} take={11} />
            </Widget>
          </div>

          <h4 className="mb-3 ml-1 text-3xl font-black">Notifikace</h4>
          <div className="grid grid-cols-2 gap-4"></div>
        </div>
      </div>
    </div>
  );
}

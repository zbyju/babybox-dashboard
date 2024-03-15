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

export default function BabyboxPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const stats = calculateSnapshotStats(snapshots);

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
              <Widget
                title="Vnitřní"
                subtitle="Poslední týden"
                classNameInner="border-b-4 border-b-inside"
              >
                <VariableStats
                  stats={(stats.temperature as SnapshotGroupStat).inside}
                />
              </Widget>
              <Widget
                title="Venkovní"
                subtitle="Poslední týden"
                classNameInner="border-b-4 border-b-outside"
              >
                <VariableStats
                  stats={(stats.temperature as SnapshotGroupStat).outside}
                />
              </Widget>
              <Widget
                title="Plášť"
                subtitle="Poslední týden"
                classNameInner="border-b-4 border-b-casing"
              >
                <VariableStats
                  stats={(stats.temperature as SnapshotGroupStat).casing}
                />
              </Widget>
              <Widget
                title="Horní"
                subtitle="Poslední týden"
                classNameInner="border-b-4 border-b-heating"
              >
                <VariableStats
                  stats={(stats.temperature as SnapshotGroupStat).top}
                />
              </Widget>
              <Widget
                title="Spodní"
                subtitle="Poslední týden"
                classNameInner="border-b-4 border-b-cooling"
              >
                <VariableStats
                  stats={(stats.temperature as SnapshotGroupStat).bottom}
                />
              </Widget>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="ml-1 text-3xl font-black leading-6">Napětí</h4>
            <h5 className="mb-3 ml-1 text-xl text-muted-foreground">
              Minimum, Průměr, Maximum
            </h5>

            <div className="mb-4 flex flex-row flex-wrap justify-center justify-items-center gap-4 md:justify-start">
              <Widget
                title="Vstup"
                subtitle="Poslední týden"
                classNameInner="border-b-4 border-b-in"
              >
                <VariableStats
                  stats={(stats.voltage as SnapshotGroupStat).in}
                />
              </Widget>
              <Widget
                title="Akumulátor"
                subtitle="Poslední týden"
                classNameInner="border-b-4 border-b-battery"
              >
                <VariableStats
                  stats={(stats.voltage as SnapshotGroupStat).battery}
                />
              </Widget>
            </div>
          </div>

          <h4 className="mb-3 ml-1 text-3xl font-black">Data</h4>
          <div className="mb-4 flex flex-row flex-wrap justify-center justify-items-center gap-4 md:justify-start">
            <Widget title="Nejnovější data">
              <LatestSnapshots snapshots={snapshots as Snapshot[]} take={11} />
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

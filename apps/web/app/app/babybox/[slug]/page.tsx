import BabyboxSideMenu from "@/components/babybox-side-menu";
import TestChart from "@/components/charts/TestChart";

import Widget from "@/components/ui/widget";

import { events } from "../../../../data/heating_cooling_events.js";
import { snapshots } from "../../../../data/snapshots.js";
import LatestSnapshots from "@/components/widgets/latest-snapshots";
import { Snapshot } from "@/types/snapshot.types";
import { Event } from "@/types/event.types";
import LatestEvents from "@/components/widgets/latest-events";

export default function BabyboxPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  return (
    <div className="flex w-screen pr-5">
      <BabyboxSideMenu babybox={{ slug, name: slug }} />
      <div className="ml-main mb-1 mt-5 flex-grow">
        <div className="mx-auto flex w-11/12 flex-col">
          <h2 className="mb-6 text-3xl font-black">Data Dashboard</h2>

          <div className="mb-4 grid grid-cols-4 gap-4">
            <Widget title="Hello">
              <TestChart />
            </Widget>
            <Widget title="Hello">
              <TestChart />
            </Widget>
            <Widget title="Hello">
              <TestChart />
            </Widget>
            <Widget title="Hello">
              <TestChart />
            </Widget>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Widget title="Nejnovější data">
              <LatestSnapshots snapshots={snapshots as Snapshot[]} take={11} />
            </Widget>
            <Widget title="Nejnovější události">
              <LatestEvents events={events as Event[]} take={11} />
            </Widget>
            <Widget title="Hello" classNameInner="h-full">
              <TestChart />
            </Widget>
            <Widget title="Hello">
              <TestChart />
            </Widget>
            <Widget title="Hello">
              <TestChart />
            </Widget>
            <Widget title="Hello">
              <TestChart />
            </Widget>
          </div>
        </div>
      </div>
    </div>
  );
}

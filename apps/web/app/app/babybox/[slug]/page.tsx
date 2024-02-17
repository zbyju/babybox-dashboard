import BabyboxSideMenu from "@/components/babybox-side-menu";
import TestChart from "@/components/charts/TestChart";

import snapshots from "../../../../data/snapshots.json"
import events from "../../../../data/heating_cooling_events.json"

export default function BabyboxPage({ params }: { params: { slug: string } }) {
  const slug = params.slug

  return (
    <div className="flex w-screen pr-5">
      <BabyboxSideMenu babybox={{ slug, name: slug }} />
      <div className="flex flex-col flex-grow">
        <div className="grid grid-cols-4 gap-4">
          <TestChart />
          <TestChart />
          <TestChart />
          <TestChart />
          <TestChart />
        </div>
        <div className="w-full h-[500px]">
          <TestChart />
        </div>
        <div className="h-[1000px]"></div>
      </div>

    </div>
  )
}

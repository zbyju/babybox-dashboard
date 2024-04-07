"use client";

import BabyboxSideMenu from "@/components/babybox-side-menu";

import Widget from "@/components/ui/widget";

import { events } from "../../../../data/heating_cooling_events.js";
import LatestSnapshots from "@/components/widgets/latest-snapshots";
import { Snapshot, SnapshotGroupStat } from "@/types/snapshot.types";
import { Event } from "@/types/event.types";
import LatestEvents from "@/components/widgets/latest-events";
import { calculateSnapshotStats } from "@/utils/stats";
import TextualSnapshotStats from "@/components/misc/textual-snapshot-stats";
import { Separator } from "@/components/ui/separator";
import VariableOverview from "@/components/widgets/variable-overview";
import { fetcherWithToken } from "@/helpers/api-helper";
import { addDays, format } from "date-fns";
import useSWR from "swr";
import { useAuth } from "@/components/contexts/auth-context";

export default function BabyboxPage({ params }: { params: { slug: string } }) {
  const { token } = useAuth();
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const snapshotServiceURL = process.env.NEXT_PUBLIC_URL_SNAPSHOT_HANDLER;

  const {
    data: babyboxData,
    error: babyboxError,
    isLoading: babyboxIsLoading,
  } = useSWR(
    [`${babyboxServiceURL}/v1/babyboxes/${params.slug}`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );

  const today = new Date();
  const todayDate = format(today, "yyyy-MM-dd");
  const lastWeekDate = format(addDays(today, -6), "yyyy-MM-dd");
  const last3DaysDate = format(addDays(today, -2), "yyyy-MM-dd");

  const {
    data: snapshotsWeekData,
    error: snapshotsWeekError,
    isLoading: snapshotsWeekIsLoading,
  } = useSWR(
    [
      `${snapshotServiceURL}/v1/snapshots/${params.slug}?from=${lastWeekDate}&to=${todayDate}`,
      token,
    ],
    ([url, token]) => fetcherWithToken(url, token),
  );

  const {
    data: snapshots3DaysData,
    error: snapshots3DaysError,
    isLoading: snapshots3DaysIsLoading,
  } = useSWR(
    [
      `${snapshotServiceURL}/v1/snapshots/${params.slug}?from=${last3DaysDate}&to=${todayDate}`,
      token,
    ],
    ([url, token]) => fetcherWithToken(url, token),
  );

  const {
    data: snapshotsDayData,
    error: snapshotsDayError,
    isLoading: snapshotsDayIsLoading,
  } = useSWR(
    [
      `${snapshotServiceURL}/v1/snapshots/${params.slug}?from=${todayDate}&to=${todayDate}`,
      token,
    ],
    ([url, token]) => fetcherWithToken(url, token),
  );

  if (
    snapshotsDayError ||
    snapshots3DaysError ||
    snapshotsWeekError ||
    snapshotsDayIsLoading ||
    snapshotsWeekIsLoading ||
    snapshots3DaysIsLoading ||
    babyboxIsLoading ||
    babyboxError ||
    !babyboxData.data
  ) {
    return <>Error</>;
  }

  console.log(babyboxData);
  console.log(snapshotsDayData);
  console.log(snapshots3DaysData);
  console.log(snapshotsWeekData);

  const stats = calculateSnapshotStats(snapshotsWeekData.data);
  const statsSmall = calculateSnapshotStats(snapshots3DaysData.data);
  const statsSmaller = calculateSnapshotStats(snapshotsDayData.data);

  const temperatureVariableOverviews = [
    { key: "inside", name: "Vnitřní teplota", color: "inside" },
    { key: "outside", name: "Venkovní teplota", color: "outside" },
    { key: "casing", name: "Teplota pláště", color: "casing" },
    { key: "top", name: "Teplota horní", color: "heating" },
    { key: "bottom", name: "Teplota spodní", color: "cooling" },
  ].map((o) => (
    <Widget key={o.key} title={o.name} subtitle="Přehled">
      {stats.temperature === undefined ||
      statsSmall.temperature === undefined ||
      statsSmaller.temperature === undefined ? (
        <>Statistiky nejsou dostupné</>
      ) : (
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
          snapshots={snapshotsDayData.data}
        />
      )}
    </Widget>
  ));

  const voltageVariableOverviews = [
    { key: "in", name: "Vstupní napětí", color: "in" },
    { key: "battery", name: "Napětí akumulátoru", color: "battery" },
  ].map((o) => (
    <Widget key={o.key} title={o.name} subtitle="Přehled">
      {stats.voltage === undefined ||
      statsSmall.voltage === undefined ||
      statsSmaller.voltage === undefined ? (
        <>Statistiky nejsou dostupné</>
      ) : (
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
          snapshots={snapshotsDayData.data}
        />
      )}
    </Widget>
  ));

  return (
    <div className="w-screen lg:pb-24 lg:pr-5">
      <BabyboxSideMenu babybox={babyboxData.data} />
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
              <LatestSnapshots
                snapshots={snapshotsDayData.data as Snapshot[]}
                take={11}
              />
              <Separator className="my-2" />
              <TextualSnapshotStats
                snapshots={snapshotsDayData.data as Snapshot[]}
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

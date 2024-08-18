"use client";

import BabyboxSideMenu from "@/components/babybox-side-menu";

import Widget from "@/components/ui/widget";

import { addDays, addYears, differenceInCalendarDays, format } from "date-fns";
import LatestNotifications from "@/components/widgets/latest-notifications";
import TextualSnapshotStats from "@/components/misc/textual-snapshot-stats";
import { BabyboxesContext } from "@/components/contexts/babyboxes-context";
import BreadcrumbsDashboard from "@/components/misc/breadcrumbs-dashboard";
import LocationNavigation from "@/components/tables/location-nagivation";
import { fetcherWithToken, snapshotFetcher } from "@/helpers/api-helper";
import VariableOverview from "@/components/widgets/variable-overview";
import { maintenancesFetcher } from "@/fetchers/maintenance.fetcher";
import LatestSnapshots from "@/components/widgets/latest-snapshots";
import LatestEvents from "@/components/widgets/latest-events";
import { useAuth } from "@/components/contexts/auth-context";
import { SnapshotGroupStat } from "@/types/snapshot.types";
import RefreshButton from "@/components/buttons/refresh";
import { issuesFetcher } from "@/fetchers/issue.fetcher";
import { calculateSnapshotStats } from "@/utils/stats";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext, useState } from "react";
import { Event } from "@/types/event.types";
import useSWR from "swr";

export default function BabyboxPage({ params }: { params: { slug: string } }) {
  const { token } = useAuth();
  const snapshotServiceURL = process.env.NEXT_PUBLIC_URL_SNAPSHOT_HANDLER;
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const notificationServiceURL =
    process.env.NEXT_PUBLIC_URL_NOTIFICATION_SERVICE;
  const { getBabyboxBySlug } = useContext(BabyboxesContext);
  const babybox = getBabyboxBySlug(params.slug);
  const [updated, setUpdated] = useState<Date>(new Date());

  const { data: babyboxData } = useSWR(
    [`${babyboxServiceURL}/v1/babyboxes/${params.slug}`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );

  const { data: issues } = useSWR(
    ["issues/slug/" + params.slug, token],
    ([_, token]) => issuesFetcher(token, "/slug/" + params.slug),
  );

  const { data: maintenances } = useSWR(
    ["maintenaces/slug/" + params.slug, token],
    ([_, token]) => maintenancesFetcher(token, params.slug),
  );
  const lastDoneMaintenance = maintenances
    ?.filter((m) => m.state === "completed")
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .at(0);
  const daysToNextMaintenance = lastDoneMaintenance
    ? differenceInCalendarDays(
        addYears(lastDoneMaintenance?.start, 2),
        new Date(),
      )
    : 0;

  const {
    data: notificationsData,
    error: notificationsError,
    isLoading: notificationsLoading,
    mutate: notificationsMutate,
  } = useSWR(
    [`${notificationServiceURL}/v1/notifications/${params.slug}`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );

  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
    mutate: eventsMutate,
  } = useSWR(
    [`${snapshotServiceURL}/v1/events/${params.slug}?n=10&sort=desc`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );

  const today = new Date();
  const todayDate = format(today, "yyyy-MM-dd");
  const lastWeekDate = format(addDays(today, -6), "yyyy-MM-dd");
  const last3DaysDate = format(addDays(today, -2), "yyyy-MM-dd");

  const {
    data: snapshotsWeek,
    error: snapshotsWeekError,
    isLoading: snapshotsWeekIsLoading,
    mutate: snapshotsWeekMutate,
  } = useSWR(
    [
      `${snapshotServiceURL}/v1/snapshots/${params.slug}?from=${lastWeekDate}&to=${todayDate}`,
      token,
    ],
    ([url, token]) => snapshotFetcher(url, token),
  );

  const {
    data: snapshots3Days,
    error: snapshots3DaysError,
    isLoading: snapshots3DaysIsLoading,
    mutate: snapshots3DaysMutate,
  } = useSWR(
    [
      `${snapshotServiceURL}/v1/snapshots/${params.slug}?from=${last3DaysDate}&to=${todayDate}`,
      token,
    ],
    ([url, token]) => snapshotFetcher(url, token),
  );

  const {
    data: snapshotsDay,
    error: snapshotsDayError,
    isLoading: snapshotsDayIsLoading,
    mutate: snapshotsDayMutate,
  } = useSWR(
    [
      `${snapshotServiceURL}/v1/snapshots/${params.slug}?from=${todayDate}&to=${todayDate}`,
      token,
    ],
    ([url, token]) => snapshotFetcher(url, token),
  );

  function refreshData() {
    eventsMutate();
    snapshotsDayMutate();
    snapshots3DaysMutate();
    snapshotsWeekMutate();
    notificationsMutate();
    setUpdated(new Date());
  }

  const stats = snapshotsWeek ? calculateSnapshotStats(snapshotsWeek) : null;
  const statsSmall = snapshots3Days
    ? calculateSnapshotStats(snapshots3Days)
    : null;
  const statsSmaller = snapshotsDay
    ? calculateSnapshotStats(snapshotsDay)
    : null;

  const temperatureVariableOverviews = [
    { key: "inside", name: "Vnitřní teplota", color: "inside" },
    { key: "outside", name: "Venkovní teplota", color: "outside" },
    { key: "casing", name: "Teplota pláště", color: "casing" },
    { key: "top", name: "Teplota horní", color: "heating" },
    { key: "bottom", name: "Teplota spodní", color: "cooling" },
  ].map((o) => (
    <Widget key={o.key} title={o.name} subtitle="Přehled">
      {snapshotsDayIsLoading ||
      snapshots3DaysIsLoading ||
      snapshotsWeekIsLoading ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <Skeleton className="h-[120px] w-[250px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      ) : snapshotsDayError ||
        snapshotsWeekError ||
        snapshots3DaysError ||
        stats?.temperature === undefined ||
        statsSmall?.temperature === undefined ||
        statsSmaller?.temperature === undefined ||
        !snapshotsDay ? (
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
          snapshots={snapshotsDay}
        />
      )}
    </Widget>
  ));

  const voltageVariableOverviews = [
    { key: "in", name: "Vstupní napětí", color: "in" },
    { key: "battery", name: "Napětí akumulátoru", color: "battery" },
  ].map((o) => (
    <Widget key={o.key} title={o.name} subtitle="Přehled">
      {snapshotsDayIsLoading ||
      snapshots3DaysIsLoading ||
      snapshotsWeekIsLoading ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <Skeleton className="h-[120px] w-[250px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      ) : stats?.voltage === undefined ||
        statsSmall?.voltage === undefined ||
        statsSmaller?.voltage === undefined ||
        !snapshotsDay ? (
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
          snapshots={snapshotsDay}
        />
      )}
    </Widget>
  ));

  return (
    <div className="w-screen lg:pb-24 lg:pr-5">
      {!babybox ? (
        <BabyboxSideMenu babybox={{ slug: params.slug, name: params.slug }} />
      ) : (
        <BabyboxSideMenu babybox={babybox} />
      )}
      <div className="lg:ml-main mb-1 mt-5 flex-grow">
        <div className="mx-auto flex w-11/12 flex-col">
          <div className="mb-4">
            <BreadcrumbsDashboard dashboard />
            <h4 className="text-4xl font-black leading-8">
              Babybox {babybox?.name || params.slug}
            </h4>
            <div className="mb-6 flex flex-row flex-wrap items-center gap-2">
              <h4 className="ml-1 text-lg leading-8 text-muted-foreground">
                Data byly načtené v: {format(updated, "dd:mm:ss")}
              </h4>
              <RefreshButton onClick={refreshData} />
            </div>

            <div className="mb-12 flex flex-row flex-wrap gap-4">
              <div className="flex flex-col flex-wrap justify-between gap-4">
                <LocationNavigation
                  slug={params.slug}
                  location={babyboxData?.data?.location}
                />
                <Widget title="Servisy">
                  {lastDoneMaintenance && (
                    <div className="flex flex-col">
                      <span>
                        Poslední servis:{" "}
                        {format(lastDoneMaintenance.start, "MM/yy")}
                      </span>
                      <span>
                        Další servis:{" "}
                        <span
                          className={
                            daysToNextMaintenance < 365
                              ? "text-orange-500 dark:text-orange-600"
                              : daysToNextMaintenance < 60
                                ? "text-red-600"
                                : ""
                          }
                        >
                          {format(
                            addYears(lastDoneMaintenance.start, 2),
                            "MM/yy",
                          )}
                        </span>
                      </span>
                    </div>
                  )}
                </Widget>
              </div>

              <Widget title="Počet servisů" subtitle="Otv. / Uko. / Celkem">
                <div className="flex flex-col gap-1">
                  <div>
                    Otevřených:{" "}
                    <span className="font-bold text-blue-600">
                      {maintenances?.filter((m) => m.state === "open").length ||
                        0}
                    </span>
                  </div>
                  <div>
                    Uzavřených:{" "}
                    <span className="font-bold text-green-600">
                      {maintenances?.filter((m) => m.state === "completed")
                        .length || 0}
                    </span>
                  </div>
                  <div>
                    Celkem:{" "}
                    <span className="font-bold ">
                      {maintenances?.length || 0}
                    </span>
                  </div>
                </div>
              </Widget>

              <Widget title="Počet chyb" subtitle="Otv. / Uko. / Celkem">
                <div className="flex flex-col gap-1">
                  <div>
                    Otevřených:{" "}
                    <span className="font-bold text-blue-600">
                      {issues?.filter((m) =>
                        ["open", "planned", "in_progress", "created"].includes(
                          m.state_history.at(0)?.state || "",
                        ),
                      ).length || 0}
                    </span>
                  </div>
                  <div>
                    Uzavřených:{" "}
                    <span className="font-bold text-green-600">
                      {issues?.filter((m) =>
                        ["closed", "solved"].includes(
                          m.state_history.at(0)?.state || "",
                        ),
                      ).length || 0}
                    </span>
                  </div>
                  <div>
                    Celkem{" "}
                    <span className="font-bold ">{issues?.length || 0}</span>
                  </div>
                </div>
              </Widget>
            </div>

            <h4 className="ml-1 text-3xl font-bold leading-6">Teploty</h4>
            <h5 className="mb-3 ml-1 text-xl text-muted-foreground">
              Minimum, Průměr, Maximum
            </h5>

            <div className="mb-4 flex flex-row flex-wrap justify-center justify-items-center gap-4 md:justify-start">
              {temperatureVariableOverviews}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="ml-1 text-3xl font-bold leading-6">Napětí</h4>
            <h5 className="mb-3 ml-1 text-xl text-muted-foreground">
              Minimum, Průměr, Maximum
            </h5>

            <div className="mb-12 flex flex-row flex-wrap justify-center justify-items-center gap-4 md:justify-start">
              {voltageVariableOverviews}
            </div>
          </div>

          <h4 className="mb-3 ml-1 text-3xl font-bold">Data</h4>
          <div className="mb-12 flex flex-row flex-wrap justify-center justify-items-center gap-4 md:justify-start">
            <Widget title="Nejnovější data">
              {snapshotsDayIsLoading ? (
                <div>Loading</div>
              ) : snapshotsDayError ? (
                <div>Error</div>
              ) : (
                <>
                  <LatestSnapshots snapshots={snapshotsWeek || []} take={11} />
                  <Separator className="my-2" />
                  <TextualSnapshotStats
                    snapshots={snapshotsWeek || []}
                    take={11}
                  />
                </>
              )}
            </Widget>
            <Widget title="Nejnovější události">
              {eventsLoading ? (
                <div>Loading</div>
              ) : eventsError ? (
                <div>Error</div>
              ) : (
                <>
                  <LatestEvents
                    events={(eventsData?.data || []) as Event[]}
                    take={11}
                  />
                </>
              )}
            </Widget>
          </div>

          <h4 className="mb-3 ml-1 text-3xl font-bold">Notifikace</h4>
          {notificationsLoading ? (
            <div>Loading</div>
          ) : notificationsError ? (
            <div>Error</div>
          ) : (
            <>
              <LatestNotifications notifications={notificationsData} />
            </>
          )}
          <div className="grid grid-cols-2 gap-4"></div>
        </div>
      </div>
    </div>
  );
}

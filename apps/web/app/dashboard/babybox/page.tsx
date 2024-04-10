"use client";

import { useAuth } from "@/components/contexts/auth-context";
import { BabyboxesContext } from "@/components/contexts/babyboxes-context";
import BabyboxesTable, { Babybox } from "@/components/tables/babyboxes-table";
import { BabyboxBase } from "@/types/babybox.types";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const { token } = useAuth();
  const snapshotServiceURL = process.env.NEXT_PUBLIC_URL_SNAPSHOT_HANDLER;
  const babyboxBases = useContext(BabyboxesContext) as BabyboxBase[];

  const [babyboxes, setBabyboxes] = useState<Babybox[]>([]);

  useEffect(() => {
    const fetchSnapshot = async (slug: string) => {
      try {
        const response = await fetch(
          `${snapshotServiceURL}/v1/snapshots/${slug}?n=1`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await response.json();
        const latestSnapshot = data.data[0];
        latestSnapshot.timestamp = new Date(latestSnapshot.timestamp);
        return latestSnapshot;
      } catch (error) {
        throw error;
      }
    };

    const fetchBabyboxes = async () => {
      try {
        const promises = babyboxBases.map((b: BabyboxBase) =>
          fetchSnapshot(b.slug),
        );
        const results = await Promise.all(promises);
        const babyboxes = results.map((r, i) => ({
          ...babyboxBases[i],
          lastData: r,
        }));
        setBabyboxes(babyboxes);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (!babyboxBases || babyboxBases.length === 0) return;

    fetchBabyboxes();
  }, [babyboxBases, snapshotServiceURL, token]);

  return (
    <div className="mb-10 mt-2 px-4 lg:px-[16%]">
      <BabyboxesTable babyboxes={babyboxes} />
    </div>
  );
}

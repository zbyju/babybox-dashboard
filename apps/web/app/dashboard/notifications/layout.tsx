"use client";

import { fetcherWithToken } from "@/helpers/api-helper";
import { BabyboxesProvider } from "../../../components/contexts/babyboxes-context";
import Navbar from "@/components/navbar";
import { BabyboxBase } from "@/types/babybox.types";
import { Babybox } from "@/components/tables/babyboxes-table";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAuth } from "@/components/contexts/auth-context";

export const dynamic = "force-dynamic";

export default function BabyboxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { token } = useAuth();
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const snapshotServiceURL = process.env.NEXT_PUBLIC_URL_SNAPSHOT_HANDLER;
  const {
    data: babyboxNamesData,
    error: babyboxNamesError,
    isLoading: babyboxNamesIsLoading,
  } = useSWR([`${babyboxServiceURL}/v1/babyboxes`, token], ([url, token]) =>
    fetcherWithToken(url, token || ""),
  );

  const [babyboxes, setBabyboxes] = useState<Babybox[]>([]);

  useEffect(() => {
    const fetchSnapshot = async (slug: string) => {
      try {
        const response = await fetch(
          `${snapshotServiceURL}/v1/snapshots/${slug}?n=1`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await response.json();
        return data.data[0];
      } catch (error) {
        throw error;
      }
    };

    const fetchBabyboxes = async () => {
      try {
        const promises = babyboxNamesData.data.map((b: BabyboxBase) =>
          fetchSnapshot(b.slug),
        );
        const results = await Promise.all(promises);
        const babyboxes = results.map((r, i) => ({
          ...babyboxNamesData.data[i],
          lastData: r,
        }));
        setBabyboxes(babyboxes);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (babyboxNamesData === undefined || babyboxNamesData.data.length === 0)
      return;
    fetchBabyboxes();
  }, [babyboxNamesData, snapshotServiceURL, token]);

  if (babyboxNamesError)
    return (
      <div>
        <Navbar />
        Error
      </div>
    );

  if (babyboxNamesIsLoading)
    return (
      <div>
        <Navbar />
        Loading
      </div>
    );

  return (
    <div>
      <BabyboxesProvider babyboxes={babyboxes}>
        <Navbar />
        {children}
      </BabyboxesProvider>
    </div>
  );
}
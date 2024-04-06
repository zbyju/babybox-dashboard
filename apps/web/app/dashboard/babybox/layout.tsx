"use client";

import {
  fetchBabyboxNames,
  fetchSnapshotsBySlugAndN,
  fetcherWithToken,
} from "@/helpers/api-helper";
import { BabyboxesProvider } from "../../../components/contexts/babyboxes-context";
import Navbar from "@/components/navbar";
import { useAuth } from "@/components/contexts/auth-context";
import useSWR from "swr";
import { ApiResponse } from "@/types/api.types";
import { BabyboxBase } from "@/types/babybox.types";
import { useEffect, useState } from "react";
import { Babybox } from "@/components/tables/babyboxes-table";

export default function BabyboxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { token } = useAuth();
  console.log("layout", token);
  console.log("localstorage", localStorage.getItem("authToken"));
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

    if (
      babyboxNamesData === undefined ||
      !babyboxNamesData.data ||
      babyboxNamesData.data.length === 0
    )
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

  console.log(babyboxes);

  return (
    <div>
      <BabyboxesProvider babyboxes={babyboxes}>
        <Navbar />
        {children}
      </BabyboxesProvider>
    </div>
  );
}

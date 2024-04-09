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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

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
        <div className="flex w-full flex-row items-center justify-center">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Došlo k chybě načítání babyboxů. Zkuste se znovu příhlásit
              <Link className="underline" href="/auth/login">
                zde
              </Link>
              .
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );

  if (babyboxNamesIsLoading)
    return (
      <div>
        <Navbar />
        <div className="mt-4 flex w-full flex-col items-center justify-center gap-2 lg:items-start lg:px-[16%]">
          <Skeleton className="h-4 w-[120px] max-w-full self-start" />
          <Skeleton className="h-[120px] w-[350px] max-w-full" />
          <Skeleton className="h-4 w-[350px] max-w-full" />
          <Skeleton className="h-4 w-[450px] max-w-full" />
          <Skeleton className="h-4 w-[350px] max-w-full" />
          <Skeleton className="h-[120px] w-[350px] max-w-full" />
          <Skeleton className="h-4 w-[450px] max-w-full" />
          <Skeleton className="h-4 w-[350px] max-w-full" />
        </div>
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

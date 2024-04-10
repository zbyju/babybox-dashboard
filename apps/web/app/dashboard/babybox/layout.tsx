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
  const {
    data: babyboxNamesData,
    error: babyboxNamesError,
    isLoading: babyboxNamesIsLoading,
  } = useSWR([`${babyboxServiceURL}/v1/babyboxes`, token], ([url, token]) =>
    fetcherWithToken(url, token || ""),
  );

  if (babyboxNamesError)
    return (
      <div>
        <Navbar />
        <div className="lg:[500px] mx-auto flex w-11/12 flex-row items-center justify-center">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Došlo k chybě načítání babyboxů. Zkuste se znovu příhlásit{" "}
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
      <BabyboxesProvider babyboxes={babyboxNamesData.data}>
        <Navbar />
        {children}
      </BabyboxesProvider>
    </div>
  );
}

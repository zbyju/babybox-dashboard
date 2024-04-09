"use client";

import { useAuth } from "@/components/contexts/auth-context";
import LocationInformation from "@/components/location-information";
import NetworkConfiguration from "@/components/network-configuration";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcherWithToken } from "@/helpers/api-helper";
import { AlertCircle, ArrowLeft, FilePenLine } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

export default function Home({ params }: { params: { slug: string } }) {
  const { token } = useAuth();
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;

  const {
    data: babyboxData,
    error: babyboxError,
    isLoading: babyboxIsLoading,
  } = useSWR(
    [`${babyboxServiceURL}/v1/babyboxes/${params.slug}`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );

  return (
    <div className="mt-4 px-[5%] lg:px-[16%]">
      {babyboxError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Chyba načítání dat.</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex flex-row flex-wrap justify-between gap-4">
            <h2 className="ml-1 text-3xl font-semibold">
              <span className="font-bold text-pink-600">Babybox </span>
              {babyboxIsLoading ? (
                <Skeleton className="h-4 w-[120px]" />
              ) : (
                <span className="capitalize">{babyboxData.data.name}</span>
              )}
            </h2>
            <div className="flex flex-row flex-wrap gap-4">
              <Link href={"/dashboard/babybox/" + params.slug + "/edit"}>
                <Button className="inline-flex flex-row items-center gap-2">
                  <FilePenLine className="w-5" />
                  Editovat
                </Button>
              </Link>
              <Link href={"/dashboard/babybox/" + params.slug}>
                <Button
                  variant="secondary"
                  className="inline-flex flex-row items-center gap-2"
                >
                  <ArrowLeft className="w-5" />
                  Zpět
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-row flex-wrap gap-6">
            {babyboxIsLoading ? (
              <Skeleton className="h-[400px] w-[250px]" />
            ) : (
              babyboxData.data.location && (
                <LocationInformation address={babyboxData.data.location} />
              )
            )}

            {babyboxIsLoading ? (
              <Skeleton className="h-[400px] w-[250px]" />
            ) : (
              babyboxData.data.network_configuration && (
                <NetworkConfiguration
                  networkConfiguration={babyboxData.data.network_configuration}
                />
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

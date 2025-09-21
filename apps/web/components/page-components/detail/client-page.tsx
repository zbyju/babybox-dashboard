"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import BreadcrumbsDashboard from "@/components/misc/breadcrumbs-dashboard";
import MaintenanceInformation from "@/components/maintenance-information";
import LocationInformation from "@/components/location-information";
import { AlertCircle, ArrowLeft, FilePenLine } from "lucide-react";
import { useAuth } from "@/components/contexts/auth-context";
import PageHeading from "@/components/misc/page-heading";
import { fetcherWithToken } from "@/helpers/api-helper";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useSWR from "swr";

interface BabyboxPageClientProps {
  slug: string;
}

export default function BabyboxPageClient({ slug }: BabyboxPageClientProps) {
  const { token } = useAuth();
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;

  const {
    data: babyboxData,
    error: babyboxError,
    isLoading: babyboxIsLoading,
  } = useSWR(
    [`${babyboxServiceURL}/v1/babyboxes/${slug}`, token],
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
          <BreadcrumbsDashboard dashboard slug={slug} />
          <div className="flex flex-row flex-wrap justify-between gap-4">
            <PageHeading heading="Informace" slug={slug} />
            <div className="flex flex-row flex-wrap gap-4">
              <Link href={`/dashboard/babybox/${slug}/edit`}>
                <Button className="inline-flex flex-row items-center gap-2">
                  <FilePenLine className="w-5" />
                  Editovat
                </Button>
              </Link>
              <Link href={`/dashboard/babybox/${slug}`}>
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
            <MaintenanceInformation slug={slug} />

            {babyboxIsLoading ? (
              <Skeleton className="h-[400px] w-[250px]" />
            ) : (
              <LocationInformation
                address={babyboxData?.data?.location}
                name={babyboxData?.data?.name || slug}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

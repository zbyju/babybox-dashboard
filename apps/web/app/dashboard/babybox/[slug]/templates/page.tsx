"use client";

import NotificationTemplateTable from "@/components/tables/notification-template-table";
import { BabyboxesContext } from "@/components/contexts/babyboxes-context";
import BreadcrumbsDashboard from "@/components/misc/breadcrumbs-dashboard";
import { useAuth } from "@/components/contexts/auth-context";
import PageHeading from "@/components/misc/page-heading";
import { fetcherWithToken } from "@/helpers/api-helper";
import { Skeleton } from "@/components/ui/skeleton";
import { BabyboxBase } from "@/types/babybox.types";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { toast } from "sonner";
import Link from "next/link";
import useSWR from "swr";

export default function NotificationsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { token } = useAuth();
  const notificationServiceURL =
    process.env.NEXT_PUBLIC_URL_NOTIFICATION_SERVICE;
  const { getBabyboxBySlug } = useContext(BabyboxesContext);
  const babybox = getBabyboxBySlug(params.slug);

  const { data, isLoading, mutate } = useSWR(
    [`${notificationServiceURL}/v1/templates/${params.slug}`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );

  async function handleRemove(id: string) {
    try {
      const res = await fetch(`${notificationServiceURL}/v1/templates/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        toast.success("Šablona byla smazána.");
        mutate();
      } else {
        toast.error("Šablona nebyla smazána.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Šablona nebyla smazána.");
    }
  }

  return (
    <div className="mb-10 mt-2 w-full px-4 lg:px-[16%]">
      <div className="mt-4 flex w-full flex-row items-center justify-between gap-4">
        <div>
          <BreadcrumbsDashboard dashboard slug={params.slug} />
          <PageHeading
            heading="Seznam notifikačních šablon"
            slug={params.slug}
          />
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          <Link href="/dashboard/notifications/add">
            <Button className="flex flex-row items-center justify-between gap-1">
              <Plus />
              Přidat
            </Button>
          </Link>
          <Link href={"/dashboard/babybox/" + params.slug}>
            <Button
              className="flex flex-row items-center justify-between gap-1"
              variant="secondary"
            >
              <ChevronLeft />
              Zpět
            </Button>
          </Link>
        </div>
      </div>
      {isLoading ? (
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
      ) : (
        <NotificationTemplateTable
          templates={data || []}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}

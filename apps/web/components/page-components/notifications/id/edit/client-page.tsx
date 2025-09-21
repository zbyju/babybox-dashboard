// app/dashboard/notifications/[id]/NotificationEditPageClient.tsx
"use client";

import NotificationTemplateForm from "@/components/notification-template-form";
import BreadcrumbsDashboard from "@/components/misc/breadcrumbs-dashboard";
import { NotificationTemplate } from "@/types/notification.types";
import { useAuth } from "@/components/contexts/auth-context";
import PageHeading from "@/components/misc/page-heading";
import Breadcrumbs from "@/components/misc/breadcrumbs";
import { fetcherWithToken } from "@/helpers/api-helper";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import useSWR from "swr";

// Define props for the Client Component
interface NotificationEditPageClientProps {
  id: string;
}

export default function NotificationEditPageClient({
  id,
}: NotificationEditPageClientProps) {
  const { token } = useAuth();
  const notificationServiceURL =
    process.env.NEXT_PUBLIC_URL_NOTIFICATION_SERVICE;

  const { data, isLoading } = useSWR(
    [`${notificationServiceURL}/v1/templates/id/${id}`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );

  async function handleSubmit(
    template: NotificationTemplate,
  ): Promise<NotificationTemplate | null> {
    if (
      template.scope.length === 0 ||
      template.title.length === 0 ||
      template.variable.length === 0 ||
      template.comparison.length === 0 ||
      template.value === null ||
      template.streak === null ||
      template.delay === null
    ) {
      toast.error(
        "Šablona nesplňuje požadavky (je potřeba vyplnit babybox, název, proměnnou, porovnání, hodnotu, prodlevu, řadu).",
      );
      return template;
    }
    try {
      const res = await fetch(
        `${notificationServiceURL}/v1/templates/${template._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(template),
        },
      );
      const newTemplate = await res.json();
      if (res.ok) {
        toast.success("Šablona byla úspěšně upravena.");
        return newTemplate;
      } else {
        toast.error("Šablona nebyla upravena.");
        return template;
      }
    } catch (err) {
      console.log(err);
      toast.error("Šablona nebyla upravena.");
      return template;
    }
  }

  return (
    <div className="mb-10 mt-4 w-full px-4 lg:px-[16%]">
      {data?.scope === "global" ? (
        <Breadcrumbs
          links={[
            {
              href: "/dashboard/notifications",
              label: "Seznam notifikačních šablon",
            },
          ]}
        />
      ) : (
        <BreadcrumbsDashboard />
      )}
      <div className="mt-4 flex w-full flex-row items-center justify-between">
        <PageHeading heading="Editovat notifikační šablonu" />
        <Link href="/dashboard/notifications">
          <Button
            className="flex flex-row items-center justify-between gap-1"
            variant="secondary"
          >
            <ArrowLeft />
            Zpět
          </Button>
        </Link>
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
        <NotificationTemplateForm
          notificationTemplate={data}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

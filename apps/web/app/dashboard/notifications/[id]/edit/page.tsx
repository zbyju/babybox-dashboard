"use client";

import { useAuth } from "@/components/contexts/auth-context";
import NotificationTemplateForm from "@/components/notification-template-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcherWithToken } from "@/helpers/api-helper";
import { NotificationTemplate } from "@/types/notification.types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useSWR from "swr";

export default function NotificationEdit({
  params,
}: {
  params: { id: string };
}) {
  const { token } = useAuth();
  const notificationServiceURL =
    process.env.NEXT_PUBLIC_URL_NOTIFICATION_SERVICE;

  const { data, error, isLoading } = useSWR(
    [`${notificationServiceURL}/v1/templates/id/${params.id}`, token],
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
    <div className="mb-10 mt-2 w-full px-4 lg:px-[16%]">
      <div className="mt-4 flex w-full flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">Editování notifikační šablony</h2>
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

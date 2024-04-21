"use client";

import { useAuth } from "@/components/contexts/auth-context";
import NotificationTemplateForm from "@/components/notification-template-form";
import { Button } from "@/components/ui/button";
import { NotificationTemplate } from "@/types/notification.types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NotificationsPage() {
  const notificationServiceURL =
    process.env.NEXT_PUBLIC_URL_NOTIFICATION_SERVICE;
  const { token } = useAuth();

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
      const res = await fetch(`${notificationServiceURL}/v1/templates/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      });
      await res.json();
      if (res.ok) {
        toast.success("Šablona úspěšně vytvořena.");
        return null;
      } else {
        toast.error("Šablona nebyla vytvořena.");
        return template;
      }
    } catch (err) {
      console.log(err);
      toast.error("Šablona nebyla vytvořena.");
      return template;
    }
    return template;
  }
  return (
    <div className="mb-10 mt-2 w-full px-4 lg:px-[16%]">
      <div className="mt-4 flex w-full flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">Nová notifikační šablona</h2>
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

      <NotificationTemplateForm
        onSubmit={async (template) => await handleSubmit(template)}
      />
    </div>
  );
}

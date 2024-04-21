import { Info, XCircle, AlertTriangle } from "lucide-react";
import {
  NotificationTemplate,
  NotificationsByTemplateGroupedByDays,
} from "@/types/notification.types";
import { useAuth } from "../contexts/auth-context";
import useSWR from "swr";
import { fetcherWithToken } from "@/helpers/api-helper";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { format, parseISO } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Props {
  groupedNotifications: NotificationsByTemplateGroupedByDays;
}

export default function GroupNotificationAccordionItem(props: Props) {
  const { token } = useAuth();
  const notificationServiceURL =
    process.env.NEXT_PUBLIC_URL_NOTIFICATION_SERVICE;

  const {
    data: templateData,
    error: templateError,
    isLoading: templateLoading,
  } = useSWR(
    [
      `${notificationServiceURL}/v1/templates/id/${props.groupedNotifications.template}`,
      token,
    ],
    ([url, token]) => fetcherWithToken(url, token),
  );

  const color = !templateData
    ? "border-primary"
    : templateData.severity === "high"
      ? "border-red-600 dark:border-red-700"
      : templateData.severity === "medium"
        ? "border-orange-400 dark:border-orange-500"
        : templateData.severity === "low"
          ? "border-blue-500 dark:border-blue-600"
          : "border-primary";

  const icon = !templateData ? null : templateData.severity === "high" ? (
    <XCircle className="h-5 w-5 text-red-600 dark:text-red-700" />
  ) : templateData.severity === "medium" ? (
    <AlertTriangle className="h-5 w-5 text-orange-400 dark:text-orange-500" />
  ) : templateData.severity === "low" ? (
    <Info className="h-5 w-5 text-blue-500 dark:text-blue-600" />
  ) : null;

  return (
    <>
      {templateLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : templateError ? (
        <span>Error</span>
      ) : (
        <AccordionItem value={props.groupedNotifications.template}>
          <AccordionTrigger className="px-2">
            <div className="flex flex-row items-center gap-2">
              {icon}
              <h3 className="text-xl">{templateData.title}</h3>
              <h3 className="text-muted-foreground">{templateData.message}</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-2">
            {props.groupedNotifications.days.map((d) => (
              <div
                key={d.day}
                className="flex flex-col gap-4 border-l border-l-muted px-4"
              >
                <h5 className="text-[1.06rem]">{d.day}:</h5>
                <div className="flex flex-row flex-wrap items-center gap-2">
                  {d.notifications.map((n) => (
                    <TooltipProvider key={n.id}>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                          <Badge variant="outline" className={color}>
                            {format(parseISO(n.timestamp), "hh:mm")}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          {format(parseISO(n.timestamp), "dd.MM.yyyy hh:mm:ss")}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      )}
    </>
  );
}

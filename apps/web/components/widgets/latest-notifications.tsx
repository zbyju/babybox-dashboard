import GroupNotificationAccordionItem from "./grouped-notifications-accordion-item";
import { Notification } from "../../types/notification.types";
import { processNotifications } from "@/utils/notifications";
import { Accordion } from "@radix-ui/react-accordion";

interface Props {
  notifications: Notification[];
}

export default function LatestNotifications(props: Props) {
  const groupedNotifications = processNotifications(props.notifications);

  return (
    <div className="flex w-full flex-col gap-4">
      {groupedNotifications.groups.map((group) => (
        <Accordion key={group.template} type="multiple">
          <GroupNotificationAccordionItem groupedNotifications={group} />
        </Accordion>
      ))}
    </div>
  );
}

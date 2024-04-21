import {
  NotificationsByTemplateGroupedByDays,
  Notification,
  DailyNotification,
  NotificationsGroupedByTemplate,
  ProcessedNotifications,
} from "@/types/notification.types";
import {
  compareAsc,
  compareDesc,
  differenceInCalendarDays,
  format,
  parse,
  parseISO,
} from "date-fns";
import { cs } from "date-fns/locale";

const getDay = (timestamp: string): string => {
  return format(parseISO(timestamp), "dd.MM.yyyy", { locale: cs });
};

// Group notifications by template
export const groupNotificationsByTemplate = (
  notifications: Notification[],
): NotificationsGroupedByTemplate[] => {
  const templateMap: Record<string, Notification[]> = {};
  notifications.forEach((notification) => {
    if (!templateMap[notification.template]) {
      templateMap[notification.template] = [];
    }
    templateMap[notification.template].push(notification);
  });
  const groupedNotifications: NotificationsGroupedByTemplate[] = Object.entries(
    templateMap,
  ).map(([template, notifications]) => ({
    template,
    notifications,
  }));

  // Sorting the grouped notifications by template
  groupedNotifications.sort((a, b) => a.template.localeCompare(b.template));

  return groupedNotifications;
};

// Group notifications by day for a given list of notifications under the same template
export const groupNotificationsByDay = (
  groupedTemplateNotifications: NotificationsGroupedByTemplate[],
): NotificationsByTemplateGroupedByDays[] => {
  return groupedTemplateNotifications.map((group) => {
    const dailyMap: Record<string, DailyNotification> = {};
    group.notifications.forEach((notification) => {
      const day = getDay(notification.timestamp);
      if (!dailyMap[day]) {
        dailyMap[day] = { day, notifications: [] };
      }
      dailyMap[day].notifications.push({
        id: notification._id,
        timestamp: notification.timestamp,
        slug: notification.slug,
      });
    });
    const days = Object.values(dailyMap).sort((a, b) =>
      compareAsc(
        parse(a.day, "dd.MM.yyyy", new Date()),
        parse(b.day, "dd.MM.yyyy", new Date()),
      ),
    );
    return {
      template: group.template,
      days,
    };
  });
};

const areConsecutiveDays = (day1: string, day2: string): boolean => {
  const date1 = parse(day1, "dd.MM.yyyy", new Date(), { locale: cs });
  const date2 = parse(day2, "dd.MM.yyyy", new Date(), { locale: cs });
  return Math.abs(differenceInCalendarDays(date2, date1)) === 1;
};

export const mergeConsecutiveDays = (
  groups: NotificationsByTemplateGroupedByDays[],
): NotificationsByTemplateGroupedByDays[] => {
  return groups.map((group) => {
    const result: DailyNotification[] = [];
    for (const day of group.days) {
      if (result.length === 0) {
        result.push(day);
        continue;
      }

      const last = result[result.length - 1];
      const lastDaySplit = last.day.split("-");
      const lastDay = lastDaySplit[lastDaySplit.length - 1];
      if (areConsecutiveDays(lastDay, day.day)) {
        last.day = `${lastDaySplit[0]}-${day.day}`;
        last.notifications.push(...day.notifications);
      } else {
        result.push(day);
      }
    }

    return {
      ...group,
      days: result,
    };
  });
};

// Main function to process notifications
export const processNotifications = (
  notifications: Notification[],
): ProcessedNotifications => {
  const groupedByTemplate = groupNotificationsByTemplate(notifications);
  const groupsByDay = groupNotificationsByDay(groupedByTemplate);
  const mergedGroups = mergeConsecutiveDays(groupsByDay);

  return {
    groups: mergedGroups.map((g) => ({
      ...g,
      days: g.days.sort((a, b) => {
        const aDate = parse(a.day.split("-")[0], "dd.MM.yyyy", new Date(), {
          locale: cs,
        });
        const bDate = parse(b.day.split("-")[0], "dd.MM.yyyy", new Date(), {
          locale: cs,
        });
        return compareDesc(aDate, bDate);
      }),
    })),
  };
};

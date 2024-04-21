export interface NotificationTemplate {
  _id?: string;
  scope: string;
  title: string;
  message: string;
  severity: "low" | "medium" | "high";
  variable: string;
  comparison: "<" | ">" | "<=" | ">=" | "==" | "!=";
  value: number;
  notify_new_error: boolean;
  streak: number;
  delay: number;
  emails: string[];
}

export interface Notification {
  _id: string;
  template: string;
  timestamp: string;
  slug: string;
}

export interface DailyNotification {
  day: string;
  notifications: Array<{ id: string; timestamp: string; slug: string }>;
}

export interface NotificationsByTemplateGroupedByDays {
  template: string;
  days: DailyNotification[];
}

export interface NotificationsGroupedByTemplate {
  template: string;
  notifications: Notification[];
}

export interface ProcessedNotifications {
  groups: NotificationsByTemplateGroupedByDays[];
}

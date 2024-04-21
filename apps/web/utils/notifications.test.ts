import {
  groupNotificationsByDay,
  groupNotificationsByTemplate,
  mergeConsecutiveDays,
  processNotifications,
} from "./notifications";
import {
  Notification,
  NotificationsByTemplateGroupedByDays,
} from "../types/notification.types";

describe("groupNotificationsByTemplate", () => {
  test("groups an empty array of notifications", () => {
    const notifications: Notification[] = [];
    const grouped = groupNotificationsByTemplate(notifications);
    expect(grouped).toEqual([]);
  });

  test("groups multiple notifications under the same template", () => {
    const notifications: Notification[] = [
      {
        _id: "1",
        template: "temp_001",
        timestamp: "2023-04-20T12:00:00",
        slug: "test",
      },
      {
        _id: "2",
        template: "temp_001",
        timestamp: "2023-04-21T12:00:00",
        slug: "test",
      },
    ];
    const grouped = groupNotificationsByTemplate(notifications);
    expect(grouped).toEqual([
      {
        template: "temp_001",
        notifications,
      },
    ]);
  });

  test("groups notifications under different templates", () => {
    const notifications: Notification[] = [
      {
        _id: "1",
        template: "temp_001",
        timestamp: "2023-04-20T12:00:00",
        slug: "test",
      },
      {
        _id: "2",
        template: "temp_002",
        timestamp: "2023-04-20T12:00:00",
        slug: "test",
      },
    ];
    const grouped = groupNotificationsByTemplate(notifications);
    expect(grouped).toHaveLength(2);
    expect(grouped).toContainEqual({
      template: "temp_001",
      notifications: [notifications[0]],
    });
    expect(grouped).toContainEqual({
      template: "temp_002",
      notifications: [notifications[1]],
    });
  });

  test("ensures notifications are correctly copied into groups without reference issues", () => {
    const notifications: Notification[] = [
      {
        _id: "1",
        template: "temp_001",
        timestamp: "2023-04-20T12:00:00",
        slug: "test",
      },
      {
        _id: "2",
        template: "temp_001",
        timestamp: "2023-04-21T12:00:00",
        slug: "test",
      },
    ];
    const grouped = groupNotificationsByTemplate(notifications);
    expect(grouped[0].notifications).toEqual(notifications);
    expect(grouped[0].notifications).not.toBe(notifications); // They should not be the same reference
  });
});

describe("groupNotificationsByDay", () => {
  test("correctly groups a single template with no notifications", () => {
    const groupedTemplateNotifications = [
      { template: "temp_001", notifications: [] },
    ];
    const result = groupNotificationsByDay(groupedTemplateNotifications);
    expect(result).toEqual([{ template: "temp_001", days: [] }]);
  });

  test("correctly groups a single template with multiple notifications on the same day", () => {
    const notifications = [
      {
        _id: "1",
        template: "temp_001",
        timestamp: "2023-04-20T08:00:00",
        slug: "test",
      },
      {
        _id: "2",
        template: "temp_001",
        timestamp: "2023-04-20T09:00:00",
        slug: "test",
      },
    ];
    const groupedTemplateNotifications = [
      { template: "temp_001", notifications },
    ];
    const result = groupNotificationsByDay(groupedTemplateNotifications);
    expect(result).toEqual([
      {
        template: "temp_001",
        days: [
          {
            day: "20.04.2023",
            notifications: [
              { id: "1", timestamp: "2023-04-20T08:00:00", slug: "test" },
              { id: "2", timestamp: "2023-04-20T09:00:00", slug: "test" },
            ],
          },
        ],
      },
    ]);
  });

  test("correctly groups a single template with notifications on multiple days", () => {
    const notifications = [
      {
        _id: "1",
        template: "temp_001",
        timestamp: "2023-04-20T10:00:00",
        slug: "test",
      },
      {
        _id: "2",
        template: "temp_001",
        timestamp: "2023-04-21T10:00:00",
        slug: "test",
      },
    ];
    const groupedTemplateNotifications = [
      { template: "temp_001", notifications },
    ];
    const result = groupNotificationsByDay(groupedTemplateNotifications);
    expect(result.find((r) => r.template === "temp_001")?.days).toHaveLength(2);
  });

  test("correctly groups multiple templates with overlapping days", () => {
    const groupedTemplateNotifications = [
      {
        template: "temp_001",
        notifications: [
          {
            _id: "1",
            template: "temp_001",
            timestamp: "2023-04-20T12:00:00",
            slug: "test",
          },
          {
            _id: "2",
            template: "temp_001",
            timestamp: "2023-04-21T12:00:00",
            slug: "test",
          },
        ],
      },
      {
        template: "temp_002",
        notifications: [
          {
            _id: "3",
            template: "temp_002",
            timestamp: "2023-04-20T08:00:00",
            slug: "test",
          },
          {
            _id: "4",
            template: "temp_002",
            timestamp: "2023-04-21T08:00:00",
            slug: "test",
          },
        ],
      },
    ];
    const result = groupNotificationsByDay(groupedTemplateNotifications);
    expect(result).toEqual([
      {
        template: "temp_001",
        days: [
          {
            day: "20.04.2023",
            notifications: [
              { id: "1", timestamp: "2023-04-20T12:00:00", slug: "test" },
            ],
          },
          {
            day: "21.04.2023",
            notifications: [
              { id: "2", timestamp: "2023-04-21T12:00:00", slug: "test" },
            ],
          },
        ],
      },
      {
        template: "temp_002",
        days: [
          {
            day: "20.04.2023",
            notifications: [
              { id: "3", timestamp: "2023-04-20T08:00:00", slug: "test" },
            ],
          },
          {
            day: "21.04.2023",
            notifications: [
              { id: "4", timestamp: "2023-04-21T08:00:00", slug: "test" },
            ],
          },
        ],
      },
    ]);
  });

  test("ensures notifications are sorted by day within each template", () => {
    const notifications = [
      {
        _id: "3",
        template: "temp_001",
        timestamp: "2023-04-22T12:00:00",
        slug: "test",
      },
      {
        _id: "1",
        template: "temp_001",
        timestamp: "2023-04-20T12:00:00",
        slug: "test",
      },
      {
        _id: "2",
        template: "temp_001",
        timestamp: "2023-04-21T12:00:00",
        slug: "test",
      },
    ];
    const groupedTemplateNotifications = [
      { template: "temp_001", notifications },
    ];
    const result = groupNotificationsByDay(groupedTemplateNotifications);
    expect(result).toEqual([
      {
        template: "temp_001",
        days: [
          {
            day: "20.04.2023",
            notifications: [
              { id: "1", timestamp: "2023-04-20T12:00:00", slug: "test" },
            ],
          },
          {
            day: "21.04.2023",
            notifications: [
              { id: "2", timestamp: "2023-04-21T12:00:00", slug: "test" },
            ],
          },
          {
            day: "22.04.2023",
            notifications: [
              { id: "3", timestamp: "2023-04-22T12:00:00", slug: "test" },
            ],
          },
        ],
      },
    ]);
  });
});

describe("mergeConsecutiveDays", () => {
  test("merges consecutive days correctly", () => {
    const input: NotificationsByTemplateGroupedByDays[] = [
      {
        template: "temp_001",
        days: [
          {
            day: "31.12.2020",
            notifications: [
              { id: "1", timestamp: "2020-12-31T12:00:00", slug: "test" },
            ],
          },
          {
            day: "01.01.2021",
            notifications: [
              { id: "2", timestamp: "2021-01-01T12:00:00", slug: "test" },
            ],
          },
          {
            day: "02.01.2021",
            notifications: [
              { id: "3", timestamp: "2021-01-02T12:00:00", slug: "test" },
            ],
          },
        ],
      },
    ];

    const expected: NotificationsByTemplateGroupedByDays[] = [
      {
        template: "temp_001",
        days: [
          {
            day: "31.12.2020-02.01.2021",
            notifications: [
              { id: "1", timestamp: "2020-12-31T12:00:00", slug: "test" },
              { id: "2", timestamp: "2021-01-01T12:00:00", slug: "test" },
              { id: "3", timestamp: "2021-01-02T12:00:00", slug: "test" },
            ],
          },
        ],
      },
    ];

    const result = mergeConsecutiveDays(input);
    expect(result).toEqual(expected);
  });

  test("does not merge non-consecutive days", () => {
    const input: NotificationsByTemplateGroupedByDays[] = [
      {
        template: "temp_001",
        days: [
          {
            day: "31.12.2020",
            notifications: [
              { id: "1", timestamp: "2020-12-31T12:00:00Z", slug: "test" },
            ],
          },
          {
            day: "02.01.2021",
            notifications: [
              { id: "2", timestamp: "2021-01-02T12:00:00Z", slug: "test" },
            ],
          },
        ],
      },
    ];

    const result = mergeConsecutiveDays(input);
    expect(result).toEqual(input);
  });
});

describe("processNotifications", () => {
  test("processes and merges notifications correctly", () => {
    const notifications: Notification[] = [
      {
        _id: "1",
        template: "temp_001",
        timestamp: "2020-12-31T12:00:00",
        slug: "test",
      },
      {
        _id: "2",
        template: "temp_001",
        timestamp: "2021-01-01T12:00:00",
        slug: "test",
      },
      {
        _id: "3",
        template: "temp_001",
        timestamp: "2021-01-02T12:00:00",
        slug: "test",
      },
    ];

    const processed = processNotifications(notifications);
    expect(processed.groups).toEqual([
      {
        template: "temp_001",
        days: [
          {
            day: "31.12.2020-02.01.2021",
            notifications: [
              { id: "1", timestamp: "2020-12-31T12:00:00", slug: "test" },
              { id: "2", timestamp: "2021-01-01T12:00:00", slug: "test" },
              { id: "3", timestamp: "2021-01-02T12:00:00", slug: "test" },
            ],
          },
        ],
      },
    ]);
  });

  test("handles multiple templates without merging across them", () => {
    const notifications: Notification[] = [
      {
        _id: "1",
        template: "temp_001",
        timestamp: "2020-12-31T12:00:00",
        slug: "test",
      },
      {
        _id: "2",
        template: "temp_002",
        timestamp: "2021-01-01T12:00:00",
        slug: "test",
      },
    ];

    const processed = processNotifications(notifications);
    expect(processed.groups.length).toBe(2);
    expect(
      processed.groups.find((g) => g.template === "temp_001")?.days.length,
    ).toBe(1);
    expect(
      processed.groups.find((g) => g.template === "temp_002")?.days.length,
    ).toBe(1);
  });
});

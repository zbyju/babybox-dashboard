import { BabyboxIssue } from "@/types/babybox.types";

export type BabyboxIssueHistoryPoint = {
  type: "comment" | "state";
  value: string;
  timestamp: Date;
  username: string;
};

/**
 * Goes through the histories in issue and combines them into one array representing the whole history
 * First element in the history is the last event (oldest); last element is the latest event
 */
export function combineHistories(
  issue: BabyboxIssue,
): BabyboxIssueHistoryPoint[] {
  console.log(issue);
  const states = issue.state_history.map((s) => ({
    type: "state" as "state" | "comment",
    value: s.state,
    timestamp: s.timestamp,
    username: s.username,
  }));
  const comments = issue.comments.map((s) => ({
    type: "comment" as "state" | "comment",
    value: s.text,
    timestamp: s.timestamp,
    username: s.username,
  }));
  return states.concat(comments).sort((a, b) => {
    if (a.type === "state" && a.value === "created") return -1;
    if (b.type === "state" && b.value === "created") return 1;

    return a.timestamp.getTime() - b.timestamp.getTime();
  });
}

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { translateIssueState } from "@/utils/translations/issue";
import { BabyboxIssue, IssueState } from "@/types/issue.types";
import { colorizeStatus } from "@/utils/colorize/issues";
import { useAuth } from "../contexts/auth-context";
import { updateIssue } from "@/helpers/api-helper";
import { toast } from "sonner";

interface Props {
  value: IssueState;
  onChange: (value: IssueState) => void;
  onUpdate?: (issue: BabyboxIssue) => void;
  issue?: BabyboxIssue | undefined;
}

export default function IssueStateSelect({
  value,
  onChange,
  onUpdate,
  issue,
}: Props) {
  const { token, user } = useAuth();
  async function handleChange(value: IssueState) {
    onChange(value);

    if (
      issue === undefined ||
      issue.state_history[0].state === value ||
      user === undefined
    )
      return;

    const newIssue = {
      ...issue,
      state_history: issue.state_history.toSpliced(0, 0, {
        state: value,
        timestamp: new Date(),
        username: user.username,
      }),
    };

    try {
      const returned = await updateIssue(newIssue, token);
      toast.success("Status úspěšně změněn.");

      if (onUpdate === undefined) return;
      return onUpdate(returned);
    } catch (err) {
      toast.error("Vyskytla se chyba při změně statusu.");
      console.log(err);
    }
  }

  const content = ["solved", "closed", "in_progress", "planned", "open"].map(
    (c) => ({ value: c, label: translateIssueState(c) }),
  );
  return (
    <Select onValueChange={handleChange} value={value}>
      <SelectTrigger
        className="w-[180px]"
        style={{ color: colorizeStatus(value) }}
      >
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {content.map((v) => (
          <SelectItem
            value={v.value}
            key={v.value}
            style={{ color: colorizeStatus(v.value) }}
          >
            {v.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

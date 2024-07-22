"use client";

import { priorities } from "@/helpers/issue-helper";
import Autocomplete from "../ui/autocomplete";

interface Props {
  value: string | undefined;
  onChange: (value: string) => void;
}

export default function IssuePriorityAutocomplete({ value, onChange }: Props) {
  return (
    <Autocomplete
      values={priorities}
      value={value || ""}
      onChange={(x) => onChange(x)}
    />
  );
}

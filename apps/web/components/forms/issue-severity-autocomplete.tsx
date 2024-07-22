"use client";

import { severities } from "@/helpers/issue-helper";
import Autocomplete from "../ui/autocomplete";

interface Props {
  value: string | undefined;
  onChange: (value: string) => void;
}

export default function IssueSeverityAutocomplete({ value, onChange }: Props) {
  return (
    <Autocomplete
      values={severities}
      value={value || ""}
      onChange={(x) => onChange(x)}
    />
  );
}

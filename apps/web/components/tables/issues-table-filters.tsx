import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  BabyboxIssue,
  IssueFilters,
  IssueFiltersSchema,
} from "@/types/issue.types";
import { translateIssueState } from "@/utils/translations/issue";
import { DateRangePicker } from "../ui/date-range-picker";
import { UseFormReturn } from "react-hook-form";
import Combobox from "../ui/combobox";
import { Input } from "../ui/input";
import { z } from "zod";

interface Props {
  issues: BabyboxIssue[];
  form: UseFormReturn<IssueFilters, unknown, undefined>;
  onSubmit: (values: z.infer<typeof IssueFiltersSchema>) => unknown;
}

function getDistinct<T>(arr: Array<T>): Array<T> {
  return Array.from(new Set(arr));
}

export default function IssuesTableFilters({ form, onSubmit, issues }: Props) {
  const stateOptions = getDistinct(
    issues
      .map((i) => (i.state_history.length > 0 ? i.state_history[0].state : ""))
      .filter((x) => x),
  );
  const priorityOptions = getDistinct(
    issues.map((i) => i.priority || "").filter((x) => x),
  );
  const severityOptions = getDistinct(
    issues.map((i) => i.severity || "").filter((x) => x),
  );
  const typeOptions = getDistinct(issues.map((i) => i.issue.type));
  const maintenanceOptions = [
    { value: "all", label: "Vše" },
    { value: "assigned", label: "Přiřazeno" },
    { value: "not_assigned", label: "Nepřiřazeno" },
  ];

  const cRow = "flex flex-row items-center gap-4 flex-wrap";
  const cItem = "flex flex-col gap-y-1 space-y-0";
  const cLabel = "ml-1 my-0 py-0";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className={cRow + " mb-4"}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className={cItem}>
                  <FormLabel className={cLabel}>Název</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className={cItem}>
                  <FormLabel className={cLabel}>Babybox</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maintenanceFilter"
              render={({ field }) => (
                <FormItem className={cItem}>
                  <FormLabel className={cLabel}>Přiřazen servisu</FormLabel>
                  <FormControl>
                    <Combobox
                      values={maintenanceOptions}
                      selected={{
                        value: field.value,
                        label:
                          maintenanceOptions.find(
                            (o) => o.value === field.value,
                          )?.label || field.value,
                      }}
                      onSelect={(selectedValue) => {
                        field.onChange(selectedValue || "all");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className={cItem}>
                  <FormLabel className={cLabel}>Status</FormLabel>
                  <FormControl>
                    <Combobox
                      values={stateOptions.map((s) => ({
                        label: translateIssueState(s),
                        value: s,
                      }))}
                      selected={(() => {
                        if (field.value === undefined) {
                          return [];
                        }
                        return field.value?.map((x) => ({
                          value: x,
                          label: x,
                        }));
                      })()}
                      onSelect={(selectedValue) => {
                        field.onChange(selectedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={cRow + " mb-4"}>
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className={cItem}>
                  <FormLabel className={cLabel}>Priority</FormLabel>
                  <FormControl>
                    <Combobox
                      values={priorityOptions}
                      selected={(() => {
                        if (field.value === undefined) {
                          return [];
                        }
                        return field.value?.map((x) => ({
                          value: x,
                          label: x,
                        }));
                      })()}
                      onSelect={(selectedValue) => {
                        field.onChange(selectedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem className={cItem}>
                  <FormLabel className={cLabel}>Severity</FormLabel>
                  <FormControl>
                    <Combobox
                      values={severityOptions}
                      selected={(() => {
                        if (field.value === undefined) {
                          return [];
                        }
                        return field.value?.map((x) => ({
                          value: x,
                          label: x,
                        }));
                      })()}
                      onSelect={(selectedValue) => {
                        field.onChange(selectedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className={cItem}>
                  <FormLabel className={cLabel}>Typ chyby</FormLabel>
                  <FormControl>
                    <Combobox
                      values={typeOptions}
                      selected={(() => {
                        if (field.value === undefined) {
                          return [];
                        }
                        return field.value?.map((x) => ({
                          value: x,
                          label: x,
                        }));
                      })()}
                      onSelect={(selectedValue) => {
                        field.onChange(selectedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className={cItem}>
                  <FormLabel className={cLabel}>Vytvořeno</FormLabel>
                  <FormControl>
                    <DateRangePicker
                      date={{ from: field.value?.from, to: field.value?.to }}
                      onDateChange={(range) => field.onChange(range)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}

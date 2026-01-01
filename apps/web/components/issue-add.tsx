"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  BabyboxIssue,
  BabyboxIssueSchema,
  IssueState,
} from "@/types/issue.types";
import IssueSeverityAutocomplete from "./forms/issue-severity-autocomplete";
import IssuePriorityAutocomplete from "./forms/issue-priority-autocomplete";
import { maintenancesFetcher } from "@/fetchers/maintenance.fetcher";
import { BabyboxesContext } from "./contexts/babyboxes-context";
import { getSubtypes, types } from "@/helpers/issue-helper";
import IssueStateSelect from "./forms/issue-state-select";
import { DateTimePicker } from "./ui/date-time-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "./contexts/auth-context";
import Autocomplete from "./ui/autocomplete";
import { useContext, useState } from "react";
import { User } from "@/types/user.types";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { addSeconds } from "date-fns";
import Combobox from "./ui/combobox";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import useSWR from "swr";
import { z } from "zod";

export interface Props {
  issue?: Partial<BabyboxIssue>;
  onAdd: (issue: BabyboxIssue) => unknown;
  users: User[] | undefined;
}

export default function IssueAdd({ issue, onAdd, users }: Props) {
  const { babyboxes } = useContext(BabyboxesContext);
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const { token, user } = useAuth();

  const [state, setState] = useState<IssueState>("open");
  const [timestamp, setTimestamp] = useState<Date | undefined>(new Date());

  const form = useForm<z.infer<typeof BabyboxIssueSchema>>({
    resolver: zodResolver(BabyboxIssueSchema),
    defaultValues: {
      slug: "",
      title: "",
      priority: "",
      severity: "",
      issue: {
        type: "",
        subtype: "",
        description: "",
        context: "",
      },
      state_history: [],
      comments: [],
    },
  });

  const type = form.watch("issue.type");
  const slug = form.watch("slug");
  const subtypes = getSubtypes(type);

  const { data: maintenances } = useSWR(
    ["maintenaces/slug/" + slug, token],
    ([_, token]) => maintenancesFetcher(token, slug),
  );

  async function onSubmit(values: z.infer<typeof BabyboxIssueSchema>) {
    const issue: BabyboxIssue = {
      ...values,
      priority: values.priority || "Neuvedena",
      severity: values.severity || "Neuvedena",
      comments: [],
      state_history: [
        {
          state: state,
          timestamp: addSeconds(timestamp || new Date(), 1),
          username: user?.username || "",
        },
        {
          state: "created",
          timestamp: new Date(),
          username: user?.username || "",
        },
      ],
    };
    try {
      const res = await fetch(`${babyboxServiceURL}/v1/issues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issue),
      });
      const data = await res.json();
      if (res.ok && !data?.metadata?.err) {
        onAdd(values);
        form.reset();
        toast.success("Chyba úspěšně vytvořena.");
      } else {
        throw "err";
      }
    } catch (err) {
      console.log(err);
      toast.error("Chyba nebyla vytvořena.");
    }
  }

  const cRow = "flex flex-row items-center gap-4 flex-wrap";
  const cItem = "flex flex-col gap-y-1 space-y-0";
  const cLabel = "ml-1 my-0 py-0";
  const cHeading = "mb-[-10px] text-lg";

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <h6 className={cHeading}>Základní informace</h6>
            <div className={cRow}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className={cItem + " w-full"}>
                    <FormLabel className={cLabel}>Název*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={cRow}>
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className={cItem}>
                    <FormLabel className={cLabel}>Babybox*</FormLabel>
                    <FormControl>
                      <Combobox
                        values={babyboxes.map((bb) => ({
                          value: bb.slug,
                          label: bb.name,
                        }))}
                        selected={
                          field.value
                            ? { value: field.value, label: field.value }
                            : undefined
                        }
                        onSelect={(selectedValue) =>
                          field.onChange(selectedValue)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {maintenances && (
                <FormField
                  control={form.control}
                  name="maintenance_id"
                  render={({ field }) => (
                    <FormItem className={cItem}>
                      <FormLabel className={cLabel}>Servis ID</FormLabel>
                      <FormControl>
                        <Combobox
                          disabledLabel={slug ? undefined : "Vyberte Babybox"}
                          //@ts-expect-error xdd
                          values={maintenances.map((m) => ({
                            value: m.id,
                            label: m.title || m.id,
                          }))}
                          selected={
                            field.value
                              ? { value: field.value, label: field.value }
                              : undefined
                          }
                          onSelect={(selectedValue) =>
                            field.onChange(selectedValue)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className={cItem}>
                    <FormLabel className={cLabel}>Priorita</FormLabel>
                    <FormControl>
                      <IssuePriorityAutocomplete {...field} />
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
                    <FormLabel className={cLabel}>Severita</FormLabel>
                    <FormControl>
                      <IssueSeverityAutocomplete {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="timestamp"
                render={() => (
                  <FormItem className={cItem}>
                    <FormLabel className={cLabel}>Datum a čas chyby*</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={timestamp}
                        setDate={(newDate) => setTimestamp(newDate)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h6 className={cHeading}>Řešení chyby</h6>
            <div className={cRow}>
              <FormField
                name="state"
                render={() => (
                  <FormItem className={cItem}>
                    <FormLabel className="mb-[4px]">Status*</FormLabel>
                    <FormControl>
                      <IssueStateSelect value={state} onChange={setState} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {users ? (
                <FormField
                  control={form.control}
                  name="assignee"
                  render={({ field }) => (
                    <FormItem className={cItem}>
                      <FormLabel className="mt-[4px]">
                        Vyřešení přidělit
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          values={users.map((u) => ({
                            label: u.username,
                            value: u.username,
                          }))}
                          selected={
                            field.value
                              ? { value: field.value, label: field.value }
                              : undefined
                          }
                          onSelect={(selectedValue) =>
                            field.onChange(selectedValue)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
            </div>

            <h6 className={cHeading}>Kategorie Chyby</h6>
            <div className={cRow}>
              <FormField
                control={form.control}
                name="issue.type"
                render={({ field }) => (
                  <FormItem className={cItem}>
                    <FormLabel className="mt-[4px]">Typ chyby*</FormLabel>
                    <FormControl>
                      <Autocomplete
                        values={types.map((t) => ({ value: t, label: t }))}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          form.setValue("issue.subtype", "");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issue.subtype"
                render={({ field }) => (
                  <FormItem className={cItem}>
                    <FormLabel className="mt-[4px]">Podtyp chyby*</FormLabel>
                    <FormControl>
                      <Autocomplete
                        values={subtypes}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h6 className={cHeading}>Detail chyby</h6>
            <div className={cRow}>
              <FormField
                control={form.control}
                name="issue.description"
                render={({ field }) => (
                  <FormItem className="flex grow flex-col gap-y-1 space-y-0">
                    <FormLabel className="mt-[4px]">Popis chyby</FormLabel>
                    <FormControl>
                      <Textarea className="h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issue.context"
                render={({ field }) => (
                  <FormItem className="flex grow flex-col gap-y-1 space-y-0">
                    <FormLabel className="mt-[4px]">Kontext chyby</FormLabel>
                    <FormControl>
                      <Textarea className="h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button className="my-4" type="submit">
            Uložit
          </Button>
        </form>
      </Form>
    </div>
  );
}

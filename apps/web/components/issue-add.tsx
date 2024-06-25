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
  getSubtypes,
  priorities,
  severities,
  types,
} from "@/helpers/issue-helper";
import { BabyboxIssue, BabyboxIssueSchema } from "@/types/babybox.types";
import { BabyboxesContext } from "./contexts/babyboxes-context";
import { DateTimePicker } from "./ui/date-time-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Babybox } from "./tables/babyboxes-table";
import { useAuth } from "./contexts/auth-context";
import Autocomplete from "./ui/autocomplete";
import { User } from "@/types/user.types";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import Combobox from "./ui/combobox";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useContext } from "react";
import { toast } from "sonner";
import { z } from "zod";

export interface Props {
  onAdd: (issue: BabyboxIssue) => unknown;
  users: User[] | undefined;
}

export default function IssueAdd({ onAdd, users }: Props) {
  const babyboxes = useContext(BabyboxesContext) as Babybox[];
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const { token } = useAuth();

  const form = useForm<z.infer<typeof BabyboxIssueSchema>>({
    resolver: zodResolver(BabyboxIssueSchema),
    defaultValues: {
      priority: "",
      severity: "",
      issue: {
        type: "",
        subtype: "",
        description: "",
        context: "",
      },
      solvedAt: undefined,
      isSolved: false,
    },
  });

  const solved = form.watch("isSolved");
  const type = form.watch("issue.type");
  const subtypes = getSubtypes(type);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof BabyboxIssueSchema>) {
    console.log(values);
    console.log(JSON.stringify(values));
    try {
      const res = await fetch(`${babyboxServiceURL}/v1/issues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
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

  const cRow = "flex flex-row items-center gap-4";
  const cItem = "flex flex-col gap-y-1 space-y-0";
  const cLabel = "ml-1 my-0 py-0";
  const cHeading = "mb-[-10px] text-lg";

  return (
    <div>
      <h4 className="mb-3 mt-6 text-3xl font-semibold">Reportovat chybu</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <h6 className={cHeading}>Základní informace</h6>
            <div className={cRow}>
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className={cItem}>
                    <FormLabel className={cLabel}>Babybox</FormLabel>
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

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className={cItem}>
                    <FormLabel className={cLabel}>Priorita</FormLabel>
                    <FormControl>
                      <Autocomplete
                        values={priorities}
                        value={field.value}
                        onChange={(x) => field.onChange(x)}
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
                    <FormLabel className={cLabel}>Severita</FormLabel>
                    <FormControl>
                      <Autocomplete
                        values={severities}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timestamp"
                render={({ field }) => (
                  <FormItem className={cItem}>
                    <FormLabel className={cLabel}>Datum a čas chyby</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={(newDate) => field.onChange(newDate)}
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
                control={form.control}
                name="isSolved"
                render={({ field }) => (
                  <FormItem className={cItem}>
                    <FormLabel className="mb-[12px]">Chyba vyřešena</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (!checked) {
                            form.setValue("solvedAt", undefined);
                          } else {
                            form.setValue("assignee", undefined);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {solved ? (
                <FormField
                  control={form.control}
                  name="solvedAt"
                  render={({ field }) => (
                    <FormItem className={cItem}>
                      <FormLabel className="mt-[4px]">
                        Datum a čas vyřešení
                      </FormLabel>
                      <FormControl>
                        <DateTimePicker
                          date={field.value}
                          setDate={(newDate) => field.onChange(newDate)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              {!solved && users ? (
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
                    <FormLabel className="mt-[4px]">Typ chyby</FormLabel>
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
                    <FormLabel className="mt-[4px]">Podtyp chyby</FormLabel>
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
                  <FormItem className="flex flex-grow flex-col gap-y-1 space-y-0">
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
                  <FormItem className="flex flex-grow flex-col gap-y-1 space-y-0">
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

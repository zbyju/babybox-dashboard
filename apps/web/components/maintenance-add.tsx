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
  BabyboxMaintenance,
  BabyboxMaintenanceSchema,
} from "@/types/maintenance.types";
import { createBabyboxMaintenance } from "@/fetchers/maintenance.fetcher";
import { BabyboxesContext } from "./contexts/babyboxes-context";
import { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { issuesFetcher } from "@/helpers/api-helper";
import { Babybox } from "./tables/babyboxes-table";
import { useAuth } from "./contexts/auth-context";
import { DatePicker } from "./ui/date-picker";
import { User } from "@/types/user.types";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import Combobox from "./ui/combobox";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import useSWR from "swr";
import { z } from "zod";

export interface Props {
  onAdd: (maintenance: BabyboxMaintenance) => unknown;
  users: User[] | undefined;
  maintenance?: Partial<BabyboxMaintenance>;
}

export default function MaintenanceAdd({ onAdd, users, maintenance }: Props) {
  const babyboxes = useContext(BabyboxesContext) as Babybox[];
  const { token } = useAuth();

  const [maintenanceIssues, setMaintenanceIssues] = useState<string[]>([]);

  const form = useForm<z.infer<typeof BabyboxMaintenanceSchema>>({
    resolver: zodResolver(BabyboxMaintenanceSchema),
    defaultValues: {
      ...maintenance,
      state: "open",
    },
  });
  const slug = form.watch("slug");

  useEffect(() => {
    setMaintenanceIssues([]);
  }, [slug]);

  const { data: issues } = useSWR(
    ["issues/slug/" + slug, token],
    ([_, token]) => issuesFetcher(token, slug),
  );

  async function onSubmit(
    maintenance: z.infer<typeof BabyboxMaintenanceSchema>,
  ) {
    if (maintenance.distance === 0) delete maintenance.distance;
    try {
      const newMaintenance = await createBabyboxMaintenance(
        maintenance,
        maintenanceIssues,
        token,
      );
      onAdd(newMaintenance);
      form.reset();
      toast.success("Servis úspěšně vytvořen.");
    } catch (err) {
      console.error(err);
      toast.error("Servis nebyl vytvořen.");
    }
  }

  const cRow = "flex flex-row flex-wrap items-center gap-4";
  const cItem = "flex flex-col gap-y-1 space-y-0";
  const cLabel = "ml-1 my-0 py-0";
  const cHeading = "mb-[-10px] text-lg";

  return (
    <div>
      <h4 className="mb-3 mt-6 text-3xl font-semibold">Vytvořit servis</h4>
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
                      <Input
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={cRow}>
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem className={cItem}>
                    <FormLabel className={cLabel}>Začátek*</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onChange={(newDate) => field.onChange(newDate)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem className={cItem}>
                    <FormLabel className={cLabel}>Konec</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onChange={(newDate) => field.onChange(newDate)}
                      />
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
                name="maintenance"
                render={() => (
                  <FormItem className={cItem}>
                    <FormLabel className={cLabel}>Chyby</FormLabel>
                    <FormControl>
                      <Combobox
                        values={(issues || [])
                          .filter(
                            (i) =>
                              i.id &&
                              i.maintenance_id === undefined &&
                              i.slug === slug &&
                              !["closed", "solved"].includes(
                                i.state_history.at(0)?.state || "",
                              ),
                          )
                          .sort((a, b) => {
                            const as = a.state_history.at(0)?.state;
                            const bs = b.state_history.at(0)?.state;

                            return as === "open" && bs === "open"
                              ? a.title.localeCompare(b.title)
                              : as === "open"
                                ? -1
                                : bs === "open"
                                  ? 1
                                  : a.title.localeCompare(b.title);
                          })
                          .map((i) => ({ value: i.id || "", label: i.title }))}
                        selected={maintenanceIssues.map((i) => ({
                          value: i,
                          label: i,
                        }))}
                        onSelect={(selectedValue) => {
                          const val = Array.isArray(selectedValue)
                            ? selectedValue
                            : [selectedValue];
                          setMaintenanceIssues(val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h6 className={cHeading}>Další informace</h6>
            <div className="flex flex-row items-start gap-4">
              {users && (
                <FormField
                  control={form.control}
                  name="assignee"
                  render={({ field }) => (
                    <FormItem className={cItem}>
                      <FormLabel>Přiřazení uživateli</FormLabel>
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
              )}
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem className={cItem}>
                    <FormLabel>Ujetých km</FormLabel>
                    <FormControl>
                      <Input type="number" defaultValue={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={cRow}>
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="flex flex-grow flex-col gap-y-1 space-y-0">
                    <FormLabel>Poznámka</FormLabel>
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

"use client";

import {
  BabyboxIssue,
  BabyboxIssueSchema,
  BabyboxMaintenance,
  BabyboxMaintenanceSchema,
} from "@/types/babybox.types";
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
import { BabyboxesContext } from "./contexts/babyboxes-context";
import { DateTimePicker } from "./ui/date-time-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Babybox } from "./tables/babyboxes-table";
import { useAuth } from "./contexts/auth-context";
import { DatePicker } from "./ui/date-picker";
import Autocomplete from "./ui/autocomplete";
import { User } from "@/types/user.types";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import Combobox from "./ui/combobox";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { useContext } from "react";
import { toast } from "sonner";
import { z } from "zod";

export interface Props {
  onAdd: (maintenance: BabyboxMaintenance) => unknown;
  users: User[] | undefined;
}

export default function MaintenanceAdd({ onAdd, users }: Props) {
  const babyboxes = useContext(BabyboxesContext) as Babybox[];
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const { token } = useAuth();

  const form = useForm<z.infer<typeof BabyboxMaintenanceSchema>>({
    resolver: zodResolver(BabyboxMaintenanceSchema),
    defaultValues: {
      state: "opened",
      start: new Date(),
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof BabyboxMaintenanceSchema>) {
    try {
      const distance = values.distance
        ? parseFloat(values.distance)
        : undefined;
      const maintenance: BabyboxMaintenance = { ...values, distance };
      const res = await fetch(`${babyboxServiceURL}/v1/maintenances`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(maintenance),
      });
      const data = await res.json();
      if (res.ok && !data?.metadata?.err) {
        onAdd(maintenance);
        form.reset();
        toast.success("Servis úspěšně vytvořen.");
      } else {
        throw data?.metadata?.err;
      }
    } catch (err) {
      console.log(err);
      toast.error("Servis nebyl vytvořen.");
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
                name="slugs"
                render={({ field }) => (
                  <FormItem className={cItem}>
                    <FormLabel className={cLabel}>Babyboxy</FormLabel>
                    <FormControl>
                      <Combobox
                        values={babyboxes.map((u) => ({
                          label: u.name,
                          value: u.slug,
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
                          console.log(selectedValue);
                          field.onChange(selectedValue);
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
                      <FormLabel>Popis chyby</FormLabel>
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
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

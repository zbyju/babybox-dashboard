import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import IssuePriorityAutocomplete from "./forms/issue-priority-autocomplete";
import IssueSeverityAutocomplete from "./forms/issue-severity-autocomplete";
import { BabyboxIssue, BabyboxIssueSchema } from "@/types/issue.types";
import { maintenancesFetcher } from "@/fetchers/maintenance.fetcher";
import IssueStateSelect from "./forms/issue-state-select";
import { fetcherWithToken } from "@/helpers/api-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "./contexts/auth-context";
import { useRouter } from "next/navigation";
import { User } from "@/types/user.types";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import Combobox from "./ui/combobox";
import { Button } from "./ui/button";
import { MouseEvent } from "react";
import { toast } from "sonner";
import axios from "axios";
import useSWR from "swr";
import { z } from "zod";

interface Props {
  issue: BabyboxIssue;
  onChange: (issue: BabyboxIssue) => void;
}

export function IssueEdit({ issue, onChange }: Props) {
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const { token, user } = useAuth();
  const form = useForm<z.infer<typeof BabyboxIssueSchema>>({
    resolver: zodResolver(BabyboxIssueSchema),
    defaultValues: issue,
  });
  const router = useRouter();

  const userServiceURL = process.env.NEXT_PUBLIC_URL_USER_SERVICE;
  const { data: userData } = useSWR(
    [`${userServiceURL}/v1/users/`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );

  async function onDelete(e: MouseEvent) {
    e.preventDefault();
    axios
      .delete(`${babyboxServiceURL}/v1/issues/${issue.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success(`Chyba ${issue.title} (ID: ${issue.id}) byla smazána.`);
        router.back();
      })
      .catch((error) => {
        toast.error(`Chyba nebyla smazána.`);
        console.error(error);
      });
  }
  async function onSubmit(values: z.infer<typeof BabyboxIssueSchema>) {
    const issue: BabyboxIssue = {
      ...values,
    };
    try {
      const res = await fetch(`${babyboxServiceURL}/v1/issues/${issue.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issue),
      });
      const data = await res.json();
      if (res.ok && !data?.metadata?.err) {
        onChange(values);
        toast.success("Chyba úspěšně aktualizována.");
      } else {
        throw "err";
      }
    } catch (err) {
      console.log(err);
      toast.error("Chyba nebyla aktualizována.");
    }
  }

  const { data: maintenances } = useSWR(
    ["maintenaces/slug/" + issue.slug, token],
    ([_, token]) => maintenancesFetcher(token, issue.slug),
  );

  const cItem = "flex flex-col gap-y-1 space-y-0";
  const cLabel = "ml-1 my-0 py-0";

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-2xl font-medium">Upravit chybu</h4>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className={cItem + " w-full"}>
                  <FormLabel className={cLabel}>Priorita*</FormLabel>
                  <FormControl>
                    <IssuePriorityAutocomplete
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
              name="severity"
              render={({ field }) => (
                <FormItem className={cItem + " w-full"}>
                  <FormLabel className={cLabel}>Severita*</FormLabel>
                  <FormControl>
                    <IssueSeverityAutocomplete
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
              name="assignee"
              render={({ field }) => (
                <FormItem className={cItem + " w-full"}>
                  <FormLabel className={cLabel}>Přiřadit</FormLabel>
                  <FormControl>
                    <Combobox
                      values={(userData?.data || []).map((u: User) => ({
                        label: u.username,
                        value: u.username,
                      }))}
                      selected={
                        field.value
                          ? { value: field.value, label: field.value }
                          : undefined
                      }
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

            <FormField
              control={form.control}
              name="state_history"
              render={({ field }) => (
                <FormItem className={cItem + " w-full"}>
                  <FormLabel className={cLabel}>Status*</FormLabel>
                  <FormControl>
                    <IssueStateSelect
                      value={field.value.at(0)?.state || "unknown"}
                      onChange={(newState) => {
                        const state_history = issue.state_history.toSpliced(
                          0,
                          0,
                          {
                            state: newState,
                            timestamp: new Date(),
                            username: user?.username,
                          },
                        );
                        field.onChange(state_history);
                      }}
                      onUpdate={() => {}}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maintenance_id"
              render={({ field }) => (
                <FormItem className={cItem + " w-full"}>
                  <FormLabel className={cLabel}>Servis ID</FormLabel>
                  <FormControl>
                    <Combobox
                      disabledLabel={
                        maintenances ? undefined : "Vyberte Babybox"
                      }
                      //@ts-expect-error xdd
                      values={(maintenances || []).map((m) => ({
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

            <FormField
              control={form.control}
              name="issue.description"
              render={({ field }) => (
                <FormItem className={cItem + " w-full"}>
                  <FormLabel className={cLabel}>Popis</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="w-[200px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issue.context"
              render={({ field }) => (
                <FormItem className={cItem + " w-full"}>
                  <FormLabel className={cLabel}>Kontext</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="w-[200px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4 flex flex-row flex-wrap gap-2">
            <Button className="inline-block" type="submit">
              Uložit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="inline-block">
                  Odstranit
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Jste jsi opravdu jistí, že chcete smazat tuto chybu?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tato akce nemůže být navrácena. Pokud určitě chcete
                    odstranit tento záznam o chybě, pak pokračujte kliknutím na
                    tlačítko smazat.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Storno</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive"
                    onClick={(e) => onDelete(e)}
                  >
                    Smazat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </Form>
    </div>
  );
}

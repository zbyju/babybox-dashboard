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
import {
  BabyboxMaintenance,
  BabyboxMaintenanceSchema,
} from "@/types/maintenance.types";
import { fetcherWithToken } from "@/helpers/api-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "./contexts/auth-context";
import { useRouter } from "next/navigation";
import { User } from "@/types/user.types";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import Combobox from "./ui/combobox";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MouseEvent } from "react";
import { toast } from "sonner";
import axios from "axios";
import useSWR from "swr";
import { z } from "zod";

interface Props {
  maintenance: BabyboxMaintenance;
  onChange: (maintenance: BabyboxMaintenance) => void;
}

export function MaintenanceEdit({ maintenance, onChange }: Props) {
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const { token } = useAuth();
  const form = useForm<z.infer<typeof BabyboxMaintenanceSchema>>({
    resolver: zodResolver(BabyboxMaintenanceSchema),
    defaultValues: maintenance,
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
      .delete(`${babyboxServiceURL}/v1/maintenances/${maintenance.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success(
          `Chyba ${maintenance.title} (ID: ${maintenance.id}) byla smazána.`,
        );
        router.back();
      })
      .catch((error) => {
        toast.error(`Chyba nebyla smazána.`);
        console.error(error);
      });
  }

  async function onComplete() {
    const newMaintenance: BabyboxMaintenance = {
      ...maintenance,
      end: new Date(),
      state: "completed",
    };
    try {
      const res = await fetch(
        `${babyboxServiceURL}/v1/maintenances/${maintenance.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMaintenance),
        },
      );
      const data = await res.json();
      if (res.ok && !data?.metadata?.err) {
        onChange(newMaintenance);
        toast.success("Servis úspěšně aktualizován.");
      } else {
        throw "err";
      }
    } catch (err) {
      console.log(err);
      toast.error("Servis nebyl aktualizován.");
    }
  }

  async function onSubmit(values: z.infer<typeof BabyboxMaintenanceSchema>) {
    const maintenance: BabyboxMaintenance = {
      ...values,
    };
    try {
      const res = await fetch(
        `${babyboxServiceURL}/v1/maintenances/${maintenance.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(maintenance),
        },
      );
      const data = await res.json();
      if (res.ok && !data?.metadata?.err) {
        onChange(values);
        toast.success("Servis úspěšně aktualizován.");
      } else {
        throw "err";
      }
    } catch (err) {
      console.log(err);
      toast.error("Servis nebyl aktualizován.");
    }
  }

  const cItem = "flex flex-col gap-y-1 space-y-0";
  const cLabel = "ml-1 my-0 py-0";

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-2xl font-medium">Upravit servis</h4>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
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

            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem className={cItem + " w-full"}>
                  <FormLabel className={cLabel}>Ujetých km</FormLabel>
                  <FormControl>
                    <Input type="number" defaultValue={0} {...field} />
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
              name="note"
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

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="inline-block">Uzavřít</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Jste si opravdu jistí, že chcete uzavřít tento servis?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tato akce nelze vrátit zpět, servis bude uzavřen a nebude
                    možné jej editovat. Chyby přiřazené k tomuto servisu bude
                    možné jakkoliv editovat nadále.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Storno</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive"
                    onClick={() => onComplete()}
                  >
                    Uzavřít servis
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

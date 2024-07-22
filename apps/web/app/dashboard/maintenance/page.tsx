"use client";

import MaintenanceTable from "@/components/tables/maintenance-table";
import { BabyboxMaintenance } from "@/types/maintenance.types";
import { useAuth } from "@/components/contexts/auth-context";
import MaintenanceAdd from "@/components/maintenance-add";
import { fetcherWithToken } from "@/helpers/api-helper";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import useSWR from "swr";

export default function Maintenances() {
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const { token } = useAuth();
  const {
    data: maintenancesData,
    isLoading: maintenancesIsLoading,
    mutate: mutateMaintenances,
  } = useSWR([`${babyboxServiceURL}/v1/maintenances`, token], ([url, token]) =>
    fetcherWithToken(url, token),
  );

  const userServiceURL = process.env.NEXT_PUBLIC_URL_USER_SERVICE;
  const { data: userData } = useSWR(
    [`${userServiceURL}/v1/users/`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );

  async function handleDeleteMaintenance(id: string) {
    try {
      await fetch(`${babyboxServiceURL}/v1/maintenances/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const maintenances = (maintenancesData?.data || []).filter(
        (u: BabyboxMaintenance) => u.id !== id,
      );
      mutateMaintenances({ ...maintenancesData, data: maintenances });
      toast.success("Servis úspěšně odebrán.");
    } catch (err) {
      toast.error("Nebylo možné odebrat servis.");
    }
  }

  function handleAddMaintenance(maintenance: BabyboxMaintenance) {
    const maintenances = (maintenancesData?.data || []).concat(maintenance);
    mutateMaintenances({ ...maintenancesData, data: maintenances });
  }

  return (
    <div className="mb-10 mt-2 w-full px-4 lg:px-[16%]">
      <div>
        <MaintenanceAdd onAdd={handleAddMaintenance} users={userData?.data} />
      </div>
      <div className="mt-4 flex w-full flex-col gap-4">
        <h2 className="text-3xl font-bold">Servisy</h2>
        {maintenancesIsLoading ? (
          <div className="mx-auto flex flex-col justify-center gap-4">
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
          </div>
        ) : (
          <MaintenanceTable
            maintenances={maintenancesData?.data || []}
            onDelete={handleDeleteMaintenance}
          />
        )}
      </div>
    </div>
  );
}

"use client";

import { useAuth } from "@/components/contexts/auth-context";
import UsersTable from "@/components/tables/users-table";
import { fetcherWithToken } from "@/helpers/api-helper";
import { Skeleton } from "@/components/ui/skeleton";
import UserAdd from "@/components/user-add";
import { User } from "@/types/user.types";
import { toast } from "sonner";
import useSWR from "swr";

export default function Users() {
  const userServiceURL = process.env.NEXT_PUBLIC_URL_USER_SERVICE;
  const { token } = useAuth();
  const {
    data: userData,
    isLoading: userIsLoading,
    mutate: mutateUser,
  } = useSWR([`${userServiceURL}/v1/users/`, token], ([url, token]) =>
    fetcherWithToken(url, token),
  );

  async function handleDeleteUser(username: string) {
    try {
      await fetch(`${userServiceURL}/v1/users/${username}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const users = (userData?.data || []).filter(
        (u: User) => u.username !== username,
      );
      mutateUser({ ...userData, data: users });
      toast.success("Uživatel úspěšně odebrán.");
    } catch (err) {
      toast.error("Nebylo možné odebrat uživatele.");
    }
  }

  function handleAddUser(user: User) {
    const users = (userData?.data || []).concat(user);
    mutateUser({ ...userData, data: users });
  }

  return (
    <div className="mb-10 mt-2 w-full px-4 lg:px-[16%]">
      <div className="mt-4 flex w-full flex-col gap-4">
        <h2 className="text-3xl font-bold">Uživatelé</h2>
        {userIsLoading ? (
          <div className="mx-auto flex flex-col justify-center gap-4">
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-8 w-11/12" />
          </div>
        ) : (
          <UsersTable
            users={userData?.data || []}
            onDelete={handleDeleteUser}
          />
        )}
      </div>
      <div>
        <UserAdd onAdd={handleAddUser} />
      </div>
    </div>
  );
}

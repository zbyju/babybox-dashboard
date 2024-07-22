"use client";

import { User, UserWithPassword } from "@/types/user.types";
import { useAuth } from "./contexts/auth-context";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "sonner";

export interface Props {
  onAdd?: (user: User) => void;
}

export default function UserAdd(props: Props) {
  const [user, setUser] = useState<UserWithPassword>({
    username: "",
    email: "",
    password: "",
  });

  const userServiceURL = process.env.NEXT_PUBLIC_URL_USER_SERVICE;
  const { token } = useAuth();

  async function handleUserAdd(user: UserWithPassword) {
    try {
      const res = await fetch(`${userServiceURL}/v1/users/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (res.ok && !data?.metadata?.err) {
        props.onAdd && props.onAdd(user);
        setUser({ username: "", password: "", email: "" });
        toast.success("Uživatel úspěšně vytvořen.");
      } else {
        throw "err";
      }
    } catch (err) {
      console.log(err);
      toast.error("Uživatel nebyl vytvořen.");
    }
  }
  return (
    <div>
      <h4 className="mb-3 mt-6 text-xl font-semibold">Přidat uživatele</h4>
      <form className="flex flex-row flex-wrap items-end gap-4">
        <div>
          <Label htmlFor="username">Uživatelské jméno</Label>
          <Input
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            id="username"
          />
        </div>
        <div>
          <Label htmlFor="password">Heslo</Label>
          <Input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            id="password"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            id="email"
          />
        </div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleUserAdd(user);
          }}
        >
          Přidat
        </Button>
      </form>
    </div>
  );
}

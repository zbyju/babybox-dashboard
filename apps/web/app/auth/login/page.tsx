"use client";

import { useAuth } from "@/components/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = (formData.get("username") as string) ?? "";
    const password = (formData.get("password") as string) ?? "";

    try {
      const success = await login(username, password);
      if (success) {
        router.push("/dashboard/babybox");
        toast.success("Úspěšně přihlášen.");
      } else {
        toast.error("Chyba při přihlašování.");
      }
    } catch (err) {
      toast.error("Chyba při přihlašování.");
    }
  };

  return (
    <form
      className="flex h-screen w-screen flex-col items-center justify-center"
      onSubmit={handleSubmit}
    >
      <div className="max-w-3/4 w-[400px] rounded-md border border-solid border-border px-10 py-8">
        <h1 className="mb-10 text-center text-4xl font-black">Login</h1>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-full">
            <Label htmlFor="username" className="mb-1">
              Přihlašovací jméno
            </Label>
            <Input type="text" name="username" id="username" />
          </div>
          <div className="w-full">
            <Label htmlFor="password" className="mb-1">
              Heslo
            </Label>
            <Input type="password" name="password" id="password" />
          </div>
          <div>
            <Button className="mt-7 px-5 py-6" type="submit">
              Přihlásit se
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

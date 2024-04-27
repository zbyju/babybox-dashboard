"use client";

import { useAuth } from "@/components/contexts/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Login() {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
    toast.success("Byli jste úspěšně odhlášeni!");
  }, [logout]);
  return (
    <div className="flex h-[100vh] w-screen flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-5xl font-black">Babybox Dashboard</h1>
      <span className="text-xl font-semibold ">Byli jste odhlášeni!</span>
      <p>
        Dále můžete pokračovat na úvodní stránku, nebo se můžete znovu
        příhlásit.
      </p>
      <div>
        <Link href="/auth/login" className="ml-2">
          <Button size="sm">Přihlásit se</Button>
        </Link>
        <Link href="/" className="ml-2">
          <Button size="sm" variant="secondary">
            Úvodní stránka
          </Button>
        </Link>
      </div>
    </div>
  );
}

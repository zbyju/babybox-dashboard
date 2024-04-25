"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/auth-context";
import { toast } from "sonner";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [redirected, setRedirected] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false && !redirected) {
      setRedirected(true);
      toast.error(
        "Nejste příhlášeni, pro přístup do dashboardu se prosím přihlašte.",
      );
      setTimeout(() => {
        router.push("/auth/login");
      }, 0);
    }
  }, [isAuthenticated, router, redirected]);

  if (isAuthenticated === false) {
    return (
      <div>
        <h1>Nejste příhlášeni, pokračujte na příhlášení zde:</h1>
        <Link href=""></Link>
      </div>
    );
  }

  return children;
};

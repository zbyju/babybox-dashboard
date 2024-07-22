"use client";

import { useAuth } from "./contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false && isLoaded) {
      toast.error(
        "Nejste příhlášeni, pro přístup do dashboardu se prosím přihlašte.",
      );
    }
  }, [isAuthenticated, router, isLoaded]);

  if (isAuthenticated === false && isLoaded) {
    return (
      <div className="flex h-[100vh] w-screen flex-col items-center justify-center gap-2 text-center">
        <div className="mb-4 flex flex-col items-center justify-center text-center">
          <span className="text-6xl font-black text-destructive">401</span>
          <span className="text-xl font-semibold text-destructive">
            Neautorizovaný přístup
          </span>
        </div>
        <h1 className="text-5xl font-black">Babybox Dashboard</h1>
        <p>
          Nejste přihlášen! Přihlašte se prosím!
          <Link href="/auth/login" className="ml-2">
            <Button size="sm">Přihlásit se</Button>
          </Link>
          .
        </p>
      </div>
    );
  }

  if (isAuthenticated === false && !isLoaded) {
    return (
      <div className="flex h-[100vh] w-screen items-center justify-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={70}
          height={70}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={"animate-spin text-primary"}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    );
  }

  return children;
};

"use client";

import { useAuth } from "@/components/contexts/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === true && isLoaded === true) {
      router.replace("/dashboard/babybox");
    }
  }, [isAuthenticated, isLoaded, router]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-5xl font-black">Babybox Dashboard</h1>
      <p>
        Nejste přihlášen! Přihlašte se prosím{" "}
        <Link className="underline" href="/auth/login">
          zde
        </Link>
        .
      </p>
    </div>
  );
}

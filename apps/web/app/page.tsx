"use client";

import { useAuth } from "@/components/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  if (user) {
    router.push("/dashboard/babybox");
  }

  return (
    <>
      {!user || (
        <div className="flex h-[100vh] w-screen flex-col items-center justify-center gap-2">
          <h1 className="text-5xl font-black">Babybox Dashboard</h1>
          <p>
            Nejste přihlášen! Přihlašte se prosím{" "}
            <Link className="underline" href="/auth/login">
              zde
            </Link>
            .
          </p>
        </div>
      )}
    </>
  );
}

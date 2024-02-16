"use client"

import { useAuth } from "@/components/contexts/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  if (user) {
    router.push("/app/babybox")
  }

  return (
    <div className="w-screen h-[100vh] flex flex-col gap-2 items-center justify-center">
      <h1 className="text-5xl font-black">Babybox Dashboard</h1>
      <p>Nejste přihlášen! Přihlašte se prosím <Link className="underline" href="/auth/login">zde</Link>.</p>
    </div>
  );
}

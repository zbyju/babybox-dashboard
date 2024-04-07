import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-[100vh] w-screen flex-col items-center justify-center gap-2 text-center">
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

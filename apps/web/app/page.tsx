import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-[100vh] flex flex-col gap-2 items-center justify-center">
      <h1 className="text-5xl font-black">Babybox Dashboard</h1>
      <p>Nejste přihlášen! Přihlašte se prosím <Link className="underline" href="/auth/login">zde</Link>.</p>
    </div>
  );
}

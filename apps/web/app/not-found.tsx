import GoBack from "@/components/go_back";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function Custom404() {
  return (
    <div>
      <div className="w-full h-full min-h-[80vh] flex flex-col justify-center items-center">
        <h1 className="text-3xl"><span className="font-bold">404</span> - Stránka nebyla nalezena</h1>
        <p>Pokračujte na hlavní stránku kliknutím <Link href="/" className="underline decoration-1">zde</Link>.</p>
        <p>Popřípadě se vraťte o krok zpět kliknutním <GoBack><span className="underline hover:cursor-pointer">zde</span></GoBack>.</p>
      </div>
    </div>
  )
}

import GoBack from "@/components/buttons/go_back";
import Link from "next/link";

export default function Custom404() {
  return (
    <div>
      <div className="flex h-full min-h-[80vh] w-full flex-col items-center justify-center text-center">
        <h1 className="text-3xl">
          <span className="font-bold">404</span> - Stránka nebyla nalezena
        </h1>
        <p>
          Pokračujte na hlavní stránku kliknutím{" "}
          <Link href="/" className="underline decoration-1">
            zde
          </Link>
          .
        </p>
        <p>
          Popřípadě se vraťte o krok zpět kliknutním{" "}
          <GoBack>
            <span className="underline hover:cursor-pointer">zde</span>
          </GoBack>
          .
        </p>
      </div>
    </div>
  );
}

"use client";

import { BabyboxBase } from "@/types/babybox.types";
import { createContext } from "react";

export const BabyboxesContext = createContext([] as unknown[]);

export function BabyboxesProvider({
  children,
  babyboxes,
}: Readonly<{
  children: React.ReactNode;
  babyboxes: BabyboxBase[];
}>) {
  return (
    <BabyboxesContext.Provider
      value={(babyboxes ?? []).sort((a: unknown, b: unknown) =>
        //@ts-expect-error temp
        a.slug.localeCompare(b.slug),
      )}
    >
      {children}
    </BabyboxesContext.Provider>
  );
}

"use client";

import { BabyboxBase } from "@/types/babybox.types";
import { babyboxes } from "@/data/babyboxes";
import { createContext } from "react";

export const BabyboxesContext = createContext({
  babyboxes: [] as BabyboxBase[],
  getBabyboxBySlug: ((slug: string | undefined) => {
    return { slug: slug, name: slug };
  }) as (slug: string | undefined) => BabyboxBase | undefined,
});

export function BabyboxesProvider({
  children,
  babyboxes,
}: Readonly<{
  children: React.ReactNode;
  babyboxes: BabyboxBase[];
}>) {
  return (
    <BabyboxesContext.Provider
      value={{
        babyboxes: (babyboxes ?? []).sort((a: unknown, b: unknown) =>
          //@ts-expect-error temp
          a.slug.localeCompare(b.slug),
        ),
        getBabyboxBySlug: (slug: string | undefined) => {
          if (slug === undefined) return undefined;
          return babyboxes.find((b) => b.slug === slug);
        },
      }}
    >
      {children}
    </BabyboxesContext.Provider>
  );
}

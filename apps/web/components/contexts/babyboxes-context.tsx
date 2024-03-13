"use client";

import { babyboxes } from "../../data/babyboxes";
import { createContext } from "react";

export const BabyboxesContext = createContext([] as unknown[]);

export function BabyboxesProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BabyboxesContext.Provider
      value={babyboxes.sort((a: unknown, b: unknown) =>
        //@ts-expect-error temp
        a.slug.localeCompare(b.slug),
      )}
    >
      {children}
    </BabyboxesContext.Provider>
  );
}

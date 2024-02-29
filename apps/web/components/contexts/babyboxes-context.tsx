"use client";

import { babyboxes } from "../../data/babyboxes";
import { createContext } from "react";

export const BabyboxesContext = createContext([] as any[]);

export function BabyboxesProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BabyboxesContext.Provider
      value={babyboxes.sort((a: any, b: any) => a.slug.localeCompare(b.slug))}
    >
      {children}
    </BabyboxesContext.Provider>
  );
}

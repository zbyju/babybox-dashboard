"use client";

import { BabyboxesContext } from "@/components/contexts/babyboxes-context";
import BabyboxesTable from "@/components/tables/babyboxes-table";
import { BabyboxBase } from "@/types/babybox.types";
import { useContext } from "react";

export default function Home() {
  const babyboxes = useContext(BabyboxesContext) as BabyboxBase[];

  return (
    <div className="mb-10 mt-2 px-4 lg:px-[16%]">
      <BabyboxesTable babyboxes={babyboxes} />
    </div>
  );
}

"use client";

import BabyboxesTable, { Babybox } from "@/components/tables/babyboxes-table";
import { BabyboxesContext } from "@/components/contexts/babyboxes-context";
import { useAuth } from "@/components/contexts/auth-context";
import { useContext, useEffect, useState } from "react";
import { BabyboxBase } from "@/types/babybox.types";

export default function Home() {
  const babyboxes = useContext(BabyboxesContext) as BabyboxBase[];

  return (
    <div className="mb-10 mt-2 px-4 lg:px-[16%]">
      <BabyboxesTable babyboxes={babyboxes} />
    </div>
  );
}

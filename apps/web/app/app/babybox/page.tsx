"use client"
import { BabyboxesContext } from "@/components/babyboxes-context";
import BabyboxesTable from "@/components/tables/babyboxes-table";
import { useContext } from "react";

export default function Home() {
  return (
    <div className="px-[10%] mt-2 mb-10">
      <BabyboxesTable />
    </div>
  );
}


"use client";

import { BabyboxesContext } from "@/components/contexts/babyboxes-context";
import BabyboxesTable from "@/components/tables/babyboxes-table";
import PageHeading from "@/components/misc/page-heading";
import { BabyboxBase } from "@/types/babybox.types";
import { useContext } from "react";

export default function Home() {
  const { babyboxes } = useContext(BabyboxesContext);

  return (
    <div className="mb-10 mt-4 px-4 lg:px-[16%]">
      <PageHeading heading="Babybox Dashboard" wrapperClassName="mb-0" />
      <BabyboxesTable babyboxes={babyboxes} />
    </div>
  );
}

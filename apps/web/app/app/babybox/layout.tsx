"use client";

import { BabyboxesProvider } from "../../../components/contexts/babyboxes-context";
import { useAuth } from "@/components/contexts/auth-context";
import Navbar from "@/components/navbar";

export default function BabyboxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const x = useAuth();

  return (
    <div>
      <BabyboxesProvider>
        <Navbar />
        {children}
      </BabyboxesProvider>
    </div>
  );
}

"use client";

import Navbar from "@/components/navbar";
export const dynamic = "force-dynamic";

export default function BabyboxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

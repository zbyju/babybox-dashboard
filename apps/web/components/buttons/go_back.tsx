"use client";

import { useRouter } from "next/navigation";

export default function GoBack({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return <span onClick={() => router.back()}>{children}</span>;
}

"use client";

import { ProtectedRoute } from "@/components/protected-route";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div className="pb-8 lg:pb-2">{children}</div>
    </ProtectedRoute>
  );
}

"use client";

import { ProtectedRoute } from "@/components/protected-route";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const env = process.env.NEXT_PUBLIC_NODE_ENV;

  if (env === "development") {
    return <div className="pb-8 lg:pb-2">{children}</div>;
  }

  return (
    <div className="pb-8 lg:pb-2">
      <ProtectedRoute>{children}</ProtectedRoute>
    </div>
  );
}

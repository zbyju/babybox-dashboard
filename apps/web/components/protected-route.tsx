import { useAuth } from "./contexts/auth-context";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      return;
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) {
    return <Loading />;
  }

  return children;
};

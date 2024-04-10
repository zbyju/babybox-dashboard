"use client";

import { useAuth } from "@/components/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "sonner";

export default function Login() {
  return (
    <div className="flex flex-row justify-center items-center text-center text-xl ">Byli jste odhlášeni!</div>
  );
}


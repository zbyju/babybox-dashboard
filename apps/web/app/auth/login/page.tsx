"use client"

import { useAuth } from "@/components/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";


export default function Login() {
  const { login } = useAuth()
  const router = useRouter()
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const username = e.target.username.value;
    const password = e.target.password.value;

    console.log('test')
    login(username)
    router.push('/app/babybox')
  };

  return (
    <form className="w-screen h-screen flex flex-col justify-center items-center" onSubmit={handleSubmit}>
      <div className="w-[400px] max-w-3/4 border-border border-solid border rounded-md px-10 py-8">
        <h1 className="mb-10 text-4xl font-black text-center">Login</h1>
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="w-full">
            <Label htmlFor="username" className="mb-1">Přihlašovací jméno</Label>
            <Input type="text" name="username" id="username" />
          </div>
          <div className="w-full">
            <Label htmlFor="password" className="mb-1">Heslo</Label>
            <Input type="password" name="password" id="password" />
          </div>
          <div>
            <Button className="mt-7 py-6 px-5" type="submit">Přihlásit se</Button>
          </div>
        </div>
      </div>
    </form>
  )
};




import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
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
            <Button className="mt-7 py-6 px-5">Přihlásit se</Button>
          </div>
        </div>
      </div>
    </div>
  )
}


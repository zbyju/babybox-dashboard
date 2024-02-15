import { useContext } from "react";
import { BabyboxesProvider } from "../../../components/babyboxes-context"
import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <BabyboxesProvider>
        <Navbar />
        {children}
      </BabyboxesProvider>
    </div>
  );
}


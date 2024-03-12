import { BabyboxesProvider } from "../../../components/contexts/babyboxes-context";
import Navbar from "@/components/navbar";

export default function BabyboxLayout({
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

import {
  fetchBabyboxNames,
  fetchSnapshotsBySlugAndN,
} from "@/helpers/api-helper";
import { BabyboxesProvider } from "../../../components/contexts/babyboxes-context";
import Navbar from "@/components/navbar";

export default async function BabyboxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const babyboxNames = await fetchBabyboxNames();
  const babyboxes = await Promise.all(
    babyboxNames.map(async (b) => {
      const snapshots = await fetchSnapshotsBySlugAndN(b.slug, 1);
      return {
        ...b,
        lastData: snapshots[0],
      };
    }),
  );
  return (
    <div>
      <BabyboxesProvider babyboxes={babyboxes}>
        <Navbar />
        {children}
      </BabyboxesProvider>
    </div>
  );
}

import LocationInformation from "@/components/location-information";
import NetworkConfiguration from "@/components/network-configuration";
import { Button } from "@/components/ui/button";
import { fetchBabyboxDetail } from "@/helpers/api-helper";
import { ArrowLeft, FilePenLine } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: { slug: string } }) {
  const babybox = await fetchBabyboxDetail(params.slug);
  return (
    <div className="mt-4 px-[5%] lg:px-[16%]">
      <div className="flex flex-row flex-wrap justify-between gap-4">
        <h2 className="ml-1 text-3xl font-semibold">
          <span className="font-bold text-pink-600">Babybox </span>
          <span className="capitalize">{babybox.name}</span>
        </h2>
        <div className="flex flex-row flex-wrap gap-4">
          <Link href={"/dashboard/babybox/" + params.slug + "/edit"}>
            <Button className="inline-flex flex-row items-center gap-2">
              <FilePenLine className="w-5" />
              Editovat
            </Button>
          </Link>
          <Link href={"/dashboard/babybox/" + params.slug}>
            <Button
              variant="secondary"
              className="inline-flex flex-row items-center gap-2"
            >
              <ArrowLeft className="w-5" />
              Zpět
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-row flex-wrap gap-6">
        {babybox.location && <LocationInformation address={babybox.location} />}

        {babybox.network_configuration && (
          <NetworkConfiguration
            networkConfiguration={babybox.network_configuration}
          />
        )}
      </div>
    </div>
  );
}

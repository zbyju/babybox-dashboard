import LocationInformation from "@/components/location-information";
import NetworkConfiguration from "@/components/network-configuration";
import ContactInformationTable from "@/components/tables/contact-information-table";
import MaintenanceTable from "@/components/tables/maintenance-table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FilePenLine } from "lucide-react";
import Link from "next/link";

export default function Home({ params }: { params: { slug: string } }) {
  return (
    <div className="mt-4 px-[16%]">
      <div className="flex flex-row flex-wrap justify-between gap-4">
        <h2 className="ml-1 text-3xl font-semibold">
          <span className="font-bold text-pink-600">Babybox </span>
          <span className="capitalize">{params.slug}</span>
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

      <div className="mt-6 flex flex-row gap-6">
        <LocationInformation
          address={{
            hospital: "Nemocnice Hello",
            city: "Praha",
            street: "Test 1234",
            postcode: "1234 23",
            coordinates: {
              latitude: 50.07615058737413,
              longitude: 14.475897782815395,
            },
          }}
        />

        <NetworkConfiguration
          networkConfiguration={{
            type: "vlan",
            ip: {
              router: "10.1.1.1",
              engineUnit: "10.1.1.5",
              thermalUnit: "10.1.1.6",
              camera: "10.1.1.7",
              pc: "10.1.1.10",
              gateway: "192.168.1.1",
            },
          }}
        />
      </div>

      <div className="mt-6 flex flex-row gap-6">
        <ContactInformationTable
          contacts={[
            {
              id: "1",
              name: "Jana Joe",
              email: "test@test.com",
              phone: "600 500 400",
              note: "Poznamka",
            },
          ]}
        />

        <MaintenanceTable
          maintenances={[{ timestamp: new Date(), note: "Poznamka" }]}
        />
      </div>
    </div>
  );
}

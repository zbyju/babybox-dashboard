import LocationInformationEdit from "@/components/location-information-edit";
import NetworkConfigurationEdit from "@/components/network-configuration-edit";
import ContactInformationTableEdit from "@/components/tables/contact-information-table-edit";
import MaintenanceTableEdit from "@/components/tables/maintenance-table-edit";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";

export default function Home({ params }: { params: { slug: string } }) {
  return (
    <div className="mt-4 px-[5%] lg:px-[16%]">
      <div className="flex flex-row flex-wrap justify-between gap-4">
        <h2 className="ml-1 inline-flex flex-row items-center gap-3 text-3xl font-semibold">
          <Pencil />
          <span className="font-bold text-pink-600">Babybox</span>
          <span className="capitalize">{params.slug}</span>
        </h2>
        <div className="flex flex-row flex-wrap gap-4">
          <Link href={"/app/babybox/" + params.slug}>
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

      <div className="mt-6 flex flex-row flex-wrap justify-center justify-items-center gap-6 lg:justify-start">
        <LocationInformationEdit
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

        <NetworkConfigurationEdit
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

      <div className="mt-6 flex flex-row flex-wrap  justify-start gap-6">
        <ContactInformationTableEdit
          contacts={[
            {
              id: "1",
              name: "Jana Joe",
              email: "test@test.com",
              phone: "600 500 400",
              note: "Poznamka",
            },
            {
              id: "2",
              name: "Joe Jester",
              email: "joe@test.com",
              phone: "123 456 789",
              note: "Note",
            },
          ]}
        />

        <MaintenanceTableEdit
          maintenances={[{ timestamp: new Date(), note: "Poznamka" }]}
        />
      </div>
    </div>
  );
}

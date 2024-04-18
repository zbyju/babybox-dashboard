"use client";

import { useAuth } from "@/components/contexts/auth-context";
import LocationInformationEdit from "@/components/location-information-edit";
import NetworkConfigurationEdit from "@/components/network-configuration-edit";
import ContactInformationTableEdit from "@/components/tables/contact-information-table-edit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetcherWithToken } from "@/helpers/api-helper";
import { ApiResponse } from "@/types/api.types";
import { BabyboxContact, BabyboxDetail } from "@/types/babybox.types";
import { ArrowLeft, Info, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function Home({ params }: { params: { slug: string } }) {
  const babyboxServiceURL = process.env.NEXT_PUBLIC_URL_BABYBOX_SERVICE;
  const { token } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    [`${babyboxServiceURL}/v1/babyboxes/${params.slug}`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );

  const [name, setName] = useState(data?.data?.name || params.slug);
  useEffect(() => {
    setName(data?.data?.name);
  }, [data]);

  if (error) return <div>Error!</div>;
  if (isLoading) return <div>Loading!</div>;

  const babyboxName = data?.data?.name || params.slug;

  async function updateBabybox(babybox: BabyboxDetail) {
    try {
      const response = await fetch(
        `${babyboxServiceURL}/v1/babyboxes/${params.slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(babybox),
        },
      );
      const result: ApiResponse<BabyboxDetail> = await response.json();
      mutate(result);
      toast.success("Babybox úspěšně aktualizován.");
    } catch (err) {
      toast.error("Nepodařilo se editovat Babybox.");
    }
  }

  return (
    <div className="mt-4 px-[5%] lg:px-[16%]">
      <div className="flex flex-row flex-wrap justify-between gap-4">
        <h2 className="ml-1 inline-flex flex-row items-center gap-3 text-3xl font-semibold">
          <Pencil />
          <span className="font-bold text-pink-600">Babybox</span>
          <span className="capitalize">{babyboxName}</span>
        </h2>
        <div className="flex flex-row flex-wrap gap-4">
          <Link href={"/dashboard/babybox/" + params.slug + "/detail"}>
            <Button className="inline-flex flex-row items-center gap-2">
              <Info className="w-5" />
              Informace
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

      <div className="mt-6 flex flex-row flex-wrap items-end justify-center justify-items-center gap-6 lg:justify-start">
        <div className="flex flex-col">
          <Label
            htmlFor="postcode"
            className="mb-2 leading-3 text-muted-foreground"
          >
            Název Babyboxu:
          </Label>
          <Input
            id="postcode"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button
          onClick={() =>
            updateBabybox({
              ...data.data,
              name,
            })
          }
        >
          Uložit
        </Button>
      </div>

      <div className="mt-6 flex flex-row flex-wrap justify-center justify-items-center gap-6 lg:justify-start">
        <LocationInformationEdit
          address={data?.data?.location}
          onClick={(location) =>
            updateBabybox({
              ...data.data,
              location,
            })
          }
        />

        <NetworkConfigurationEdit
          networkConfiguration={data?.data?.network_configuration}
          onClick={(networkConfiguration) =>
            updateBabybox({
              ...data.data,
              network_configuration: networkConfiguration,
            })
          }
        />

        <ContactInformationTableEdit 
          contacts={data?.data?.contacts || []}
          onClick={(contacts) =>
            updateBabybox({
              ...data.data,
              contacts: contacts,
            })
          }
          onRemove={(id) => {
            updateBabybox({
              ...data.data,
              contacts: data.data.contacts.filter((c: BabyboxContact) => c.id !== id)
            })
          }}
        />

      </div>
    </div>
  );
}

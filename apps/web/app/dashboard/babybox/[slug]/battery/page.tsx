import BatteryPageClient from "@/components/page-components/battery/client-page";

interface PageProps {
  params: { slug: string };
}

export default function BatteryPage({ params }: PageProps) {
  return <BatteryPageClient slug={params.slug} />;
}

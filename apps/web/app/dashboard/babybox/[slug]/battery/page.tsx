import BatteryPageClient from "@/components/page-components/battery/client-page";

interface PageParams {
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function BatteryPage({ params }: PageProps) {
  const { slug } = await params;

  return <BatteryPageClient slug={slug} />;
}

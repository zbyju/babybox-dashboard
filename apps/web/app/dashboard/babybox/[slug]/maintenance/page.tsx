import MaintenancesPageClient from "@/components/page-components/maintenance/client-page";

interface PageParams {
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function MaintenancesPage({ params }: PageProps) {
  const { slug } = await params;

  return <MaintenancesPageClient slug={slug} />;
}

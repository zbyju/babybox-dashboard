import MaintenancesAddPageClient from "@/components/page-components/maintenance/create/client-page";

interface PageParams {
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function MaintenancesAddPage({ params }: PageProps) {
  const { slug } = await params;

  return <MaintenancesAddPageClient slug={slug} />;
}

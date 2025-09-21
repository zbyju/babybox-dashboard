import MaintenancePageClient from "@/components/page-components/maintenance/id/client-page";

interface PageParams {
  id: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function MaintenancePage({ params }: PageProps) {
  const { id } = await params;

  return <MaintenancePageClient id={id} />;
}

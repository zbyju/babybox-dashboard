import NotificationEditPageClient from "@/components/page-components/notifications/id/edit/client-page";

interface PageParams {
  id: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function NotificationEditPage({ params }: PageProps) {
  const { id } = await params;

  return <NotificationEditPageClient id={id} />;
}

import NotificationsPageClient from "@/components/notifications/client-page";

interface PageParams {
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function NotificationsPage({ params }: PageProps) {
  const { slug } = await params;

  return <NotificationsPageClient slug={slug} />;
}

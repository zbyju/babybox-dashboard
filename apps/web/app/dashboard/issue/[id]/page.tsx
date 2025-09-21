import IssuePageClient from "@/components/page-components/issue/id/client-page";

interface PageParams {
  id: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function IssuePage({ params }: PageProps) {
  const { id } = await params;

  return <IssuePageClient id={id} />;
}

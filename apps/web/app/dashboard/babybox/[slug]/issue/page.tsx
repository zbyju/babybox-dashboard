import IssuesPageClient from "@/components/page-components/issue/client-page";

interface PageParams {
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function IssuesPage({ params }: PageProps) {
  const { slug } = await params;

  return <IssuesPageClient slug={slug} />;
}

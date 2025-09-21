import ReportPageClient from "@/components/page-components/report/client-page";

interface PageParams {
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function ReportPage({ params }: PageProps) {
  const { slug } = await params;

  return <ReportPageClient slug={slug} />;
}

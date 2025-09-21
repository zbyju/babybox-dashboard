import BabyboxEditPageClient from "@/components/page-components/edit/client-page";

interface PageParams {
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function BabyboxEditPage({ params }: PageProps) {
  const { slug } = await params;

  return <BabyboxEditPageClient slug={slug} />;
}

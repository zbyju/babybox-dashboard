import BabyboxPageClient from "@/components/page-components/babybox/client-page";

interface PageParams {
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function BabyboxPage({ params }: PageProps) {
  const { slug } = await params;

  return <BabyboxPageClient slug={slug} />;
}

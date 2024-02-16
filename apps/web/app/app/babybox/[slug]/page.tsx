import BabyboxSideMenu from "@/components/babybox-side-menu";


export default function BabyboxPage({ params }: { params: { slug: string } }) {
  const slug = params.slug
  return (
    <div className="flex w-screen">
      <BabyboxSideMenu babybox={{ slug, name: slug }} />
      <div className="grid grid-cols-4 gap-4 ml-[16%] flex-grow">
      </div>
    </div>
  )
}

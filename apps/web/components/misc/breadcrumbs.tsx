import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../ui/breadcrumb";

interface Props {
  links: { href: string; label: string }[];
}

export default function Breadcrumbs({ links }: Props) {
  return (
    <Breadcrumb className="mb-2">
      <BreadcrumbList>
        {(links || []).map((l) => (
          <div key={l.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem key={l.href}>
              <BreadcrumbLink href={l.href}>{l.label}</BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

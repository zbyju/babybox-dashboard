import { BabyboxesContext } from "../contexts/babyboxes-context";
import Breadcrumbs from "./breadcrumbs";
import { useContext } from "react";

interface Props {
  dashboard?: boolean;
  slug?: string;
  links?: { href: string; label: string }[];
}

export default function BreadcrumbsDashboard({
  dashboard,
  slug,
  links,
}: Props) {
  const { getBabyboxBySlug } = useContext(BabyboxesContext);
  const babybox = getBabyboxBySlug(slug || "");
  const dashboardLink =
    dashboard === true
      ? [{ href: "/dashboard/babybox", label: "Dashboard" }]
      : [];
  const babyboxLink =
    slug !== undefined
      ? [
          {
            href: "/dashboard/babybox/" + slug,
            label: `Babybox ${babybox?.name || slug || "Nenalezeno"}`,
          },
        ]
      : [];
  const allLinks = dashboardLink.concat(babyboxLink).concat(links || []);
  return <Breadcrumbs links={allLinks} />;
}

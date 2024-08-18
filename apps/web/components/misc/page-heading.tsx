import { BabyboxesContext } from "../contexts/babyboxes-context";
import { useContext } from "react";
import { cn } from "@/lib/utils";

interface Props {
  heading: string;
  slug?: string;
  headingClassName?: string;
  subheadingClassName?: string;
  wrapperClassName?: string;
}

export default function PageHeading({
  heading,
  slug,
  headingClassName,
  subheadingClassName,
  wrapperClassName,
}: Props) {
  const { getBabyboxBySlug } = useContext(BabyboxesContext);
  const babybox = getBabyboxBySlug(slug);
  return (
    <div className={cn("mb-4", wrapperClassName)}>
      <h1 className={cn("text-3xl font-bold", headingClassName)}>{heading}</h1>
      {slug && (
        <h2
          className={cn(
            "text-xl font-semibold text-muted-foreground",
            subheadingClassName,
          )}
        >
          Babybox {babybox?.name || babybox?.slug || "Nenalezeno"}
        </h2>
      )}
    </div>
  );
}

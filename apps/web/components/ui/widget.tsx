export default function Widget({
  children,
  title,
  subtitle,
  className,
  classNameInner,
}: Readonly<{
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  classNameInner?: string;
}>) {
  return (
    <div className={"h-auto min-w-[200px] " + className || ""}>
      <div
        className={
          "flex flex-col rounded-lg border border-border px-4 pb-3 pt-4 shadow-md transition-all duration-500 hover:shadow-lg " +
            classNameInner || ""
        }
      >
        <div className="mb-3 px-1 py-2">
          <h3 className="text-2xl font-semibold leading-3 text-foreground">
            {title || ""}
          </h3>
          <h4 className="text-lg text-muted-foreground">{subtitle || ""}</h4>
        </div>
        <div className="flex-grow overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

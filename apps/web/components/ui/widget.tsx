import React from "react";

export default function Widget({
  children,
  title,
  className,
  classNameInner,
}: Readonly<{
  children: React.ReactNode;
  title?: string;
  className?: string;
  classNameInner?: string;
}>) {
  return (
    <div
      className={"aspect-[10/7] h-auto w-full min-w-[200px] " + className || ""}
    >
      <div
        className={
          "flex flex-col rounded-lg border border-border px-4 pb-2 pt-4 shadow-md transition-all duration-500 hover:shadow-lg " +
            classNameInner || ""
        }
      >
        <h3 className="mb-3 px-1 text-2xl font-semibold text-foreground">
          {title || ""}
        </h3>
        <div className="flex-grow overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

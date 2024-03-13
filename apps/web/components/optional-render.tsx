export default function OptionalRender({
  children,
  content,
}: Readonly<{
  children: React.ReactNode;
  content: unknown | undefined | null;
}>) {
  return content ? <>{children}</> : null;
}

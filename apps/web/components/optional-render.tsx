export default function OptionalRender({
  children,
  content,
}: Readonly<{
  children: React.ReactNode;
  content: any | undefined | null;
}>) {
  return content ? <>{children}</> : null;
}

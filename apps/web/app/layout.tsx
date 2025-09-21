import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/contexts/theme-provider";
import AuthProvider from "@/components/contexts/auth-context";
import { Noto_Sans as FontSans } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

const fontSans = FontSans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Babybox Dashboard",
  description:
    "Babybox Dashboard aplikace pro sledování a analýzu dat z babyboxů.",
  applicationName: "Babybox Dashboard",
  appleWebApp: {
    capable: true,
    title: "Babybox Dashboard",
  },
};

function getTheme() {
  const cookieStore = cookies();
  const themeCookie = cookieStore.get("theme");
  const theme = themeCookie ? themeCookie.value : "dark";
  return theme;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = getTheme() as string;

  return (
    <html
      lang="en"
      className={theme}
      style={{ colorScheme: theme }}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#FFF" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '#020817')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>

      <body className={`${fontSans.className}`}>
        <div className="mb-12 w-screen max-w-full overflow-x-hidden">
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              storageKey="theme"
              enableSystem
            >
              {children}
              <Toaster richColors />
            </ThemeProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}

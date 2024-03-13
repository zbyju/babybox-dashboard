import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/contexts/theme-provider";
import { AuthProvider } from "@/components/contexts/auth-context";
import { Nunito as FontSans } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

const fontSans = FontSans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
    <html lang="en" className={theme} style={{ colorScheme: theme }}>
      <head>
        <meta name="application-name" content="Babybox Dashboard" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Babybox" />
        <meta
          name="description"
          content="Babybox Dashboard aplikace pro sledování a analýzu dat z babyboxů."
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={fontSans.className}>
        <div className="mb-12 w-screen max-w-full overflow-x-hidden">
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              storageKey="theme"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}

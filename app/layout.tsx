import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { cookies } from "next/headers";
import { Language } from "@/lib/i18n/translations";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LuxeEstate - Premium Real Estate",
  description: "Find your sanctuary. Premium real estate listings and properties.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("language")?.value as Language) || "en";

  return (
    <html
      lang={lang}
      className={`${inter.variable} h-full antialiased selection:bg-mosque selection:text-white`}
    >
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-background-light text-nordic-dark font-display">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

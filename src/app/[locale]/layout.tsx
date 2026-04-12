import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { config } from "@/config";
import { Providers } from "@/providers/providers";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: config.app.name,
    template: `%s | ${config.app.name}`,
  },
  description: "Your ultimate tour booking platform in Da Nang",
  keywords: ["travel", "tour", "da nang", "booking"],
  authors: [{ name: config.app.name }],
  creator: config.app.name,
  openGraph: {
    title: config.app.name,
    description: "Your ultimate tour booking platform in Da Nang",
    url: config.app.url,
    siteName: config.app.name,
    locale: "vi_VN",
    type: "website",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { config } from "@/config";
import { Providers } from "@/providers/providers";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import "./globals.css";

/** Fonts: use system stack in globals.css — avoids next/font/google network fetch (fails offline / some CI). */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  const appName = t("common.brand_name");
  const description = t("footer.description");

  return {
    title: {
      default: appName,
      template: `%s | ${appName}`,
    },
    description: description,
    keywords: ["travel", "tour", "da nang", "booking"],
    authors: [{ name: appName }],
    creator: appName,
    openGraph: {
      title: appName,
      description: description,
      url: config.app.url,
      siteName: appName,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      type: "website",
    },
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <div className="h-full antialiased">
      <Providers locale={locale} messages={messages}>
        {children}
      </Providers>
    </div>
  );
}

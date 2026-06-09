import { redirect } from "@/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function NearbyRedirectPage({ params }: PageProps) {
  const { locale } = await params;
  redirect({ href: "/map?mode=nearby", locale });
}

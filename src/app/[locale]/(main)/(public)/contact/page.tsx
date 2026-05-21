import { getTranslations } from "next-intl/server";
import { ContactHero, ContactInfoCard, ContactForm } from "@/features/contact/components";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: `${t("title")} | DaNangTrip`,
    description: t("subtitle"),
  };
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <ContactHero />

      {/* Main Content Section */}
      <div className="design-container design-section pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Contact Info - Sticky on Desktop */}
          <aside className="lg:col-span-4 xl:col-span-4">
            <div className="lg:sticky lg:top-32">
              <ContactInfoCard />
            </div>
          </aside>

          {/* Form - Main content area */}
          <section className="lg:col-span-8 xl:col-span-8">
            <ContactForm />
          </section>
        </div>
      </div>
    </main>
  );
}

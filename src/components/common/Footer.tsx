import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <p>{t("footer.copyright", { year: currentYear })}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">{t("social.facebook")}</a>
            <a href="#" className="hover:text-gray-300">{t("social.instagram")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

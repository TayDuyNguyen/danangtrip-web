import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AmbientBackgroundLazy from "@/components/layout/AmbientBackgroundLazy";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="design-page layout-main-shell min-h-screen">
      <AmbientBackgroundLazy />
      <Header />
      <div className="pt-[92px]">{children}</div>
      <Footer />
    </div>
  );
}

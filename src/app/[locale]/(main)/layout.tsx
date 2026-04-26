import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AmbientBackground from "@/components/layout/AmbientBackground";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="design-page min-h-screen">
      <AmbientBackground />
      <Header />
      <div className="pt-20">{children}</div>
      <Footer />
    </div>
  );
}

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">{children}</main>
      <Footer />
    </>
  );
}

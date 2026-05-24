import NearbyClient from "@/features/locations/nearby/components/NearbyClient";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Discover Da Nang Tourist Places Near You | DanangTrip"
      : "Tìm Địa điểm du lịch gần bạn ở Đà Nẵng | DanangTrip",
    description: isEn
      ? "Scan your GPS location to easily discover nearby tourist spots, restaurants, cafes, and entertainment in Da Nang, complete with interactive map routing."
      : "Quét vị trí GPS hiện tại của bạn để tìm nhanh các điểm tham quan, ẩm thực, khu vui chơi gần đây ở Đà Nẵng với chỉ dẫn khoảng cách và bản đồ mượt mà.",
  };
}

export default async function NearbyPage({ params }: PageProps) {
  const { locale } = await params;
  
  return <NearbyClient locale={locale} />;
}

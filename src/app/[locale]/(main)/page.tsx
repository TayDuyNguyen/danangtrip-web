import {
  Hero,
  StatsBar,
  CategoryGrid,
  FeaturedLocations,
  TourCategories,
  FeaturedTours,
  HotTours,
  TravelBlog
} from "@/features/home";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <Hero />
      <StatsBar />
      <CategoryGrid />
      <FeaturedLocations />
      <TourCategories />
      <FeaturedTours />
      <HotTours />
      <TravelBlog />
    </main>
  );
}

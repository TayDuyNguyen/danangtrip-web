import {
  Hero,
  StatsBar,
  CategoryGrid,
  Recommendations,
  FeaturedLocations,
  TourCategories,
  FeaturedTours,
  HotTours,
  TravelBlog
} from "@/features/home";

export default function Home() {
  return (
    <main className="design-page layout-main-shell flex flex-col flex-1">
      <Hero />
      <StatsBar />
      <CategoryGrid />
      <Recommendations />
      <FeaturedLocations />
      <TourCategories />
      <FeaturedTours />
      <HotTours />
      <TravelBlog />
    </main>
  );
}

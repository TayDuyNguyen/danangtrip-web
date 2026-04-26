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
    <main className="design-page flex flex-col flex-1">
      <section className="reveal-up">
        <Hero />
      </section>
      <section className="reveal-up reveal-delay-100">
        <StatsBar />
      </section>
      <section className="reveal-up reveal-delay-200">
        <CategoryGrid />
      </section>
      <section className="reveal-up reveal-delay-300">
        <FeaturedLocations />
      </section>
      <section className="reveal-up reveal-delay-100">
        <TourCategories />
      </section>
      <section className="reveal-up reveal-delay-200">
        <FeaturedTours />
      </section>
      <section className="reveal-up reveal-delay-300">
        <HotTours />
      </section>
      <section className="reveal-up reveal-delay-400">
        <TravelBlog />
      </section>
    </main>
  );
}

import {
  Hero,
  StatsBar,
  CategoryGrid,
  Recommendations,
  FeaturedLocations,
  TourCategories,
  FeaturedTours,
  HotTours,
  TravelBlog,
  HomeSectionReveal
} from "@/features/home";

export default function Home() {
  return (
    <main className="design-page layout-main-shell flex flex-col flex-1">
      <Hero />
      <HomeSectionReveal delay={0.02}>
        <StatsBar />
      </HomeSectionReveal>
      <HomeSectionReveal delay={0.04}>
        <CategoryGrid />
      </HomeSectionReveal>
      <HomeSectionReveal delay={0.06}>
        <Recommendations />
      </HomeSectionReveal>
      <HomeSectionReveal delay={0.08}>
        <FeaturedLocations />
      </HomeSectionReveal>
      <HomeSectionReveal delay={0.1}>
        <TourCategories />
      </HomeSectionReveal>
      <HomeSectionReveal delay={0.12}>
        <FeaturedTours />
      </HomeSectionReveal>
      <HomeSectionReveal delay={0.14}>
        <HotTours />
      </HomeSectionReveal>
      <HomeSectionReveal delay={0.16}>
        <TravelBlog />
      </HomeSectionReveal>
    </main>
  );
}



import { Hero, Discovery, Testimonials, HotTours, TravelBlog } from "@/features/home";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <Hero />
      <Discovery />
      <HotTours />
      <TravelBlog />
      <Testimonials />
    </main>
  );
}

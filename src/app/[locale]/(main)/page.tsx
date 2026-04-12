import { Hero, Discovery, Testimonials } from "@/features/home";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <Hero />
      <Discovery />
      <Testimonials />
    </main>
  );
}

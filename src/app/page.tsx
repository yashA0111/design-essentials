import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeSection } from "@/components/sections/MarqueeSection";
import { AboutSnippetSection } from "@/components/sections/AboutSnippetSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { FeaturedProjectsSection } from "@/components/sections/FeaturedProjectsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { EcoSection } from "@/components/sections/EcoSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactCTASection } from "@/components/sections/ContactCTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <AboutSnippetSection />
      <ServicesSection />
      <FeaturedProjectsSection />
      <ProcessSection />
      <StatsSection />
      <EcoSection />
      <TestimonialsSection />
      <ContactCTASection />
    </>
  );
}
